import prismadb from "@/lib/prismadb";

interface GraphData {
    month: string;
    total: number;
}

const allMonths = Array.from({ length: 12 }, (_, i) => new Date(2000, i, 1).toLocaleDateString('en-US', { month: 'short' }));

export const getTotalRevenue = async (storeId: string) => {
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    return paidOrders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, item) => {
            return orderSum + item.product.price.toNumber();
        }, 0);

        return total + orderTotal;
    }, 0)
}

export const getSalesCount = async (storeId: string) => {

    const salesCount = await prismadb.order.count({
        where: {
            storeId,
            isPaid: true
        },
    });

    return salesCount;
}

export const getStockCount = async (storeId: string) => {

    const stockCount = await prismadb.product.count({
        where: {
            storeId,
            isArchived: false
        },
    });

    return stockCount;
}


export const getGraphData = async (storeId: string) => {
    const sales = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    const monthlyRevenue: {[ key: number]: number} = {}

    for (const order of sales) {
        const month = order.createdAt.getMonth();
        let revenueForOrder = 0;

        for( const item of order.orderItems){
            revenueForOrder += item.product.price.toNumber();
        }

        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    }

    const graphData: GraphData[] = allMonths.map((month, index) => ({
        month,
        total: Number(monthlyRevenue[index]) || 0
    }));

    return graphData;
}
