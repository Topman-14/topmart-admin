'use client'

import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { ApiAlert } from "./api-alert";
import { useDevMode } from "@/hooks/use-dev-mode";
import Heading from "./heading";
import { Separator } from "./separator";

interface ApiListProps {
    entityName: string;
    entityIdName: string;
}
export const ApiList: React.FC<ApiListProps> = ({
    entityName,
    entityIdName
}) =>{
    const params = useParams();
    const origin = useOrigin();
    const {isDev} = useDevMode();

    const baseUrl = `${origin}/api/${params.storeId}`

    if(isDev){
    return (
        <> 
            <Heading title="API" description={"API calls for " + entityName} />
            <Separator />
            <ApiAlert
                title="GET"
                variant="public"
                description={`${baseUrl}/${entityName}`}
             />
            <ApiAlert
                title="GET"
                variant="public"
                description={`${baseUrl}/${entityName}/{${entityName}}`}
             />
            <ApiAlert
                title="POST"
                variant="admin"
                description={`${baseUrl}/${entityName}`}
             />
            <ApiAlert
                title="PATCH"
                variant="admin"
                description={`${baseUrl}/${entityName}/{${entityName}}`}
             />
            <ApiAlert
                title="DELETE"
                variant="admin"
                description={`${baseUrl}/${entityName}/{${entityName}}`}
             />
        </>
      )
    } else {
        return null
    }
}