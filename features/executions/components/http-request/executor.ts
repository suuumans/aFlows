
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import Handlebars from "handlebars";
import { httpRequestChannel } from "@/inngest/channels/http-request";

// register json helper for handlebars
Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2)
  const stringified = new Handlebars.SafeString(jsonString);
  return stringified;
});

type HttpRequestData = {
  variableName: string;
  endpoint: string;
  body?: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({ data, nodeId, context, step, publish }) => {
  
  // publish "loading" state for http request
  await publish(httpRequestChannel().status({
    nodeId,
    status: "loading",
  }))


  if (!data.endpoint) {
    // publish "error" state for http request
    await publish(httpRequestChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Http Request node: Endpoint is not configured");
  }

  if (!data.variableName) {
    // publish "error" state for http request
    await publish(httpRequestChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Http Request node: Variable name is not configured");
  }

  if (!data.method) {
    // publish "error" state for http request
    await publish(httpRequestChannel().status({
      nodeId,
      status: "error",
    }))
    throw new NonRetriableError("Http Request node: Method is not configured");
  }

  try {
    const result = await step.run("http-request", async () => {
      // const endpoint = Handlebars.compile(data.endpoint)(context);
      // or
      let endpoint: string;
      try {
        const template = Handlebars.compile(data.endpoint);
        endpoint = template(context);
        if (!endpoint || typeof endpoint !== 'string') {
          throw new NonRetriableError("Endpoint template must resolve to an non-empty string");
        }
      } catch (error) {
        throw new NonRetriableError(`HTTP Request node: Faild to resolve endpoint template: ${error}`)
      }
      
      const method = data.method;
      const options: KyOptions = { method };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        const resolved = Handlebars.compile(data.body || "")(context);
        const parsed = JSON.parse(resolved);
        options.body = parsed;
        options.headers = {
          "Content-Type": "application/json",
        }
      }

      const response = await ky(endpoint, options);
      const contentType = response.headers.get("content-type")
      const responseData = contentType?.includes("application/json") ? await response.json() : await response.text();
      const responsePaload = {
        [data.variableName]: {
          status: response.status,
          data: responseData,
          statusText: response.statusText,
        }
      }

      return {
        ...context,
        [data.variableName]: responsePaload,
      }
    })

    // publish "success" state for http request
    await publish(httpRequestChannel().status({
      nodeId,
      status: "success",
    }))

    return result;
  } catch (error) {
    // publish "error" state for http request
    await publish(httpRequestChannel().status({
      nodeId,
      status: "error",
    }))
    throw error;
  }
}