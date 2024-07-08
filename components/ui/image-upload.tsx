'use client'
import { useEffect, useState } from "react"
import { ImagePlus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useTheme } from "next-themes"

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
    const { resolvedTheme } = useTheme()


    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        const element = document.querySelector('[data-test="powered-by-image"]') as HTMLElement | null;
        if (element) {
            element.style.display = 'none';
        }

    }, [isMounted]);

    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    }

    if(!isMounted){
        return null;
    }

    const widgetStyle = {
        palette: {
            window: resolvedTheme !== "light" ? "#030712" : "#FDFDFF",
            sourceBg: resolvedTheme !== "light" ? "#050B2B" : "#ECEFFF",
            tabIcon: resolvedTheme !== "light" ? "#fff" : "#6D28D9",
            link: '#6D28D9',
            windowBorder: '#7171D0',
            action: "#5333FF",
            inProgress: "#00ffcc",
            complete: "#33ff00",
            error: "#cc3333",
            textDark: "#000000",
            textLight: "#ffffff"
        }
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
        <CldUploadWidget 
            onUpload={onUpload} 
            uploadPreset="kqevkn1v"
            options={{
                sources: ['local', 'url', 'unsplash'],
                multiple: true,
                maxFiles: 5,
                maxFileSize: 1000000,
                styles: {
                    palette: {
                        windowBorder: "#7171D0",
                        inactiveTabIcon: "#8E9FBF",
                        link: "#6D28D9",
                        action: "#5333FF",
                        inProgress: "#00ffcc",
                        complete: "#33ff00",
                        error: "#cc3333",
                        textDark: "#000000",
                        textLight: "#ffffff",
                        window: resolvedTheme !== "light" ? "#030712" : "#FDFDFF",
                        sourceBg: resolvedTheme !== "light" ? "#050B2B" : "#ECEFFF",
                        tabIcon: resolvedTheme !== "light" ? "#777" : "#6D28D9",
                    },
              }}}
            >
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