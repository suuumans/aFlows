
import { Connection, Node } from "@/generated/prisma/client";
import toposort from "toposort";
import { inngest } from "./client";

export const topologicalSort = (nodes: Node[], connections: Connection[]): Node[] => {

  // if no connections retrn nodes
  if(connections.length === 0) {
    return nodes;
  }

  // create edges array for toposort
  const edges: [string, string][] = connections.map((connection) => [
    connection.fromNodeId,
    connection.toNodeId,
  ])

  // add nodes with no connections as self-edges to ensure they are included
  const connectedNodesIds = new Set<string>();
  for(const connection of connections) {
    connectedNodesIds.add(connection.fromNodeId);
    connectedNodesIds.add(connection.toNodeId);
  }

  for (const node of nodes) {
    if(!connectedNodesIds.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  // sort nodes
  let sortedNodeIds: string[]
  try {
    sortedNodeIds = toposort(edges);
    // remove duplicates (from self-edges)
    sortedNodeIds = [...new Set(sortedNodeIds)]
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cyclic")) {
      throw new Error("Workflow contains a cycle")
    }
    throw error;
  }

  // Map sorted ids back to node objects
  const sortedNodes = new Map(nodes.map((node) => [node.id, node]));
  return sortedNodeIds.map((id) => sortedNodes.get(id)!).filter(Boolean)
}

export const sendWorkflowExecution = async (data: { workflowId: string, [key: string]: any}) => {
  return inngest.send({
    name: "workflows/execute.workflow",
    data,
    id: data.workflowId,
  })
}