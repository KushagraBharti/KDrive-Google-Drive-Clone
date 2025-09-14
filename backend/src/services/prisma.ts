import { PrismaClient } from '@prisma/client';
import '@/config/env';

const prisma = new PrismaClient();

export default prisma;
