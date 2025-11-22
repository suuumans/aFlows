
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";

// Hook to fetch all workflows using suspense
export const useSuspenseWorkflows = () => {

  const trpc = useTRPC();
  const [params] = useWorkflowsParams();

  return useSuspenseQuery(trpc.workflows.getAll.queryOptions(params))
}

// hook to create a new workflow
export const useCreateWorkflow = () => {

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(trpc.workflows.create.mutationOptions({
    onSuccess: (data) => {
      toast.success(`Workflow "${data.name}" created successfully`);
      queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions({}));
    },
    onError: (error) => {
      toast.error(`Error creating workflow: ${error.message}`);
    }
  }))
}

// hook to delete a workflow
export const useRemoveWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(trpc.workflows.remove.mutationOptions({

    onSuccess: (data) => {
      toast.success(`Workflow "${data.name}" removed successfully`);

      // invalidate the getAll query
      queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions({}));

      // invalidate the getOne query
      // queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({ id: data.id }));
    },
    onError: (error) => {
      toast.error(`Error deleting workflow: ${error.message}`);
    }
  }))
}

// hook to fetch a single workflow using suspense
export const useSuspenseWorkflow = (id: string) => {

  const trpc = useTRPC();

  return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }))
}

// hook to update a workflow name
export const useUpdateWorkflowName = () => {

  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(trpc.workflows.updateName.mutationOptions({

    onSuccess: (data) => {
      toast.success(`Workflow "${data.name}" updated successfully`);

      // invalidate the getAll query
      queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions({}));

      // invalidate the getOne query
      queryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({ id: data.id }));
    },
    onError: (error) => {
      toast.error(`Error updating workflow: ${error.message}`);
    }
  }))
}