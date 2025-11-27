
import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointer2Icon } from "lucide-react";

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <>
    <BaseTriggerNode {...props} icon={MousePointer2Icon} name="When click 'Execute workflow" onSettings={() => {}} onDoubleClick={() => {}} />
    </>
  )
})