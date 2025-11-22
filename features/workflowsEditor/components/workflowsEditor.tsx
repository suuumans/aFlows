'use client'

import { LoadingView, ErrorView } from "@/components/execution-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";

export const WorkflowsEditorLoading = () => {
    return <LoadingView message="Loading workflow editor..." />
}

export const WorkflowsEditorError = () => {
    return <ErrorView message="Error loading workflow editor" />
}

export const WorkflowsEditor = ({ workflowId }: { workflowId: string }) => {

    const { data: workflow } = useSuspenseWorkflow(workflowId)

    return (
        <p>
            {JSON.stringify(workflow, null, 2)}
        </p>
    )
}