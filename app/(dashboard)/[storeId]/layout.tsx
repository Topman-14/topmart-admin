import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: { storeId: string}
}){
    const { userId } = auth();
    
    if (!userId) {
       redirect('/sign-in');
    }

    try{
        const store = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });
    
        if (!store) {
            redirect('/');
        }


    } catch (error) {
        notFound();
    }


    return(
        <>
        <Navbar />
        {children}
        </>
    )
}