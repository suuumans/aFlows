'use client'

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react"
import { memo, useState } from "react"
import { BaseExecutionNode } from "../base-execuation-node"
import { DiscordFormValues, DiscordDialog } from "./dialog"
import { useNodeStatus } from "../../hooks/use-node-status"
import { fetchDiscordRealtimeToken } from "./actions"
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord"

type DiscordNodeData = {
  webhookUrl?: string;
  content?: string;
  username?: string;
}

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: DISCORD_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchDiscordRealtimeToken,
  });

  const handleSettings = () => setDialogOpen(true);
  const handleSubmit = (values: DiscordFormValues) => {
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
  const description = nodeData?.content ? `Send: ${nodeData.content.slice(0, 50)}...` : "Not Configured";

  return (
    <>
    <DiscordDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultValues={nodeData} />
    <BaseExecutionNode {...props} id={props.id} icon="/logos/Discord-Icon.svg" name="Discord" description={description} onSettings={handleSettings} onDoubleClick={handleSettings} status={nodeStatus} />
    </>
  )
})

DiscordNode.displayName = "DiscordNode";
