
import { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-form-trigger";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";

export const GoogleFormTriggerNode = memo((props: NodeProps) => {

  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchGoogleFormTriggerRealtimeToken,
  });

  const handleSettings = () => setDialogOpen(true);

  return (
    <>
    <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    <BaseTriggerNode {...props} icon="/logos/google-form-logo.svg" name="Google Form" description="Runs after form submission" onSettings={handleSettings} onDoubleClick={handleSettings} status={nodeStatus} />
    </>
  )
})