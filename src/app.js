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

// init server
app.listen(PORT, () => {
  console.log(`Server port: ${PORT}`);
});
