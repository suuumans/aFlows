import { inngest } from "@/inngest/client";
import { createTRPCRouter, proctedProcedure } from "../init";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";

// This is the primary API route handler
export const appRouter = createTRPCRouter({
  // get all users from the database throuch procted route
  getWorkFlows: proctedProcedure.query(({ ctx }) => {
    return prisma.workfolw.findFirst({
      where: {
        name: ctx.session.user.name ?? "Sumans",
      },
    });
  }),

  // create a workflow
  createWorkflow: proctedProcedure.mutation(async ({ ctx }) => {
    await inngest.send({
      name: "test/create.prisma.workflow",
      data: {
        name: ctx.session.user.name ?? "Sumans",
      },
    });

    return { success: true, message: "Workflow created successfully" };
  }),

  // testing ai function
  askAi: proctedProcedure.mutation(async ({ ctx }) => {
    // throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid request or something went wrong!" });

    await inngest.send({
      name: "test/ai.function",
    });
    return { success: true, message: "Ai function called successfully" };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
