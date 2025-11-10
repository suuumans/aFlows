
import { prisma } from "@/lib/db";
import { inngest } from "./client";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import * as Sentry from "@sentry/nextjs";



const gAi = createGoogleGenerativeAI();
const openAi = createOpenAI();



// Create a simple test function
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait for 3 seconds", 3000);
    await step.run("Send a hello world message", async () => {
      return { message: `Hello ${event.data.name ?? "World"}!` };
    });
  }
);

export const createPrismaWorkflow = inngest.createFunction(
  { id: "create-prisma-workflow" },
  { event: "test/create.prisma.workflow" },
  async ({ event, step }) => {
    await prisma.Workflow.create({
      data: {
        name: event.data.name,
      }
    })
  }
)

export const aiFunction = inngest.createFunction(
  { id: "ai-function" },
  { event: "test/ai.function" },
  async ({ event, step }) => {

    Sentry.logger.info('User triggered test log', { log_source: 'sentry_test' })

    // this is inngest specific way of calling ai
    const { steps: geminiSteps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: gAi("gemini-2.5-flash"),
      system: "You are a helpful ai assistant, you will solve any query of the user",
      temperature: 1,
      prompt: "what is 3 + 4?",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    })

    // const { steps: openAiSteps } = await step.ai.wrap("openai-generate-text", generateText, {
    //   model: openAi("gpt-3.5-turbo"),
    //   temperature: 1,
    //   prompt: "Do we humans even need ai?",
    //   experimental_telemetry: {
    //     isEnabled: true,
    //     recordInputs: true,
    //     recordOutputs: true,
    //   },
    // })

    return { geminiSteps }
  }
)