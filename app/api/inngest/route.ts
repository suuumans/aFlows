
import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { createPrismaWorkflow, helloWorld } from "@/inngest/functions";


// create an api that serves functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld, createPrismaWorkflow],
});
