const pool = require("../database/pgClient");

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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderResult = await client.query(
      'INSERT INTO "Order" ("orderId", "value", "creationDate") VALUES ($1, $2, $3) RETURNING *',
      [mappedData.orderId, mappedData.value, mappedData.creationDate],
    );

    const order = orderResult.rows[0];
    const items = [];

    for (const item of mappedData.items) {
      const itemResult = await client.query(
        'INSERT INTO "Items" ("orderId", "productId", "quantity", "price") VALUES ($1, $2, $3, $4) RETURNING *',
        [mappedData.orderId, item.productId, item.quantity, item.price],
      );
      items.push(itemResult.rows[0]);
    }

    await client.query("COMMIT");

    return { ...order, items };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// search by id
async function getOrderById(orderId) {
  const orderResult = await pool.query(
    'SELECT * FROM "Order" WHERE "orderId" = $1',
    [orderId],
  );

  if (orderResult.rows.length === 0) {
    return null;
  }

  const order = orderResult.rows[0];

  const itemsResult = await pool.query(
    'SELECT * FROM "Items" WHERE "orderId" = $1',
    [orderId],
  );

  return { ...order, items: itemsResult.rows };
}

// list
async function listAllOrders() {
  const ordersResult = await pool.query('SELECT * FROM "Order"');
  const orders = [];

  for (const order of ordersResult.rows) {
    const itemsResult = await pool.query(
      'SELECT * FROM "Items" WHERE "orderId" = $1',
      [order.orderId],
    );
    orders.push({ ...order, items: itemsResult.rows });
  }

  return orders;
}

// update current order
async function updateOrder(orderId, data) {
  const mappedData = mapOrderData(data);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderResult = await client.query(
      'UPDATE "Order" SET "orderId" = $1, "value" = $2, "creationDate" = $3 WHERE "orderId" = $4 RETURNING *',
      [mappedData.orderId, mappedData.value, mappedData.creationDate, orderId],
    );

    if (orderResult.rows.length === 0) {
      throw { code: "P2025" };
    }

    await client.query('DELETE FROM "Items" WHERE "orderId" = $1', [orderId]);

    const items = [];
    for (const item of mappedData.items) {
      const itemResult = await client.query(
        'INSERT INTO "Items" ("orderId", "productId", "quantity", "price") VALUES ($1, $2, $3, $4) RETURNING *',
        [mappedData.orderId, item.productId, item.quantity, item.price],
      );
      items.push(itemResult.rows[0]);
    }

    await client.query("COMMIT");

    return { ...orderResult.rows[0], items };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// delete order
async function deleteOrder(orderId) {
  const result = await pool.query(
    'DELETE FROM "Order" WHERE "orderId" = $1 RETURNING *',
    [orderId],
  );

  if (result.rows.length === 0) {
    throw { code: "P2025" };
  }

  return result.rows[0];
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
