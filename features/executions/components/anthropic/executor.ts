
import { generateText } from "ai"
import Handlebars from "handlebars";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import { createAnthropic } from "@ai-sdk/anthropic";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";

// register json helper for handlebars
Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2)
  const stringified = new Handlebars.SafeString(jsonString);
  return stringified;
});

type AnthropicNodeData = {
  variableName?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const anthropicExecutor: NodeExecutor<AnthropicNodeData> = async ({ data, nodeId, context, step, publish }) => {
  
  // publish "loading" state for http request
  await publish(anthropicChannel().status({
    nodeId,
    status: "loading",
  }))

  if (!data.variableName) {
    await publish(anthropicChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Anthropic node: variableName is required");
  }

  const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  if(!userPrompt){
    await publish(anthropicChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Anthropic node: userPrompt is required");
  }
  
  // get credential value from env
  const credentialValue = process.env.ANTHROPIC_API_KEY;
  if (!credentialValue) {
    await publish(anthropicChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Anthropic node: ANTHROPIC_API_KEY is not set");
  }

  const anthropic = createAnthropic({
    apiKey: credentialValue,
  })

  try {
    const { steps } = await step.ai.wrap("anthropic-generate-text", generateText, {
      model: anthropic(data.model || "claude-3-5-sonnet-20241022"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      }
    })

    const response = steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(anthropicChannel().status({
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
    
    await publish(anthropicChannel().status({
      nodeId,
      status: "error",
    }))
    
    throw new NonRetriableError("Anthropic node: " + error);
  }

}
