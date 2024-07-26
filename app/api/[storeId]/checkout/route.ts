import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

export async function POST( 
    req: Request,
    { params }: { params: { storeId: string } }){
    try{
        const { products, metadata } = await req.json()

        if (!products || products.length === 0) {
            return new NextResponse("Product Ids are required", { status: 400 })
        }

        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        const order = await prismadb.order.create({
            data: {
                storeId: params.storeId,
                isPaid: false,
                address: metadata?.address || '',
                phone: metadata?.phone || '',
                email: metadata?.email || '',
                orderItems: {
                    create: products
                    .map((product: { id: string, quantity: number }) => ({
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

        return NextResponse.json(order, { headers: corsHeaders });
    } catch (error) {
        console.error('ORDERS_POST', error);
        return new NextResponse('Internal Server Error', { 
            headers: corsHeaders,
            status: 500
         });
    }
}

export function OPTIONS() {
    return new NextResponse(null, {
        headers: corsHeaders
    });
}