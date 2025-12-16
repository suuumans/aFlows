
import { generateText } from "ai"
import Handlebars from "handlebars";
import { geminiChannel } from "@/inngest/channels/gemini";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { prisma } from "@/lib/db";

// register json helper for handlebars
Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2)
  const stringified = new Handlebars.SafeString(jsonString);
  return stringified;
});

type GeminiNodeData = {
  variableName?: string;
  model?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const geminiExecutor: NodeExecutor<GeminiNodeData> = async ({ data, nodeId, context, step, publish }) => {
  
  // publish "loading" state for http request
  await publish(geminiChannel().status({
    nodeId,
    status: "loading",
  }))

  if (!data.variableName) {
    await publish(geminiChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Gemini node: variableName is required");
  }

  const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);
  
  // if userPrompt is not provided, throw error
  if(!userPrompt){
    await publish(geminiChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Gemini node: userPrompt is required");
  }

  // get credential from the user data
  const credential = await step.run("get-credential", () => {
    try {
      return prisma.credential.findUnique({
        where: {
          id: data.credentialId,
        }
      })
    } catch (error) {
      throw new NonRetriableError("Gemini node: credential not found");
    }
  })

  // if credential is not found, throw error
  if (!credential) {
    await publish(geminiChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Gemini node: credential not found");
  }
  
  const google = createGoogleGenerativeAI({
    apiKey: credential?.value,
  })

  try {
    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google(data.model || "gemini-2.5-flash"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      }
    })

    const response = steps?.[0]?.content?.[0]?.type === "text" ? steps[0].content[0].text : "";

    await publish(geminiChannel().status({
      nodeId,
      status: "success",
    }))
    
    return {
      ...context,
      [data.variableName]: {
        response,
      }
    }
    
  } catch (error) {
    
    await publish(geminiChannel().status({
      nodeId,
      status: "error",
    }))
    
    throw new NonRetriableError("Gemini node: " + error);
  }

}