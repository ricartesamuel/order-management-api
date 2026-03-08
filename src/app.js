require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsing de JSON
app.use(express.json());

// Rota de teste
app.get("/", (req, res) => {
  res.json({
    message: "API de Gerenciamento de Pedidos está funcionando!",
    version: "1.0.0",
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
