const orderService = require("../services/orderService");

// validate entry
function validateOrderInput(data) {
  const errors = [];

  if (!data.numeroPedido || data.numeroPedido.trim() === "") {
    errors.push("numeroPedido é obrigatório");
  }

  if (!data.valorTotal) {
    errors.push("valorTotal é obrigatório");
  } else if (typeof data.valorTotal !== "number") {
    errors.push("valorTotal deve ser um número");
  } else if (data.valorTotal <= 0) {
    errors.push("valorTotal deve ser maior que 0");
  }

  if (!data.dataCriacao) {
    errors.push("dataCriacao é obrigatória");
  }

  if (!data.items) {
    errors.push("items é obrigatório");
  } else if (!Array.isArray(data.items)) {
    errors.push("items deve ser um array");
  } else if (data.items.length === 0) {
    errors.push("items não pode estar vazio");
  } else {
    data.items.forEach((item, index) => {
      if (!item.idItem) {
        errors.push(`Item ${index}: idItem é obrigatório`);
      }
      if (!item.quantidadeItem) {
        errors.push(`Item ${index}: quantidadeItem é obrigatório`);
      }
      if (!item.valorItem) {
        errors.push(`Item ${index}: valorItem é obrigatório`);
      }
    });
  }

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }
}

// create
async function createOrder(req, res) {
  try {
    validateOrderInput(req.body);
    const order = await orderService.createOrder(req.body);
    return res.status(201).json(order);
  } catch (error) {
    if (
      error.message.includes("obrigatório") ||
      error.message.includes("deve ser")
    ) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

// search by ID
async function getOrderById(req, res) {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

// list
async function listOrders(req, res) {
  try {
    const orders = await orderService.listAllOrders();
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

// update
async function updateOrder(req, res) {
  try {
    const { orderId } = req.params;
    validateOrderInput(req.body);
    const order = await orderService.updateOrder(orderId, req.body);
    return res.status(200).json(order);
  } catch (error) {
    if (
      error.message.includes("obrigatório") ||
      error.message.includes("deve ser")
    ) {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

// delete
async function deleteOrder(req, res) {
  try {
    const { orderId } = req.params;
    await orderService.deleteOrder(orderId);
    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

module.exports = {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder,
};
