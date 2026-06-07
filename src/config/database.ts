import { PrismaClient } from "@prisma/client";

// Membuat satu instance tunggal Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
});

export default prisma;
