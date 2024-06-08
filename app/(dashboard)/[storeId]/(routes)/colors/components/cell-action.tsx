'use client'

import axios from 'axios'
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ColorColumn } from "./columns"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AlertModal } from '@/components/modals/alert-modal';

interface CellActionProps {
    data: ColorColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(false)
    const [isOpen, setOpen] = useState(false)

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success('Color Id copied to clipboard!')
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/colors/${data.id}`)
            router.refresh()
            toast.success('Color deleted!')
        } catch (error) {
            toast.error('Make sure you removed all products using this color first!')
            console.error(error)
        } finally{
            setLoading(false)
            setOpen(false)
        }
    }

    return(
        <>
        <AlertModal
            isOpen={isOpen}
            onClose={()=> setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
        />
            <DropdownMenu>
                <DropdownMenuTrigger asChild >
                    <Button variant={'ghost'} className="size-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="size-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={()=> onCopy(data.id)}>
                        <Copy className="size-4 mr-2"/>
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> router.push(`/${params.storeId}/colors/${data.id}`)}>
                        <Edit className="size-4 mr-2"/>
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" onClick={()=> setOpen(true)}>
                        <Trash className="size-4 mr-2"/>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
       </>
    )
}