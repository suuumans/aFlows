// Use the generated client output path from `prisma/schema.prisma`.
// The generator in the schema writes the client to `lib/generated/prisma`,
// so import from that path instead of `@prisma/client`.
// Import the generated client entry. Point directly at the generated `client` module
// which is emitted by Prisma into `lib/generated/prisma/client`.
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
