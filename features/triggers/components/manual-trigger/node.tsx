
import { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointer2Icon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-trigger";
import { fetchManualTriggerRealtimeToken } from "./actions";

export const ManualTriggerNode = memo((props: NodeProps) => {

  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
      nodeId: props.id,
      channel: MANUAL_TRIGGER_CHANNEL_NAME,
      topic: "status",
      refreshToken: fetchManualTriggerRealtimeToken,
    });

  const handleSettings = () => setDialogOpen(true);

  return (
    <>
    <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    <BaseTriggerNode {...props} icon={MousePointer2Icon} name="When click 'Execute workflow" onSettings={handleSettings} onDoubleClick={handleSettings} status={nodeStatus} />
    </>
  )
})