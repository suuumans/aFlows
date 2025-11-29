
import { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointer2Icon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {

  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = "initial";

  const handleSettings = () => setDialogOpen(true);

  return (
    <>
    <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    <BaseTriggerNode {...props} icon={MousePointer2Icon} name="When click 'Execute workflow" onSettings={handleSettings} onDoubleClick={handleSettings} status={nodeStatus} />
    </>
  )
})