'use client'

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { memo, type ReactNode, useCallback } from "react";
import { BaseNode, BaseNodeContent } from "../../../components/react-flow/base-node";
import { BaseHandle } from "../../../components/react-flow/base-handle";
import { WorkflowNode } from "../../../components/workflow-node";
import { type NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";


interface BaseExecutionNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;
    onSettings?: () => void;
    onDoubleClick?: () => void;
    status?: NodeStatus;
}

export const BaseExecutionNode = memo(({id, icon: Icon, name, description, children, status = "initial", onSettings, onDoubleClick}: BaseExecutionNodeProps) => {

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
      <NodeStatusIndicator status={status} variant="border">
      <BaseNode status={status} onDoubleClick={onDoubleClick}>
        <BaseNodeContent>
          {typeof Icon === "string" ? (
            <Image src={Icon} alt={name} width={15} height={15} />
          ) : (
            <Icon className="size-4 text-muted-foreground" />
          )}
          {children}
          <BaseHandle id="target-1" type="target" position={Position.Left} />
          <BaseHandle id="source-1" type="source" position={Position.Right} />
        </BaseNodeContent>
      </BaseNode>
      </NodeStatusIndicator>
    </WorkflowNode>
  )
})

BaseExecutionNode.displayName = "BaseExecutionNode";