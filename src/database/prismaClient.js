const { PrismaClient } = require("@prisma/client");

// Criar instância única do Prisma Client
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// Tratamento de desconexão graceful
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
