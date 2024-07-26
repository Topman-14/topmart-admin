import { NextResponse } from "next/server"
import prismadb from "@/lib/prismadb"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { orderId } = body;

        const order = await prismadb.order.update({
            where: {
                id: orderId
            },
            data: {
                isPaid: true,
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

        return new NextResponse('Order Fufilled successfully!', { status: 200, headers: corsHeaders });
    } catch (error) {
        console.error('Error updating order:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export function OPTIONS() {
    return new NextResponse(null, {
        headers: corsHeaders
    });
}