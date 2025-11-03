
import { prisma } from "@/lib/db";
import { inngest } from "./client";

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
    await prisma.workfolw.create({
      data: {
        name: event.data.name,
      }
    })
  }
)