
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
      if (a.kind === "data" && b.kind === "data") {
        return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      return 0;
    })[0];
    
    if (latestMessage?.kind === "data" && isValidNodeStatus(latestMessage.data.status)) {  // or (latestMessage?.data === "data")
      setStatus(latestMessage.data.status);  // or can add "as NodeStatus"
    }
  }, [data, nodeId, channel, topic])

  return status;
}