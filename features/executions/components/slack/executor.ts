
import Handlebars from "handlebars";
import { slackChannel } from "@/inngest/channels/slack";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { decode } from "html-entities";
import ky from "ky";

// register json helper for handlebars
Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2)
  const stringified = new Handlebars.SafeString(jsonString);
  return stringified;
});

type SlackNodeData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
};

export const slackExecutor: NodeExecutor<SlackNodeData> = async ({ userId, data, nodeId, context, step, publish }) => {
  
  // publish "loading" state for http request
  await publish(slackChannel().status({
    nodeId,
    status: "loading",
  }))

  if (!data.variableName) {
    await publish(slackChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Slack node: variableName is required");
  }

  if (!data.webhookUrl) {
    await publish(slackChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Slack node: webhookUrl is required");
  }

  if (!data.content) {
    await publish(slackChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Slack node: content is required");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);

  if(!content){
    await publish(slackChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Slack node: content is required");
  }

  try {
    const result = await step.run("slack-webhook", async () => {
      if (!data.webhookUrl) {
        await publish(slackChannel().status({
          nodeId,
          status: "error",
        }))
        throw new NonRetriableError("Slack node: webhookUrl is required");
      }
    })

    await ky.post(data.webhookUrl, {
      json: {
        text: content,
      }
    })
  } catch (error) {
    await publish(slackChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Slack node: failed to send message");
  }

  await publish(slackChannel().status({
    nodeId,
    status: "success",
  }))

  return {
    ...context,
    [data.variableName]: {
      response: "",
    }
  }

}
