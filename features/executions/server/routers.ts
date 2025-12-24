import z from "zod";
import { prisma } from "@/lib/db";
import { PAGINATION } from "@/config/constants";
import { createTRPCRouter, proctedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const executionsRouter = createTRPCRouter({

  // delete a execution
  remove: proctedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    try {
      return prisma.execution.delete({
        where: {
          id: input.id,
          workflow: {
            userId: ctx.session.user.id,
          },
        },
      });
    } catch (error) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Execution not found or you do not have permission to delete it",
        cause: error,
      });
    }
  }),

  // get one execution
  getOne: proctedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const execution = await prisma.execution.findUniqueOrThrow({
          where: {
            id: input.id,
            workflow: {
              userId: ctx.session.user.id,
            },
          },
          include: {
            workflow: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        });
  
        return execution
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Execution not found or you do not have permission to access it",
          cause: error,
        });
      }
    }),

  // get all executions
  getAll: proctedProcedure
    .input(
      z.object({
        page: z.number().min(PAGINATION.DEFAULT_PAGE).default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        prisma.execution.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            workflow: {
              userId: ctx.session.user.id,
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          orderBy: {
            startedAt: "desc",
          },
          include: {
            workflow: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }),

        prisma.execution.count({
          where: {
            workflow: {
              userId: ctx.session.user.id,
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        }),
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
});
