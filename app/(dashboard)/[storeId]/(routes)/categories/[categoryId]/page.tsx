import prismadb from "@/lib/prismadb"
import CategoryForm from "./components/category-form"
import toast from "react-hot-toast";
import { notFound } from "next/navigation";

const CategoryPage = async ({
    params
} : {
    params : { categoryId : string, storeId: string }
}) => {

    let category = null;

    if (params.categoryId !== "new"){
        try {
            category = await prismadb.category.findUnique({
                where: {
                    id: params.categoryId
                }
            })
            if (!category) {
                throw new Error("Category not found");
            }
        } catch (error: any) {
            notFound();
        }
    }


    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        }
    })

    return (
        <div className="flex-col flex">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm initialData={category} billboards={billboards} />
            </div>
        </div>
    )
}

export default CategoryPage;