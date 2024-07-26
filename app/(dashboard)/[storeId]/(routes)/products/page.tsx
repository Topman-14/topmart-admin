import prismadb from "@/lib/prismadb"
import { format } from 'date-fns'
import { ProductClient } from "./components/client"
import { ProductColumn } from "./components/columns"
import { currencyFormatter } from "@/lib/utils"

export const revalidate = 300

const ProductsPage = async ({ params }: {
  params: { storeId: string }
}) => {
  
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      size: true,
      color: true
    },
    orderBy:{
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: currencyFormatter.format(item.price),
    quantity: item.quantity,
    category: item.category.name,
    size: item.size?.name || '-',
    color: item.color?.value ? `${item.color?.value}:${item.color?.name }` : null,
    createdAt: format(item.createdAt, "MMM do, yyyy")
  }))

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ProductClient data={formattedProducts}/>
    </div>
  )
}

export default ProductsPage

