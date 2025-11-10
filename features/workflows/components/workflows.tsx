'use client'

import { ExecutionContainer, ExecutionHeader } from "@/components/execution-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { toast } from "sonner";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";


export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows();

  return (
    <div className="flex flex-col justify-center items-center">
    <p>
      {JSON.stringify(workflows.data, null, 2)}
    </p>
      
    </div>
  )
}

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  
  const router = useRouter();
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
        toast.success("Workflow created successfully!");
      },
      onError: (error) => {
        handleError(error);
      }
    })
  }
  return (
    <>
      {modal}
      <ExecutionHeader
        title="Workflows"
        description="Create and manage your workflows"
        newButtonLabel="New Workflow"
        disabled={disabled}
        onNew={handleCreate}
        isCreating={createWorkflow.isPending}
      />
    </>
  )
}

export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <ExecutionContainer
    header={<WorkflowsHeader />}
    search={<></>}
    pagination={<></>}
    >
      {children}
    </ExecutionContainer>
  )
}