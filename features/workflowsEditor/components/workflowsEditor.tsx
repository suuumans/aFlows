"use client";

import { useCallback, useState } from "react";
import { LoadingView, ErrorView } from "@/components/execution-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, type Node, type Edge, type NodeChange, type EdgeChange, type Connection, Background, MiniMap, Controls, Panel } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";

export const WorkflowsEditorLoading = () => {
  return <LoadingView message="Loading workflow editor..." />;
};

export const WorkflowsEditorError = () => {
  return <ErrorView message="Error loading workflow editor" />;
};


export const WorkflowsEditor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <div className="size-full">
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView={true} proOptions={{ hideAttribution: true }} nodeTypes={nodeComponents}>
            <Background />
            <MiniMap />
            <Controls />
            <Panel position="top-right">
              <AddNodeButton />
            </Panel>
        </ReactFlow>
    </div>
  );
};