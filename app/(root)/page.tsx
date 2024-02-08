"use client"
import { Modal } from "@/components/ui/modal";
import { UserButton } from "@clerk/nextjs";

export default function SetUp() {
  return (
    <div className="p-4">
      <Modal isOpen onClose={() => {}} title="Welcome to your TopMart!" description="Let's get started!">
        <div className="p-4">
          <h2 className="text-2xl font-semibold">Welcome to TopMart!</h2>
          <p className="mt-2">
            We're excited to have you join us. Let's get started by setting up your account.
          </p>
        </div>
      </Modal>
       <UserButton afterSignOutUrl="/" />
    </div>
  )
}
