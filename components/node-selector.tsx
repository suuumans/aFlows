'use client'

import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon, WebhookIcon } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NodeType } from "@/generated/prisma/enums";
import { Separator } from "./ui/separator";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
}

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Manual Trigger",
    description: "Runs when a user manually triggers the workflow",
    icon: MousePointerIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form",
    description: "Runs when a google form is submitted",
    icon: "/logos/google-form-logo.svg",
  }
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Make an HTTP request",
    icon: GlobeIcon,
  }
]

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function NodeSelector({ open, onOpenChange, children }: NodeSelectorProps) {

  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow()

  const handelNodeSelection = useCallback((selectedNode: NodeTypeOption) => {

    // check if the node is already added
    if (selectedNode.type === NodeType.MANUAL_TRIGGER) {
      const nodes = getNodes();
      const hasManualTrigger = nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
      if (hasManualTrigger) {
        toast.error("Manual trigger node already exists");
        return;
      }
    }
    setNodes((nodes) => {
      const hasInitialTrigger = nodes.some(
        (node) => node.type === NodeType.INITIAL
      )

      const positionX = window.innerWidth / 2;
      const positionY = window.innerHeight / 2;
  
      const flowPosition = screenToFlowPosition({ 
        x: positionX + (Math.random() - 0.5) * 200,
        y: positionY + (Math.random() - 0.5) * 200
      });
  
      const newNode = {
        id: createId(),
        type: selectedNode.type,
        position: flowPosition,
        data: {}
      }

      if (hasInitialTrigger) {
        toast.error("Initial trigger node already exists");
        return [newNode]
      }
      return [...nodes, newNode]
    })

    onOpenChange(false);
  }, [setNodes, getNodes, screenToFlowPosition, onOpenChange])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>What triggers this workflow?</SheetTitle>
          <SheetDescription>
            A trigger is a step that starts your workflow.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="space-y-1 p-1">
          {triggerNodes.map((nodeType) => {
            const Icon = nodeType.icon;
            return (
              <div key={nodeType.type} className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary" onClick={() => handelNodeSelection(nodeType)}>
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof Icon === "string" ? (
                    <img src={Icon} alt={nodeType.label} className="size-4 object-contain rounded-sm" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">
                      {nodeType.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <Separator />
        <div className="space-y-2 p-2">
          {executionNodes.map((nodeType) => {
            const Icon = nodeType.icon;
            return (
              <div key={nodeType.type} className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary" onClick={() => handelNodeSelection(nodeType)}>
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof Icon === "string" ? (
                    <img src={Icon} alt={nodeType.label} className="size-4 object-contain rounded-sm" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">
                      {nodeType.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
} 


// 10h8m42s