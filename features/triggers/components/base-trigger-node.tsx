'use client'

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { memo, type ReactNode, useCallback } from "react";
import { BaseNode, BaseNodeContent } from "../../../components/react-flow/base-node";
import { BaseHandle } from "../../../components/react-flow/base-handle";
import { WorkflowNode } from "../../../components/workflow-node";


interface BaseTriggerNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;
    onSettings?: () => void;
    onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(({id, icon: Icon, name, description, children, onSettings, onDoubleClick}: BaseTriggerNodeProps) => {

  const { setNodes, setEdges } = useReactFlow();

  const handelDelete = () => {
    setNodes((currentNodes) => {
      const updatedNodes = currentNodes.filter((node) => node.id !== id)
      return updatedNodes;
    });
    setEdges((currentEdges) => {
      const updatedEdges = currentEdges.filter((edge) => edge.source !== id && edge.target !== id)
      return updatedEdges;
    });
  }


  return (
    <WorkflowNode name={name} description={description} onDelete={handelDelete} onSettings={onSettings}>
      <BaseNode onDoubleClick={onDoubleClick} className="rounded-l-2xl relative group">
        <BaseNodeContent>
          {typeof Icon === "string" ? (
            <Image src={Icon} alt={name} width={15} height={15} />
          ) : (
            <Icon className="size-4 text-muted-foreground" />
          )}
          {children}
          <BaseHandle id="source-1" type="source" position={Position.Right} />
        </BaseNodeContent>
      </BaseNode>
    </WorkflowNode>
  )
})

BaseTriggerNode.displayName = "BaseTriggerNode";