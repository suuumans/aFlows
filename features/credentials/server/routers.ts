
import z from "zod";
import { prisma } from "@/lib/db";
import { PAGINATION } from "@/config/constants";
import { createTRPCRouter, premeiumProcedure, proctedProcedure } from "@/trpc/init";
import { CredentialType } from "@/generated/prisma/enums";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";

export const credentialsRouter = createTRPCRouter({

  // create a credential
  create: premeiumProcedure
    .input(
      z.object({
        name: z.string().min(3, "Name must be at least 3 characters long"),
        type: z.enum(CredentialType),
        value: z.string().min(1, "Value is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {

      const { name, type, value } = input;

      const hashedValue = await bcrypt.hash(value, 10);

      return prisma.credential.create({
        data: {
          name,
          type,
          value: hashedValue,
          userId: ctx.session.user.id,
        },
      });
  }),

  // delete a credential
  remove: proctedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    try {
      return prisma.credential.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    } catch (error) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Credential not found or you do not have permission to delete it",
        cause: error,
      });
    }
  }),

  // get one credential
  getOne: proctedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const credential = await prisma.credential.findUniqueOrThrow({
          where: {
            id: input.id,
            userId: ctx.session.user.id,
          },
          select: {
            id: true,
            name: true,
            type: true,
            createdAt: true,
            updatedAt: true,
          }
        });
  
        return credential
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Credential not found or you do not have permission to access it",
          cause: error,
        });
      }
    }),

  // get all credentials
  getAll: proctedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
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
        prisma.credential.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.session.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
          select: {
            id: true,
            name: true,
            type: true,
            createdAt: true,
            updatedAt: true,
          }
        }),

        prisma.credential.count({
          where: {
            userId: ctx.session.user.id,
            name: {
              contains: search,
              mode: "insensitive",
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


  //update a credential
  update: proctedProcedure.input(
    z.object({
      id: z.string(),
      name: z.string().min(3, "Name must be at least 3 characters long"),
      type: z.enum(CredentialType),
      value: z.string().min(1, "Value is required").optional(),
    })
  ).mutation(async ({ ctx, input }) => {
    const { id, name, type, value } = input;
    
    let hashedValue: string | undefined;
    if (value) {
      hashedValue = await bcrypt.hash(value, 10);
    }

    try {
      return prisma.credential.update({
        where: {
          id,
          userId: ctx.session.user.id,
        },
        data: {
          name,
          type,
          ...(hashedValue ? { value: hashedValue } : {}),
        },
      })
    } catch (error) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Credential not found or you do not have permission to update it",
        cause: error,
      });
    }
  }),

  // get by type
  getByType: proctedProcedure
    .input(
      z.object({
        type: z.enum(CredentialType),
      })
    )
    .query(async ({ ctx, input }) => {
      const { type } = input;

      const credentials = await prisma.credential.findMany({
        where: {
          type,
          userId: ctx.session.user.id,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      return credentials;
    }),

});
