const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createCustomerOrder(request, response) {
  try {
    const {
      name,
      lastname,
      phone,
      email,
      company,
      adress,
      apartment,
      postalCode,
      status,
      city,
      country,
      orderNotice,
      total,
      paypalOrderId,
      paymentStatus,
    } = request.body;
    const corder = await prisma.customer_order.create({
      data: {
        name,
        lastname,
        phone,
        email,
        company,
        adress,
        apartment,
        postalCode,
        status,
        city,
        country,
        orderNotice,
        total,
        paypalOrderId,
        paymentStatus,
      },
    });
    return response.status(201).json(corder);
  } catch (error) {
    console.error("Error creating order:", error);
    return response.status(500).json({ error: "Error creating order" });
  }
}

async function updateCustomerOrder(request, response) {
  try {
    const { id } = request.params;
    const {
      name,
      lastname,
      phone,
      email,
      company,
      adress,
      apartment,
      postalCode,
      dateTime,
      status,
      city,
      country,
      orderNotice,
      total,
      paypalOrderId,
      paymentStatus,
    } = request.body;

    const existingOrder = await prisma.customer_order.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingOrder) {
      return response.status(404).json({ error: "Order not found" });
    }

    const updatedOrder = await prisma.customer_order.update({
      where: {
        id: existingOrder.id,
      },
      data: {
        name,
        lastname,
        phone,
        email,
        company,
        adress,
        apartment,
        postalCode,
        dateTime,
        status,
        city,
        country,
        orderNotice,
        total,
        paypalOrderId,
        paymentStatus,
      },
    });

    return response.status(200).json(updatedOrder);
  } catch (error) {
    return response.status(500).json({ error: "Error updating order" });
  }
}

async function deleteCustomerOrder(request, response) {
  try {
    const { id } = request.params;
    await prisma.customer_order.delete({
      where: {
        id: id,
      },
    });
    return response.status(204).send();
  } catch (error) {
    return response.status(500).json({ error: "Error deleting order" });
  }
}

async function getCustomerOrder(request, response) {
  const { id } = request.params;
  const order = await prisma.customer_order.findUnique({
    where: {
      id: id,
    },
  });
  if (!order) {
    return response.status(404).json({ error: "Order not found" });
  }
  return response.status(200).json(order);
}

async function getAllOrders(request, response) {
  try {
    const orders = await prisma.customer_order.findMany({});
    return response.json(orders);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Error fetching orders" });
  }
}

async function getSalesStatistics(request, response) {
  try {
    const stats = await prisma.customer_order_product.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    });

    const enrichedStats = await Promise.all(
      stats.map(async (stat) => {
        const product = await prisma.product.findUnique({
          where: { id: stat.productId },
          select: { title: true },
        });
        return {
          name: product?.title || "Unknown",
          quantity: stat._sum.quantity,
        };
      })
    );

    return response.json(enrichedStats);
  } catch (error) {
    console.error("Error fetching sales statistics:", error);
    return response.status(500).json({ error: "Error fetching sales statistics" });
  }
}

async function getCategorySalesStatistics(request, response) {
  try {
    const stats = await prisma.customer_order_product.findMany({
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    const categorySales = {};
    stats.forEach((item) => {
      const categoryName = item.product?.category?.name || "Other";
      if (!categorySales[categoryName]) {
        categorySales[categoryName] = 0;
      }
      categorySales[categoryName] += item.quantity;
    });

    const formattedStats = Object.keys(categorySales).map((name) => ({
      name,
      value: categorySales[name],
    }));

    return response.json(formattedStats);
  } catch (error) {
    console.error("Error fetching category sales statistics:", error);
    return response.status(500).json({ error: "Error fetching category sales statistics" });
  }
}

module.exports = {
  createCustomerOrder,
  updateCustomerOrder,
  deleteCustomerOrder,
  getCustomerOrder,
  getAllOrders,
  getSalesStatistics,
  getCategorySalesStatistics,
};
