
import { generateText } from "ai"
import Handlebars from "handlebars";
import { openaiChannel } from "@/inngest/channels/openai";
import { createOpenAI } from "@ai-sdk/openai";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";

// register json helper for handlebars
Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2)
  const stringified = new Handlebars.SafeString(jsonString);
  return stringified;
});

type OpenAINodeData = {
  variableName?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const openaiExecutor: NodeExecutor<OpenAINodeData> = async ({ data, nodeId, context, step, publish }) => {
  
  // publish "loading" state for http request
  await publish(openaiChannel().status({
    nodeId,
    status: "loading",
  }))

  if (!data.variableName) {
    await publish(openaiChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("OpenAI node: variableName is required");
  }

  const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  if(!userPrompt){
    await publish(openaiChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("OpenAI node: userPrompt is required");
  }
  
  // get credential value from env
  const credentialValue = process.env.OPENAI_API_KEY;
  if (!credentialValue) {
    await publish(openaiChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("OpenAI node: OPENAI_API_KEY is not set");
  }

  const openai = createOpenAI({
    apiKey: credentialValue,
  })

  try {
    const { steps } = await step.ai.wrap("openai-generate-text", generateText, {
      model: openai(data.model || "gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      }
    })

    const response = steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(openaiChannel().status({
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
    
    await publish(openaiChannel().status({
      nodeId,
      status: "error",
    }))
    
    throw new NonRetriableError("OpenAI node: " + error);
  }

}
