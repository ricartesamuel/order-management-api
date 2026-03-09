const prisma = require("../database/prismaClient");

function transformNumeroPedido(numeroPedido) {
  return numeroPedido.split("-")[0];
}

function mapOrderData(data) {
  const orderId = transformNumeroPedido(data.numeroPedido);

  return {
    orderId,
    value: data.valorTotal,
    creationDate: new Date(data.dataCriacao),
    items: data.items.map((item) => ({
      productId: parseInt(item.idItem),
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })),
  };
}

// create
async function createOrder(data) {
  const mappedData = mapOrderData(data);

  const order = await prisma.order.create({
    data: {
      orderId: mappedData.orderId,
      value: mappedData.value,
      creationDate: mappedData.creationDate,
      items: {
        create: mappedData.items,
      },
    },
    include: {
      items: true,
    },
  });

  return order;
}

// search by id
async function getOrderById(orderId) {
  const order = await prisma.order.findUnique({
    where: { orderId },
    include: {
      items: true,
    },
  });

  return order;
}

// list
async function listAllOrders() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
  });

  return orders;
}

// update current order
async function updateOrder(orderId, data) {
  const mappedData = mapOrderData(data);

  const order = await prisma.order.update({
    where: { orderId },
    data: {
      orderId: mappedData.orderId,
      value: mappedData.value,
      creationDate: mappedData.creationDate,
      items: {
        deleteMany: {},
        create: mappedData.items,
      },
    },
    include: {
      items: true,
    },
  });

  return order;
}

// delete order
async function deleteOrder(orderId) {
  const order = await prisma.order.delete({
    where: { orderId },
  });

  return order;
}

module.exports = {
  transformNumeroPedido,
  mapOrderData,
  createOrder,
  getOrderById,
  listAllOrders,
  updateOrder,
  deleteOrder,
};
