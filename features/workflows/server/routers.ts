
import z from "zod";
import { prisma } from "@/lib/db";
import { PAGINATION } from "@/config/constants";
import { generateSlug } from "random-word-slugs"
import { createTRPCRouter, premeiumProcedure, proctedProcedure } from "@/trpc/init";



export const workflowsRouter = createTRPCRouter({

  // create a workflow
  create: premeiumProcedure.mutation(({ ctx }) => {
    return prisma.workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.session.user.id
      }
    })
  }),

  // delete a workflow
  remove: proctedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return prisma.workflow.delete({
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
    .query(async ({ ctx, input }) => {
      return prisma.workflow.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.session.user.id
        }
      })
    }),

  // get all workflows
  getAll: proctedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z.number().min(PAGINATION.MIN_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE).default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        prisma.workflow.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.session.user.id,
            name: {
              contains: search,
              mode: "insensitive"
            },
          },
          orderBy: {
            updatedAt: "desc"
          },
        }),

        prisma.workflow.count({
          where: {
            userId: ctx.session.user.id,
            name: {
              contains: search,
              mode: "insensitive"
            },
          }
        })
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        currentPage: page,
      };
    }),

  // update a workflow
  updateName: proctedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(3)
    }))
    .mutation(({ ctx, input }) => {
      return prisma.workflow.update({
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