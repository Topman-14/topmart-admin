import { NextResponse } from "next/server";
import {auth} from '@clerk/nextjs'

import prismadb from "@/lib/prismadb";

export async function POST( 
    req: Request,
    { params }: { params: { storeId: string } }){
    try{
        const { userId } = auth();
        const body = await req.json();
        const { 
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            quantity,
            description,
            isFeatured,
            isArchived
         } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        [name, price, categoryId, colorId, sizeId].forEach((field) => {
            if (!field) {
                return new NextResponse(`${field} is required`, { status: 400 });
            }
        
        })
        if (!images || !images.length) {
            return new NextResponse('Image is required', { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 403 });
        }

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                sizeId,
                quantity,
                description,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [...images.map((image: {url: string}) => image)]
                    }
                }
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.error('PRODUCTS_POST', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function GET( 
    req: Request,
    { params }: { params: { storeId: string } }){
    try{

        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get('categoryId') || undefined;
        const colorId = searchParams.get('colorId') || undefined;
        const sizeId = searchParams.get('sizeId') || undefined;
        const isFeatured = searchParams.get('isFeatured') || undefined;
        
        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);

    } catch (error) {
        console.error('PRODUCTS_GET', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}