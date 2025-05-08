"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// Criando uma instância do Prisma Client para ser utilizada em toda a aplicação
const prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
exports.default = prisma;
