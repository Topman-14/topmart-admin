'use client'
import { Copy, Server } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ApiAlertProps {
    title: string;
    description: string;
    variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps['variant'], string> = {
    public: 'Public',
    admin: 'Admin'
};

const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
    public: 'secondary',
    admin: 'destructive'
};

export const ApiAlert: React.FC<ApiAlertProps> = ({ title, description, variant="public" }) => {
    const onCopy = () => {
        navigator.clipboard.writeText(description)
        toast.success('API route copied to clipboard!')
    }
    return(
        <Alert>
            <Server className="size-4"/>
            <AlertTitle className="flex items-center gap-x-2">
                {title}
                <Badge variant={variantMap[variant]}>
                    {textMap[variant]}
                </Badge>
            </AlertTitle>
            <AlertDescription className="mt-4 flex pl-0 md:ml-0 ml-[-28px]  gap-1 justify-between ">
                <code style={{wordBreak: 'break-all'}} className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm w-fit h-fit">
                    {description}
                </code>
                <Button className="min-w-4" variant="outline" size="icon" onClick={onCopy}>
                    <Copy className="size-4"/>
                </Button>
            </AlertDescription>
        </Alert>
    )
}