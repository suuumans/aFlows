
import { auth } from "@/lib/auth";
import { polar } from "@/lib/polar";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";


export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const proctedProcedure = baseProcedure.use(async ({ ctx, next }) => {

  // Check if user is authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If user is not authenticated then throw UNAUTHORIZED
  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized"
    });
  }

  // Pass the session to the next middleware
  return next({
    ctx: {
      ...ctx,
      session: session,
    },
  });
});

// premeiumProcedure: only for users with premium plan
export const premeiumProcedure = proctedProcedure.use(async ({ ctx, next }) => {
  const customer = await polar.customers.getStateExternal({
    externalId: ctx.session?.user.id ?? ctx.session?.session.userId
  })
  // if customer has no active subscription then throw UNAUTHORIZED
  if (!customer.activeSubscriptions || customer.activeSubscriptions.length === 0) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Acitive subscription required"
    });
  }
  // Pass the customer to the next middleware
  return next({
    ctx: {
      ...ctx,
      customer: customer,
    },
  });
});