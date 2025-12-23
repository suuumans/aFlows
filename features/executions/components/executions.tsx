"use client";

import {
  EmptyView,
  ErrorView,
  ExecutionContainer,
  ExecutionHeader,
  ExecutionItem as BaseExecutionItem,
  ExecutionList,
  ExecutionPagination,
  LoadingView,
} from "@/components/execution-components";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { useExecutionsParams } from "../hooks/use-executions-params";
import { formatDistanceToNow } from "date-fns";
import { type Execution } from "@/generated/prisma/client";
import { ExecutionStatus } from "@/generated/prisma/enums";
import { useRouter } from "next/navigation";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";


export const ExecutionsList = () => {
  const executions = useSuspenseExecutions();

  return (
    <ExecutionList
      items={executions.data.items}
      getKey={(execution) => execution.id}
      renderItem={(execution) => <ExecutionItem data={execution} />}
      emptyView={<ExecutionsEmpty />}
    />
  );
};

export const ExecutionsHeader = () => {
  return (
    <ExecutionHeader
      title="Executions"
      description="View your workflow execution history"
    />
  );
};

export const ExecutionsPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionsParams();

  return (
    <ExecutionPagination
      disabled={executions.isFetching}
      totalPages={executions.data.totalPages}
      page={executions.data.currentPage}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const ExecutionsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <ExecutionContainer header={<ExecutionsHeader />} pagination={<ExecutionsPagination />}>
      {children}
    </ExecutionContainer>
  );
};

export const ExecutionsLoading = () => {
  return <LoadingView message="Loading Executions..." />;
};

export const ExecutionsError = () => {
  return <ErrorView message="Error Loading Executions" />;
};

export const ExecutionsEmpty = () => {
  const router = useRouter();

  const handleCreate = () => {
    router.push(`/executions/new`);
  };
  return (
    <EmptyView onNew={handleCreate} message="No Executions Found. You haven't executed any workflows yet" />
  );
};

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-4 text-green-600" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-4 text-red-600" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-4 text-blue-600 animate-spin" />;
    default:
      return <ClockIcon className="size-4 text-muted-foreground" />;
  }
};

export const ExecutionItem = ({ data }: { data: Execution & { workflow: { id: string, name: string } } }) => {

  const duration = data.completedAt ? Math.round((new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime()) / 1000) : 0;

  const subtitle = (
    <>
      {data.workflow.name} &bull; Started{" "}
      {formatDistanceToNow(data.startedAt, { addSuffix: true })}
      {duration !== null && <> &bull; Took {duration} seconds</>}
    </>
  );

  return (
    <BaseExecutionItem
      href={`/executions/${data.id}`}
      title={data.workflow.name}
      subtitle={subtitle}
      image={
        <div className="flex size-8 items-center justify-center">
          {getStatusIcon(data.status)}
        </div>
      }
    />
  );
};
