
import { inngest } from "@/inngest/client";
import { createTRPCRouter, proctedProcedure } from "../init";
import { prisma } from "@/lib/db";

// This is the primary API route handler
export const appRouter = createTRPCRouter({

  // get all users from the database throuch procted route
  getWorkFlows: proctedProcedure.query(({ ctx }) => {

    return prisma.workfolw.findFirst({
      where: {
        name: ctx.session.user.name ?? "Sumans"
      }
    });
  }),
  
  // create a workflow
  createWorkflow: proctedProcedure.mutation(async ({ ctx }) => {
    await inngest.send({
      name: "test/create.prisma.workflow",
      data: {
        name: ctx.session.user.name ?? "Sumans"
      }
    })

    return { success: true, message: "Workflow created successfully" };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
