
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
    onSuccess: ( data ) => {
      toast.success(`Workflow ${data.name} created successfully`);
      queryClient.invalidateQueries(trpc.workflows.getAll.queryOptions({}));
    },
    onError: (error) => {
      toast.error(`Error creating workflow: ${error.message}`);
    }
  }))
}