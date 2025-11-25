// Use the generated client output path from `prisma/schema.prisma`.
// The generator in the schema writes the client to `lib/generated/prisma`,
// so import from that path instead of `@prisma/client`.
// Import the generated client entry. Point directly at the generated `client` module
// which is emitted by Prisma into `lib/generated/prisma/client`.
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
