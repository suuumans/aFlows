'use client'

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react"
import { memo, useState } from "react"
import { BaseExecutionNode } from "../base-execuation-node"
import { OpenAIFormValues, OpenAIDialog, AVAILABLE_MODELS } from "./dialog"
import { useNodeStatus } from "../../hooks/use-node-status"
import { fetchOpenAIRealtimeToken } from "./actions"
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai"

type OpenAINodeData = {
  variableName?: string;
  credentialId?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
}

type OpenAINodeType = Node<OpenAINodeData>;

export const OpenAINode = memo((props: NodeProps<OpenAINodeType>) => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: OPENAI_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchOpenAIRealtimeToken,
  });

  const handleSettings = () => setDialogOpen(true);
  const handleSubmit = (values: OpenAIFormValues) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === props.id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...values,
          },
        }
      }
      return node;
    }))
    // setDialogOpen(false);
  }

  const nodeData = props.data;
  const description = nodeData?.userPrompt ? `${nodeData.model || AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(0, 50)}...` : "Not Configured";

  return (
    <>
    <OpenAIDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultValues={nodeData} />
    <BaseExecutionNode {...props} id={props.id} icon="/logos/OpenAI-Logo.svg" name="OpenAI" description={description} onSettings={handleSettings} onDoubleClick={handleSettings} status={nodeStatus} />
    </>
  )
})

OpenAINode.displayName = "OpenAINode";
