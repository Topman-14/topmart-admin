import prismadb from "@/lib/prismadb"
import BillboardForm from "./components/billboard-form"
import { notFound } from "next/navigation"
import toast from "react-hot-toast"

const BillboardPage = async ({
    params
} : {
    params : { billboardId : string }
}) => {

    let billboard = null;

    if (params.billboardId !== "new") {
        try {
            billboard = await prismadb.billboard.findUnique({
                where: {
                    id: params.billboardId
                }
            });
            if (!billboard) {
                throw new Error("Billboard not found");
            }
        } catch (error: any) {
            notFound();
        }
    }

    return ( 
        <div className="flex-col flex">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm initialData={billboard} />
            </div>
        </div>
    )
}

export default BillboardPage;
