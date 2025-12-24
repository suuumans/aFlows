
import { SearchParams } from "nuqs";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { ExecutionsContainer, ExecutionsError, ExecutionsList, ExecutionsLoading } from "@/features/executions/components/executions";
import { executionsParamsLoader } from "@/features/executions/server/load-params";
import { prefetchExecutions } from "@/features/executions/server/prefetch";

type Props = {
  searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: Props) => {
  await requireAuth();

  const params = await executionsParamsLoader(searchParams);
  prefetchExecutions(params);

  return (
    <ExecutionsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<ExecutionsError />}>
          <Suspense fallback={<ExecutionsLoading />}>
              <ExecutionsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </ExecutionsContainer> 
  );
};

export default Page;