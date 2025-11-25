import { workflowsRouter } from "@/features/workflows/server/routers";
import { createTRPCRouter } from "../init";

// This is the primary API route handler
export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
