
import { createTRPCRouter, proctedProcedure } from "../init";
import { prisma } from "@/lib/db";

// This is the primary API route handler
export const appRouter = createTRPCRouter({

  // get all users from the database throuch procted route
  getUsers: proctedProcedure.query(({ ctx }) => {

    let userId = ctx.session.user.id;

    return prisma.user.findMany({
      where: {
        id: userId,
      },
    });
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
