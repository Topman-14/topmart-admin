'use client'

import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import * as z from "zod";
import { Category, Color, Image, Product, Size } from "@prisma/client"
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
    FormDescription, 
    FormField, 
    FormItem, 
    FormLabel,
    FormMessage
 } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const requiredMsg = "This field is required" //I'm just really lazy

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({url: z.string()}).array().min(1, "Please upload at least one image"),
    price: z.coerce.number().min(1, requiredMsg),
    categoryId: z.string().min(1, requiredMsg),
    colorId: z.string().min(1, requiredMsg),
    sizeId: z.string().min(1, requiredMsg),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional()
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialData: Product & {
        images: Image[]
    } | null;
    categories: Category[];
    sizes: Size[];
    colors: Color[];
}

const ProductForm: React.FC<ProductFormProps> = ({initialData, sizes, colors, categories}) => {

    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const title = initialData ? 'Edit Product' : 'Create Product'
    const description = initialData ? 'Edit a Product' : 'Add a new Product'
    const toastMessage = initialData ? 'Product updated' : 'Product created'
    const action = initialData ? 'Save Changes' : 'Create'

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
                ...initialData,
                price: parseFloat(String(initialData?.price)),
        } : {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            sizeId: '',
            isFeatured: false,
            isArchived: false,
        },
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/products`, data)
            }
            router.push(`/${params.storeId}/products`)
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.push(`/${params.storeId}/products`)
            router.refresh()
            toast.success('Product deleted!')
        } catch (error) {
            toast.error('Something went wrong!')
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
                    name="images"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>Images</FormLabel>
                        <FormControl>
                           <ImageUpload 
                                value={field.value?.map((image) => image.url)}
                                disabled={loading}
                                onChange={(url) => field.onChange([...field.value, { url }])}
                                onRemove={(url) => field.onChange([...field.value.filter(current => current.url !== url)])}
                                placeholder="Upload product images"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>)}
                 />
              <div className="grid grid-cols-3 items-end gap-8">
                <FormField 
                    control={form.control} 
                    name="name"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input disabled={loading} placeholder="Enter product name" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>)}
                 />

                <FormField 
                    control={form.control} 
                    name="price"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                            <Input disabled={loading} placeholder="9.99" type="number" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>)}
                 />

                <FormField 
                    control={form.control} 
                    name="categoryId"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
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
                                            placeholder="Select a category"
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                           </Select>
                        <FormMessage />
                    </FormItem>)}
                 />

                <FormField 
                    control={form.control} 
                    name="sizeId"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>Size</FormLabel>
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
                                            placeholder="Select a size"
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {sizes.map((size) => (
                                        <SelectItem
                                            key={size.id}
                                            value={size.id}
                                        >
                                            {size.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                           </Select>
                        <FormMessage />
                    </FormItem>)}
                 />

                <FormField 
                    control={form.control} 
                    name="colorId"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>Colors</FormLabel>
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
                                            placeholder="Select a color"
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {colors.map((color) => (
                                        <SelectItem
                                            key={color.id}
                                            value={color.id}
                                        >
                                            {color.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                           </Select>
                        <FormMessage />
                    </FormItem>)}
                 />

                <FormField 
                    control={form.control} 
                    name="isFeatured"
                    render={({field}) => (
                    <label className="cursor-pointer">
                        <FormItem className={`flex overflow-hidden flex-row items-start space-x-3 space-y-0 border rounded-md p-3 ${field.value && "border-primary"}`}>
                            <FormControl>
                                <Checkbox
                                    disabled={loading}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Featured</FormLabel>
                                <FormDescription 
                                    style={{
                                            maxHeight: field.value? '100px': '0',
                                            overflow: 'hidden',
                                            opacity: field.value? '1': '0',
                                        }}
                                    className={`transition-all text-xs`}>
                                    This product will appear in your homepage
                                </FormDescription>
                            </div>
                        </FormItem>
                    </label>)}
                 />

                <FormField 
                    control={form.control} 
                    name="isArchived"
                    render={({field}) => (
                        <label className="cursor-pointer">
                            <FormItem className={`flex flex-row items-start space-x-3 ${field.value && "border-primary"} space-y-0 border rounded-md p-3`}>
                                <FormControl>
                                    <Checkbox
                                        disabled={loading}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Archived</FormLabel>
                                    <FormDescription
                                        style={{
                                            maxHeight: field.value? '100px': '0',
                                            overflow: 'hidden',
                                            opacity: field.value? '1': '0',
                                        }}
                                        className={`transition-all text-xs`}
                                    >
                                        This product will not appear anywhere in the store
                                    </FormDescription>
                                </div>
                            </FormItem>
                        </label>)}
                 />
                 
              </div>
              <Button 
                className="font-extrabold ml-auto"
                type="submit"
                disabled={loading}
                >
                {action}
              </Button>
            </form>
        </Form>
        <Separator />
    </>
  )
}

export default ProductForm