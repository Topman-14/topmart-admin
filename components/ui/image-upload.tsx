'use client'
import { useEffect, useState } from "react"
import { ImagePlus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
    placeholder?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value,
    placeholder
}) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    }

    if(!isMounted){
        return null;
    }

  return (
    <div>
        <div className="mb-4 flex items-center gap-4">
            {value.map((url, index) => (
                <div key={index} className="relative size-[200px] rounded-md overflow-hidden">
                    <div className="z-10 absolute top-2 right-2">
                        <Button
                            variant="destructive"
                            size="icon"
                            type="button"
                            onClick={() => onRemove(url)}
                        >
                            <Trash className="size-4"/>
                        </Button>
                    </div>
                    <Image
                        fill
                        className="object-cover border rounded-xl"
                        src={url}
                        alt="Image"
                    />
                </div>
            ))}
        </div>
        <CldUploadWidget onUpload={onUpload} uploadPreset="kqevkn1v" >
            {({ open }) => {
                const onClick = () => {
                    open();
                }

                return (
                    <Button
                        type="button"
                        disabled={disabled}
                        variant='secondary'
                        onClick={onClick}
                    >
                        <ImagePlus className="size-4 mr-2" />
                        {placeholder || "Upload an Image"}
                    </Button>
                )
            }}
        </CldUploadWidget>
    </div>
  )
}
export default ImageUpload;