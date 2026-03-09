require("dotenv").config();
const express = require("express");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// JSON parsing middleware
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.json({
    message: "API de Gerenciamento de Pedidos está funcionando!",
    version: "1.0.0",
  });
});

// register order routes
app.use("/order", orderRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Rota não encontrada",
      status: 404,
    },
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  // Log error for debugging
  console.error("Error:", err);

  // Determine status code
  let statusCode = 500;
  let message = "Erro interno do servidor";

  // Validation errors
  if (
    err.message &&
    (err.message.includes("obrigatório") || err.message.includes("deve ser"))
  ) {
    statusCode = 400;
    message = err.message;
  }

  // Not found errors (Prisma P2025)
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Recurso não encontrado";
  }

  // Custom status code if provided
  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  // Custom message if provided
  if (err.message && statusCode !== 500) {
    message = err.message;
  }

  res.status(statusCode).json({
    error: {
      message: message,
      status: statusCode,
    },
  });
});

// init server
app.listen(PORT, () => {
  console.log(`Server port: ${PORT}`);
});
