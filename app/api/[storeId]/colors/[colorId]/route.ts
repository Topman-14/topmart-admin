import { NextResponse } from "next/server";
import {auth} from '@clerk/nextjs'

import prismadb from "@/lib/prismadb";

export async function GET( 
    req: Request,
    { params }: { params: { colorId: string } }){
    try{
        if (!params.colorId) {
            return new NextResponse('Color ID is required', { status: 400 });
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.error('COLOR_GET', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function PATCH( 
    req: Request,
    { params }: { params: { storeId: string, colorId: string } }){
    try{
        const { userId } = auth();
        const body = await req.json();
        const { name, value } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!name) {
            return new NextResponse('Name is required', { status: 400 });
        }

        if (!value) {
            return new NextResponse('Value is required', { status: 400 });
        }

        if (!params.colorId) {
            return new NextResponse('Color id is required', { status: 400 });
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

        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId
            }, 
            data: {
                name,
                value,
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.error('COLOR_PATCH', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function DELETE( 
    req: Request,
    { params }: { params: { storeId: string, colorId: string } }){
    try{
        const { userId } = auth();
        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }
        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }
        if (!params.colorId) {
            return new NextResponse('Color ID is required', { status: 400 });
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

        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.error('CATEGORY_DELETE', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}