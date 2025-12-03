import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { executeWorkflow } from "@/inngest/functions";

// create an api that serves functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [executeWorkflow],
});
