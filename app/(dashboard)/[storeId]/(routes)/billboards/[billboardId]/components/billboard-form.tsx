'use client'

import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import * as z from "zod";
import { Billboard } from "@prisma/client"
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel,
    FormMessage
 } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { LoadingButton } from "@/components/ui/loader-button";

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
    initialData: Billboard | null;
}

const BillboardForm: React.FC<BillboardFormProps> = ({initialData}) => {

    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const title = initialData ? 'Edit Billboard' : 'Create Billboard'
    const description = initialData ? 'Edit a Billboard' : 'Add a new Billboard'
    const toastMessage = initialData ? 'Billboard updated' : 'Billboard created'
    const action = initialData ? 'Save Changes' : 'Create'

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        },
    });

    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, data)
            }
            router.push(`/${params.storeId}/billboards`)
            router.refresh();
            toast.success(toastMessage)
        } catch (error) {
            toast.error('Something went wrong!')
            console.error(error)
        } finally{
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.push(`/${params.storeId}/billboards`)
            router.refresh()
            toast.success('Billboard deleted!')
        } catch (error) {
            toast.error('Make sure you removed all categories using this billboard first!')
            console.error(error)
        } finally{
            setLoading(false)
            setOpen(false)
        }
    }

  return (
    <>
        <AlertModal 
            isOpen={open}
            onClose={()=> setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
        />
        <div className="flex items-center justify-between">
        <Heading
            title={title}
            description={description}
        />
       {initialData && (<Button 
            disabled={loading}
            variant={"destructive"}
            size={'icon'}
            onClick={()=> setOpen(true)}
        >
         <Trash className="size-4"/>
        </Button>)}
        </div>
        <Separator />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            <FormField 
                    control={form.control} 
                    name="imageUrl"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>Background image</FormLabel>
                        <FormControl>
                           <ImageUpload 
                                disabled={loading}
                                onChange={(url) => field.onChange(url)}
                                onRemove={() => field.onChange('')}
                                value={field.value? [field.value] : []}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>)}
                 />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <FormField 
                    control={form.control} 
                    name="label"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                            <Input disabled={loading} placeholder="Billboard Label" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>)}
                 />
              </div>
              <LoadingButton
                className="font-semibold ml-auto"
                type="submit"
                disabled={loading}
                loading={loading}
                >
                {action}
              </LoadingButton>
            </form>
        </Form>
        <Separator />
    </>
  )
}

export default BillboardForm