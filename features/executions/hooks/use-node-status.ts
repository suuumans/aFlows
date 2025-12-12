
import type { Realtime } from "@inngest/realtime";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useEffect, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

interface UseNodeStatusOptions {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

const isValidNodeStatus = (status: string): status is NodeStatus => {
  return typeof status === "string" && ["initial", "loading", "success", "error"].includes(status);
}

export function useNodeStatus({nodeId, channel, topic, refreshToken}: UseNodeStatusOptions) {
  
  const [status, setStatus] = useState<NodeStatus>("initial");

  const { data } = useInngestSubscription({
    refreshToken,
    enabled: true,
  })

  useEffect(() => {
    if (!data) return;

    // find the latest message for the node
    const latestMessage = data.filter(
      (message) => message.kind === "data" && message.channel === channel && message.topic === topic && message.data.nodeId === nodeId
    )
    .sort((a, b) => {
      // sort by created at if available, otherwise by index (arrival order)
      const timeA = a.kind === "data" && a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.kind === "data" && b.createdAt ? new Date(b.createdAt).getTime() : 0;
      
      return timeB - timeA;
    })[0];
    
    if (latestMessage?.kind === "data" && isValidNodeStatus(latestMessage.data.status)) {  // or (latestMessage?.data === "data")
      setStatus(latestMessage.data.status);  // or can add "as NodeStatus"
    }
  }, [data, nodeId, channel, topic])

  return status;
}