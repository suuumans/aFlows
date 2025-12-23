
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useExecutionsParams } from "./use-executions-params";

// Hook to fetch all credentials using suspense
export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const [params] = useExecutionsParams();

  return useSuspenseQuery(trpc.executions.getAll.queryOptions(params));
};

// hook to delete a execution
export const useRemoveExecution = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.executions.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Execution "${data.workflowId}" removed successfully`);

        // invalidate the getAll query
        queryClient.invalidateQueries(trpc.executions.getAll.queryOptions({}));

        // invalidate the getOne query
        // queryClient.invalidateQueries(trpc.credentials.getOne.queryFilter({ id: data.id }));
      },
      onError: (error) => {
        toast.error(`Error deleting execution: ${error.message}`);
      },
    })
  );
};

// hook to fetch a single execution using suspense
export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }));
};