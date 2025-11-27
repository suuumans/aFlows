'use client'

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { memo, type ReactNode, useCallback } from "react";
import { BaseNode, BaseNodeContent } from "../../../components/react-flow/base-node";
import { BaseHandle } from "../../../components/react-flow/base-handle";
import { WorkflowNode } from "../../../components/workflow-node";


interface BaseExecutionNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;
    onSettings?: () => void;
    onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo(({id, icon: Icon, name, description, children, onSettings, onDoubleClick}: BaseExecutionNodeProps) => {

  const { setNodes, setEdges } = useReactFlow();

  const handelDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  }


  return (
    <WorkflowNode name={name} description={description} onDelete={handelDelete} onSettings={onSettings}>
      <BaseNode onDoubleClick={onDoubleClick}>
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
    </WorkflowNode>
  )
})

BaseExecutionNode.displayName = "BaseExecutionNode";