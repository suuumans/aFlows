
import { requireAuth } from "@/lib/auth-utils";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { WorkflowsEditor, WorkflowsEditorError, WorkflowsEditorLoading } from "@/features/workflowsEditor/components/workflowsEditor";
import { WorkflowsEditorHeader } from "@/features/workflowsEditor/components/workflowsEditorHeader";

interface PageProps {
  params: Promise<{
    workflowId: string
  }>
}

const Page = async ({ params }: PageProps) => {

  await requireAuth()
  const { workflowId } = await params;
  prefetchWorkflow(workflowId)

  return (
    <>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowsEditorError />}>
          <Suspense fallback={<WorkflowsEditorLoading />}>
            <WorkflowsEditorHeader workflowId={workflowId} />
            <main className="flex-1">
              <WorkflowsEditor workflowId={workflowId} />
            </main>
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </>
  )
}

export default Page;