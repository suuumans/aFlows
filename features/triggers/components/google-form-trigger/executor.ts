
import type { NodeExecutor } from "@/features/executions/types";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

type GoogleFormTriggerData = Record<string, unknown>;

export const googleFormTriggerExecutor: NodeExecutor<GoogleFormTriggerData> = async ({ nodeId, context, step, publish }) => {
  
  // publish "loading" state for google form trigger
  await publish(googleFormTriggerChannel().status({
    nodeId,
    status: "loading",
  }))

  try {
    const result = await step.run("google-form-trigger", async () => context)

    // publish "success" state for google form trigger
    await publish(googleFormTriggerChannel().status({
      nodeId,
      status: "success",
    }))

    return result;
  } catch (error) {
    // publish "error" state for google form trigger
    await publish(googleFormTriggerChannel().status({
      nodeId,
      status: "error",
    }))
    throw error;
  }
}