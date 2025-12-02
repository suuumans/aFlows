
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  body?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({ data, nodeId, context, step }) => {
  
  // publish "loading" state for http request

  if (!data.endpoint) {
    // publish "error" state for http request
    throw new NonRetriableError("Endpoint is not configured");
  }

  if (!data.variableName) {
    // publish "error" state for http request
    throw new NonRetriableError("Variable name is not configured");
  }

  const result = await step.run("http-request", async () => {
    const endpoint = data.endpoint!;
    const method = data.method || "GET";
    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = data.body;
      options.headers = {
        "Content-Type": "application/json",
      }
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type")
    const responseData = contentType?.includes("application/json") ? await response.json() : await response.text();
    const responsePaload = {
      [data.variableName!]: {
        status: response.status,
        data: responseData,
        statusText: response.statusText,
      }
    }

    return {
      ...context,
      ...responsePaload,
    }
  })

  // publish "success" state for http request

  return result;
}