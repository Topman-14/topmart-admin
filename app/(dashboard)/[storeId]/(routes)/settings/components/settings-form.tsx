'use client'

import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import * as z from "zod";
import { Store } from "@prisma/client"
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
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import { LoadingButton } from "@/components/ui/loader-button";
import { Checkbox } from "@/components/ui/checkbox";

interface SettingsFormProps {
    initialData: Store;
}

const formSchema = z.object({
    name: z.string().min(1),
    isDeveloper: z.boolean(),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({initialData}) => {

    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true)
            await axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh();
            toast.success('Store updated!')
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
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh()
            router.push('/')
            toast.success('Store deleted!')
        } catch (error) {
            toast.error('Make sure you removed all products and categories first!')
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
            title="Settings"
            description="Manage store preferences"
        />
        <Button 
            disabled={loading}
            variant={"destructive"}
            size={'icon'}
            onClick={()=> setOpen(true)}
        >
            <Trash className="size-4"/>
        </Button>
        </div>
        <Separator />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
              <div className="grid grid-cols-3 gap-8 items-center">
                <FormField 
                    control={form.control} 
                    name="name"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input disabled={loading} placeholder="Store name" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>)}
                 />
                 <FormField 
                    control={form.control} 
                    name="isDeveloper"
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
                                <FormLabel>Developer Mode</FormLabel>
                                <FormDescription 
                                    style={{
                                            maxHeight: field.value? '100px': '0',
                                            overflow: 'hidden',
                                            opacity: field.value? '1': '0',
                                        }}
                                    className={`transition-all text-xs`}>
                                    This will make API endpoints visible throughout the store
                                </FormDescription>
                            </div>
                        </FormItem>
                    </label>)}
                 />
              </div>
              <LoadingButton
                loading={loading} 
                className="font-semibold ml-auto"
                type="submit"
                disabled={loading}
                >
                Save Changes
              </LoadingButton>
            </form>
        </Form>
        <Separator />
        <ApiAlert 
            title="NEXT_PUBLIC_API_URL" 
            description={`${origin}/api/${params.storeId}`}
            variant='public' 
        />
    </>
  )
}

export default SettingsForm