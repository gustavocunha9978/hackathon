import { PrismaClient } from '@prisma/client';

// Criando uma instância do Prisma Client para ser utilizada em toda a aplicação
const prisma = new PrismaClient();

export default prisma;