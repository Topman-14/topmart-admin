"use client"

import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { CategoryColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface CategoryClientProps {
    data: CategoryColumn[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({ data }) =>{
    const router = useRouter();
    const params = useParams();

    return(
        <>
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <Heading
                    title={`Categories (${data.length})`}
                    description="Manage store categories"
                 />
                 <Button onClick={() => router.push(`/${params.storeId}/categories/new`)} className="font-bold">
                    <Plus className="size-5 mr-1"/>
                    Add New
                 </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data}/>
            <ApiList entityName="categories" entityIdName="categoryId"/>
        </>
    ) 
}