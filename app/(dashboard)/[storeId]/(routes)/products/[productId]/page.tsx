import prismadb from "@/lib/prismadb"
import ProductForm from "./components/product-form"
import { notFound } from "next/navigation";

const ProductPage = async ({
    params
} : {
    params : { productId : string, storeId: string }
}) => {

    let product = null;

    if (params.productId !== "new"){
        try{
            product = await prismadb.product.findUnique({
                where: {
                    id: params.productId
                },
                include: {
                    images: true
                }
            });
            if (!product) {
                throw new Error("Product not found");
            }
        } catch (error: any) {
            notFound();
        }
    }

    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId
        }
    })

    return (
        <div className="flex-col flex">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm 
                    initialData={product} 
                    categories={categories}
                    sizes={sizes}
                    colors={colors}
                 />
            </div>
        </div>
    )
}

export default ProductPage;