
import type { NodeExecutor } from "@/features/executions/types";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

type StripeTriggerData = Record<string, unknown>;

export const stripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async ({ nodeId, context, step, publish }) => {
  
  // publish "loading" state for stripe trigger
  await publish(stripeTriggerChannel().status({
    nodeId,
    status: "loading",
  }))

  try {
    const result = await step.run("stripe-trigger", async () => context)

    // publish "success" state for stripe trigger
    await publish(stripeTriggerChannel().status({
      nodeId,
      status: "success",
    }))

    return result;
  } catch (error) {
    // publish "error" state for stripe trigger
    await publish(stripeTriggerChannel().status({
      nodeId,
      status: "error",
    }))
    throw error;
  }
}
