'use client'

import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import * as z from "zod";
import { Billboard, Category } from "@prisma/client"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingButton } from "@/components/ui/loader-button";

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
    initialData: Category | null;
    billboards: Billboard[];
}

const CategoryForm: React.FC<CategoryFormProps> = ({initialData, billboards}) => {

    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const title = initialData ? 'Edit Category' : 'Create Category'
    const description = initialData ? 'Edit a Category' : 'Add a new Category'
    const toastMessage = initialData ? 'Category updated' : 'Category created'
    const action = initialData ? 'Save Changes' : 'Create'

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            billboardId: ''
        },
    });

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/categories`, data)
            }
            router.push(`/${params.storeId}/categories`)
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.push(`/${params.storeId}/categories`)
            router.refresh()
            toast.success('Category deleted!')
        } catch (error) {
            toast.error('Make sure you removed all products using this category first!')
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <FormField 
                    control={form.control} 
                    name="name"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input disabled={loading} placeholder="Category Label" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>)}
                 />
                <FormField 
                    control={form.control} 
                    name="billboardId"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>Billboard</FormLabel>
                           <Select 
                                disabled={loading} 
                                onValueChange={field.onChange} 
                                value={field.value}
                                defaultValue={field.value} 
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            defaultValue={field.value} 
                                            placeholder="Select a billboard"
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {billboards.map((billboard) => (
                                        <SelectItem
                                            key={billboard.id}
                                            value={billboard.id}
                                        >
                                            {billboard.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                           </Select>
                        <FormMessage />
                    </FormItem>)}
                 />
              </div>
              <LoadingButton
                loading={loading} 
                className="font-semibold ml-auto"
                type="submit"
                disabled={loading}
                >
                {action}
              </LoadingButton>
            </form>
        </Form>
        <Separator />
    </>
  )
}

export default CategoryForm