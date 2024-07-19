"use client"

import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { BillboardColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface BillboardClientProps {
    data: BillboardColumn[]
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) =>{
    const router = useRouter();
    const params = useParams();

    return(
        <>
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <Heading
                    title={`Billboards (${data.length})`}
                    description="Manage store billboards"
                 />
                 <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)} className="font-bold">
                    <Plus className="size-5 mr-1"/>
                    Add New
                 </Button>
            </div>
            <Separator />
            <DataTable searchKey="label" columns={columns} data={data}/>
            <ApiList entityName="billboards" entityIdName="billboardId"/>
        </>
    )
}