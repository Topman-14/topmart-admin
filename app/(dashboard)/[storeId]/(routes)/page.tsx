import OverviewChart from "@/components/overview-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { currencyFormatter } from "@/lib/utils"
import { getGraphData, getSalesCount, getStockCount, getTotalRevenue } from "@/services/dashService"
import { CreditCard, HandCoins, Link2, LinkIcon, Package } from "lucide-react"
import { raleway } from "@/fonts"
import Link from "next/link"

interface DashboardPageProps {
    params: { storeId: string }
};

const storeUrl = process.env.FRONTEND_STORE_URL as string;

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {

    const totalRevenue = await getTotalRevenue(params.storeId);
    const salesCount = await getSalesCount(params.storeId);
    const productsCount = await getStockCount(params.storeId);
    const graphData = await getGraphData(params.storeId);

    return (
        <div className="flex-col flex">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center gap-1 justify-between">
                    <div>
                        <h2 className={`text-3xl font-bold ${raleway.className}`}>Dashboard</h2>
                        <p className="text-sm text-muted-foreground">Overview of your store</p>
                    </div>
                    <div>
                        <Link href={storeUrl} className="rounded-full bg-[#9e9e9e40] px-3 py-2 text-sm items-center gap-1 flex font-semibold" >
                            <LinkIcon className="size-4 text-muted-foreground"/>
                            <p>Go to storefront</p>
                        </Link>
                    </div>
                </div>
                <Separator />
                <div className="grid gap-4 grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <HandCoins className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {currencyFormatter.format(totalRevenue)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Sales
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                +{salesCount}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Products in stock
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {productsCount}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle className="mb-3 font-bold">
                            Overview
                        </CardTitle>
                        <CardContent className="pl-2">
                            <OverviewChart data={graphData} />
                        </CardContent>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}

export default DashboardPage
