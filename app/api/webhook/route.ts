import Stripe from "stripe"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import prismadb from "@/lib/prismadb"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string

export async function POST(req: Request) {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature") as string

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country
    ]

    const addressString = addressComponents.filter((c) => c !== null).join(', ');

    if (event.type == "checkout.session.completed") {
        const order = await prismadb.order.update({
            where: {
                id: session?.metadata?.orderId
            },
            data: {
                isPaid: true,
                address: addressString,
                phone: session?.customer_details?.phone || ''
            },
            include: {
                orderItems: true,
            }
        });

        for (const orderItem of order.orderItems) {
            const product = await prismadb.product.findUnique({
                where: { id: orderItem.productId }
            });

            if (product) {
                const newQuantity = product.quantity - orderItem.quantity;

                await prismadb.product.update({
                    where: { id: product.id },
                    data: {
                        quantity: newQuantity,
                        isArchived: newQuantity <= 0 ? true : product.isArchived
                    }
                });
            }
        }
    }

    return new NextResponse(null, { status: 200 });
}
