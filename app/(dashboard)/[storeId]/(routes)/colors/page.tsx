import prismadb from "@/lib/prismadb"
import { format } from 'date-fns'
import { ColorClient } from "./components/client"
import { ColorColumn } from "./components/columns"

const ColorsPage = async ({ params }: {
  params: { storeId: string }
}) => {
  
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy:{
      createdAt: 'desc'
    }
  })

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMM do, yyyy")
  }))

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ColorClient data={formattedColors}/>
    </div>
  )
}

export default ColorsPage

