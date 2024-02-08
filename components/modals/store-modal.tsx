'use client'

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal"

export const StoreModal = () => {
    const {isOpen, onClose} = useStoreModal();
    return(
        <Modal 
            title="Create Store"
            description="Add a new store to your account"
            isOpen={isOpen}
            onClose={onClose}
        >
            Create Store Form
        </Modal>
    )
}
