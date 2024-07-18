import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import { stripe } from '@/lib/stripe'
import prismadb from '@/lib/prismadb'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

const frontendUrl = process.env.FRONTEND_STORE_URL as string

export async function OPTIONS(){
    return NextResponse.json({}, { headers: corsHeaders})
};

export async function POST(
    req: Request,
    { params }: { params: { storeId: string }}
) {
    const { products: productRequests } = await req.json()

    if (!productRequests || productRequests.length === 0) {
        return new NextResponse("Product requests are required", { status: 400 })
    }

    const productIds = productRequests.map((product: { id: string, quantity: number }) => product.id);

    const products = await prismadb.product.findMany({
        where: {
            id: {
                in: productIds
            }
        }
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    products.forEach((product) => {
        const request = productRequests.find((p: { id: string, quantity: number }) => p.id === product.id);
        if (request) {
            line_items.push({
                quantity: request.quantity,
                price_data: {
                    currency: "NGN",
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: product.price * 100
                }
            });
        }
    })

    const order = await prismadb.order.create({
        data: {
            storeId: params.storeId,
            isPaid: false,
            orderItems: {
                create: productRequests.map((product: { id: string, quantity: number }) => ({
                    product: {
                        connect: { 
                            id: product.id
                        }
                    },
                    quantity: product.quantity
                }))
            }
        }
    })

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        billing_address_collection: 'required',
        phone_number_collection: {
            enabled: true
        },
        success_url: `${frontendUrl}/cart?success=1`,
        cancel_url: `${frontendUrl}/cart?canceled=1`,
        metadata: {
            orderId: order.id
        }
    });

    return NextResponse.json({ url: session.url }, { headers: corsHeaders });
}
