
import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { prisma } from "@/lib/db";
import { topologicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { geminiChannel } from "./channels/gemini";
import { openaiChannel } from "./channels/openai";
import { anthropicChannel } from "./channels/anthropic";
import { discordChannel } from "./channels/discord";
import { slackChannel } from "./channels/slack";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: process.env.NODE_ENV === "production" ? 3 : 1, // retry 1 times before giving up
    onFailure: async ({ event, error }) => {
      await prisma.execution.update({
        where: { inngestEventId: event.data.event.id },
        data: {
          status: ExecutionStatus.FAILED,
          error: error.message,
          errorStack: error.stack,
        },
      });
    },
  },
  { 
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(), 
      manualTriggerChannel(), 
      googleFormTriggerChannel(), 
      stripeTriggerChannel(), 
      geminiChannel(), 
      openaiChannel(), 
      anthropicChannel(),
      discordChannel(),
      slackChannel(),
    ]
  },
  async ({ event, step, publish }) => {
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;
    
    if(!inngestEventId || !workflowId) {
      throw new NonRetriableError("Inngest Event ID or Workflow ID is required");
    }

    // create execution
    await step.run("create-execution", async () => {
      await prisma.execution.create({
        data: {
          inngestEventId,
          workflowId,
        },
      });
    })

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    })

    const userId = await step.run("find-user-id", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: {
          userId: true,
        },
      });
      return workflow.userId;
    })

    // initialize the context with any initial data from the trigger
    let context = event.data.initialData || {};

    // execute nodes in order
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        userId,
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
        publish
      })
    }

    await step.run("update-execution", async () => {
      await prisma.execution.update({
        where: { inngestEventId, workflowId },
        data: {
          status: "SUCCESS",
          completedAt: new Date(),
          output: context,
        },
      });
    })

    return { workflowId, output: context };
  }
);