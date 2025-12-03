
import type { NodeExecutor } from "@/features/executions/types";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({ nodeId, context, step, publish }) => {
  
  // publish "loading" state for manual trigger
  await publish(manualTriggerChannel().status({
    nodeId,
    status: "loading",
  }))

  try {
    const result = await step.run("manual-trigger", async () => context)

    // publish "success" state for manual trigger
    await publish(manualTriggerChannel().status({
      nodeId,
      status: "success",
    }))

    return result;
  } catch (error) {
    // publish "error" state for manual trigger
    await publish(manualTriggerChannel().status({
      nodeId,
      status: "error",
    }))
    throw error;
  }
}