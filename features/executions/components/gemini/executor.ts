
import { generateText } from "ai"
import Handlebars from "handlebars";
import { geminiChannel } from "@/inngest/channels/gemini";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";

// register json helper for handlebars
Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2)
  const stringified = new Handlebars.SafeString(jsonString);
  return stringified;
});

type GeminiNodeData = {
  variableName?: string;
  model?: string;
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

  if(!userPrompt){
    await publish(geminiChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Gemini node: userPrompt is required");
  }
  
  // get credential value from env
  const credentialValue = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!credentialValue) {
    await publish(geminiChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Gemini node: GOOGLE_GENERATIVE_AI_API_KEY is not set");
  }

  const google = createGoogleGenerativeAI({
    apiKey: credentialValue,
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

    const response = steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(geminiChannel().status({
      nodeId,
      status: "success",
    }))
    
    return {
      ...context,
      [data.variableName]: {
        aiResponse: response,
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