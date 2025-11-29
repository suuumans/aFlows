'use client'

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react"
import { GlobeIcon } from "lucide-react"
import { memo, useState } from "react"
import { BaseExecutionNode } from "../base-execuation-node"
import { type FormType, HttpRequestDialog } from "./dialog"

type HttpRequestNodeData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
  [key: string]: unknown;
}

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = "initial";

  const handleSettings = () => setDialogOpen(true);
  const handleSubmit = (values: FormType) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === props.id) {
        return {
          ...node,
          data: {
            ...node.data,
            endpoint: values.endpoint,
            method: values.method,
            body: values.body,
          },
        }
      }
      return node;
    }))
    // setDialogOpen(false);
  }

  const nodeData = props.data;
  const description = nodeData?.endpoint ? `${nodeData.method || "GET"}: ${nodeData.endpoint}` : "Not Configured";

  return (
    <>
    <HttpRequestDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultMethod={nodeData?.method} defaultEndpoint={nodeData?.endpoint} defaultBody={nodeData?.body} />
    <BaseExecutionNode {...props} id={props.id} icon={GlobeIcon} name="HTTP Request" description={description} onSettings={handleSettings} onDoubleClick={handleSettings} status={nodeStatus} />
    </>
  )
})

HttpRequestNode.displayName = "HttpRequestNode";
