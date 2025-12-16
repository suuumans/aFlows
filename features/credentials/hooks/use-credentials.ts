
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCredentialsParams } from "./use-credentials-params";
import { CredentialType } from "@/generated/prisma/enums";

// Hook to fetch all credentials using suspense
export const useSuspenseCredentials = () => {
  const trpc = useTRPC();
  const [params] = useCredentialsParams();

  return useSuspenseQuery(trpc.credentials.getAll.queryOptions(params));
};

// hook to create a new credential
export const useCreateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" created successfully`);
        queryClient.invalidateQueries(trpc.credentials.getAll.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Error creating credential: ${error.message}`);
      },
    })
  );
};

// hook to delete a credential
export const useRemoveCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" removed successfully`);

        // invalidate the getAll query
        queryClient.invalidateQueries(trpc.credentials.getAll.queryOptions({}));

        // invalidate the getOne query
        // queryClient.invalidateQueries(trpc.credentials.getOne.queryFilter({ id: data.id }));
      },
      onError: (error) => {
        toast.error(`Error deleting credential: ${error.message}`);
      },
    })
  );
};

// hook to fetch a single credential using suspense
export const useSuspenseCredential = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }));
};

// hook to update a credential
export const useUpdateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" updated successfully`);

        // invalidate the getAll query
        queryClient.invalidateQueries(trpc.credentials.getAll.queryOptions({}));

        // invalidate the getOne query
        queryClient.invalidateQueries(trpc.credentials.getOne.queryOptions({ id: data.id }));
      },
      onError: (error) => {
        toast.error(`Error updating credential: ${error.message}`);
      },
    })
  );
};

// hook to fetch credentials by type
export const useCredentialsByType = (type: CredentialType) => {
  const trpc = useTRPC();

  return useQuery(trpc.credentials.getByType.queryOptions({ type }));
};