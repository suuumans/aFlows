
import { prisma } from "@/lib/db";
import { createTRPCRouter, premeiumProcedure, proctedProcedure } from "@/trpc/init";
import { generateSlug } from "random-word-slugs"
import z from "zod";
import { id } from "zod/v4/locales";


export const workflowsRouter = createTRPCRouter({

  // create a workflow
  create: premeiumProcedure.mutation(({ ctx }) => {
    return prisma.Workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.session.user.id
      }
    })
  }),

  // delete a workflow
  remove: proctedProcedure
  .input(z.object({
    id: z.string()
  }))
  .mutation(({ ctx, input }) => {
    return prisma.Workflow.delete({
      where: {
        id: input.id,
        userId: ctx.session.user.id
      }
    })
  }),

  // get one workflow
  getOne: proctedProcedure
  .input(z.object({
    id: z.string()
  }))
  .query(({ ctx, input }) => {
    return prisma.Workflow.findUnique({
      where: {
        id: input.id,
        userId: ctx.session.user.id
      }
    })
  }),

  // get all workflows
  getAll: proctedProcedure.query(({ ctx }) => {
    return prisma.Workflow.findMany({
      where: {
        userId: ctx.session.user.id
      }
    })
  }),

  // update a workflow
  updateName: proctedProcedure
  .input(z.object({
    id: z.string(),
    name: z.string().min(3)
  }))
  .mutation(({ ctx, input }) => {
    return prisma.Workflow.update({
      where: {
        id: input.id,
        userId: ctx.session.user.id
      },
      data: {
        name: input.name
      }
    })
  })
})