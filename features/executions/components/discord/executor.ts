
import Handlebars from "handlebars";
import { discordChannel } from "@/inngest/channels/discord";
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

type DiscordNodeData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

export const discordExecutor: NodeExecutor<DiscordNodeData> = async ({ data, nodeId, context, step, publish }) => {
  
  // publish "loading" state for http request
  await publish(discordChannel().status({
    nodeId,
    status: "loading",
  }))

  if (!data.variableName) {
    await publish(discordChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Discord node: variableName is required");
  }

  if(!data.content){
    await publish(discordChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Discord node: content is required");
  }
  
  // get credential value from user data
  const webhookUrl = data.webhookUrl ? Handlebars.compile(data.webhookUrl)(context) : "";

  if(!webhookUrl){
    await publish(discordChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Discord node: webhookUrl is required");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);
  const username = data.username ? decode(Handlebars.compile(data.username)(context)) : undefined;

  try {
    const result = await step.run("discord-webhook", async () => {
      await ky.post(webhookUrl, {
        json: {
          content: content.slice(0, 2000), // discord only allows 2000 characters of content
          username,
        },
      });
      return {
        ...context,
        [data.variableName!]: {
          messageContent: content.slice(0, 2000),
        },
      }
    })

    await publish(discordChannel().status({
      nodeId,
      status: "success",
    }))

    return result;
  } catch (error) {
    await publish(discordChannel().status({
      nodeId,
      status: "error",
    }))

    throw new NonRetriableError("Discord node: failed to send message");
  }

}