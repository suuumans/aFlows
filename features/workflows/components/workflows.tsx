"use client";

import {
  EmptyView,
  ErrorView,
  ExecutionContainer,
  ExecutionHeader,
  ExecutionItem,
  ExecutionList,
  ExecutionPagination,
  ExecutionSearch,
  LoadingView,
} from "@/components/execution-components";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { toast } from "sonner";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-execution-search";
import type { Workflow } from "@/generated/prisma/client";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowsParams();
  const { searchValue, onSearchChange } = useEntitySearch({ params, setParams });

  return <ExecutionSearch placeholder="Search Workflows" value={searchValue} onChange={onSearchChange} />;
};

export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows();

  return (
    <ExecutionList
      items={workflows.data.items}
      getKey={(workflow) => workflow.id}
      renderItem={(workflow) => <WorkflowItem data={workflow} />}
      emptyView={<WorkflowsEmpty />}
    />
  );
};

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
      },
    });
  };
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
  );
};

export const WorkflowsPagination = () => {
  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowsParams();

  return (
    <ExecutionPagination
      disabled={workflows.isFetching}
      totalPages={workflows.data.totalPages}
      page={workflows.data.currentPage}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <ExecutionContainer header={<WorkflowsHeader />} search={<WorkflowsSearch />} pagination={<WorkflowsPagination />}>
      {children}
    </ExecutionContainer>
  );
};

export const WorkflowsLoading = () => {
  return <LoadingView message="Loading Workflows" />;
};

export const WorkflowsError = () => {
  return <ErrorView message="Error Loading Workflows" />;
};

export const WorkflowsEmpty = () => {
  const router = useRouter();

  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onError: (error) => {
        handleError(error);
      },
      onSuccess: (data) => {
        toast.success("Workflow created successfully!");
        router.push(`/workflows/${data.id}`);
      },
    });
  };
  return (
    <>
      {modal}
      <EmptyView onNew={handleCreate} message="No Workflows Found. Get started by creating your first workflow" />
    </>
  );
};

export const WorkflowItem = ({ data }: { data: Workflow }) => {
  const removeWorkflow = useRemoveWorkflow();

  const handleRemove = () => {
    removeWorkflow.mutate({ id: data.id });
  };

  return (
    <ExecutionItem
      href={`/workflows/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })} &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="flex size-8 items-center justify-center">
          <WorkflowIcon className="text-muted-foreground size-5" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeWorkflow.isPending}
    />
  );
};
