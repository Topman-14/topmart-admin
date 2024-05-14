"use client"

import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

export const BillboardClient = () =>{
    const router = useRouter();
    const params = useParams();
    return(
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Billboards (0)"
                    description="Manage store billboards"
                 />
                 <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className="size-4 mr-2"/>
                    Add New
                 </Button>
            </div>
            <Separator />
        </>
    )
}