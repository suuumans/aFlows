
import { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-trigger";
import { fetchManualTriggerRealtimeToken } from "./actions";

export const GoogleFormTriggerNode = memo((props: NodeProps) => {

  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = "initial";

  const handleSettings = () => setDialogOpen(true);

  return (
    <>
    <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    <BaseTriggerNode {...props} icon="/logos/google-form-logo.svg" name="Google Form" description="Runs after form submission" onSettings={handleSettings} onDoubleClick={handleSettings} status={nodeStatus} />
    </>
  )
})