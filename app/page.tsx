"use client";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { use } from "react";
import { toast } from "sonner";

const page = () => {

  const trpc = useTRPC();
  const { data } = useQuery(trpc.getWorkFlows.queryOptions());
  const queryClient = useQueryClient();

  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => {
      toast.success("Workflow created successfully");
      // queryClient.invalidateQueries(trpc.getWorkFlows.queryOptions());
    },
    onError: (error) => {
      console.log(error);
    }
  }));


  return (
    <div className="h-screen w-screen gap-y-6 bg-black px-3 py-3.5 text-3xl font-bold text-amber-100 flex flex-col items-center justify-center">
      <div>
        this data is comming from the procted server route
      </div>
      <div>
        {JSON.stringify(data, null, 2)}
      </div>
      {/* <div> */}
      <Button disabled={create.isPending} onClick={() => create.mutate()}>
        Create Workflow
      </Button>
      {/* </div> */}
      <LogoutButton />
    </div>
  );
};

export default page;
