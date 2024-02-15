'use client'

import * as z from 'zod';

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '../ui/input';

const formSchema = z.object({
    name: z.string().min(1),
})

export const StoreModal = () => {
    const {isOpen, onClose} = useStoreModal();

    const form = useForm<z.infer <typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        }
    })

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        // Create store
    }

    return(
        <Modal 
            title="Create Store"
            description="Add a new store to your account"
            isOpen={isOpen}
            onClose={onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                             control={form.control}
                             name="name"
                             render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="E-Commerce" {...field}/>
                                    </FormControl>
                                </FormItem>
                             )}
                            >

                            </FormField>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}
