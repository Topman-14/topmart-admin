import prismadb from "@/lib/prismadb";

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
