'use client'

import { ExecutionStatus } from "@/generated/prisma/enums";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useSuspenseExecution } from "../hooks/use-executions";

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

const formatStatus = (status: ExecutionStatus) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export const ExecutionView = ({ executionId }: { executionId: string }) => {

  const { data: execution } = useSuspenseExecution(executionId);
  const [showStackTrace, setShowStackTrace] = useState(false);

  const duration = execution?.completedAt ? Math.round((new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000) : 0;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex items-center gap-2">
          {getStatusIcon(execution?.status)}
          <div>
            <CardTitle>{formatStatus(execution?.status)}</CardTitle>
            <CardDescription>Execution for {execution?.workflow?.name}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium text-sm text-muted-foreground">Workflow</p>
            <Link href={`/workflows/${execution?.workflowId}`} className="text-sm hover:underline text-primary" prefetch>
              {execution?.workflow?.name}
            </Link>
          </div>
          <div>
            <p className="font-medium text-sm text-muted-foreground">Status</p>
            <p className="text-sm">{formatStatus(execution?.status)}</p>
          </div>
          <div>
            <p className="font-medium text-sm text-muted-foreground">Started At</p>
            <p className="text-sm">{formatDistanceToNow(execution?.startedAt, { addSuffix: true })}</p>
          </div>
            {execution?.completedAt ? (
              <div>
                <p className="font-medium text-sm text-muted-foreground">Completed At</p>
                <p className="text-sm">{formatDistanceToNow(execution?.completedAt, { addSuffix: true })}</p>
              </div>
            ) : null}
        </div>
        {duration !== 0 ? (
          <div>
            <p className="font-medium text-sm text-muted-foreground">Duration</p>
            <p className="text-sm">{duration} seconds</p>
          </div>
        ) : null}
        <div>
          <p className="font-medium text-sm text-muted-foreground">Inngest Event ID</p>
          <p className="text-sm">{execution?.inngestEventId}</p>
        </div>
        {execution.error && (
          <div className="mt-6 p-4 bg-red-50 rounded-md space-y-3">
            <div>
              <p className="font-semibold text-sm text-red-900 mb-2">Error</p>
              <p className="text-sm text-red-600 font-mono">{execution.error}</p>
            </div>

            {execution?.errorStack && (
              <Collapsible open={showStackTrace} onOpenChange={setShowStackTrace}>
                <CollapsibleTrigger className="text-sm text-primary hover:underline" asChild>
                  <Button variant="ghost" size="sm" className="text-red-900 hover:bg-red-100">
                    {showStackTrace ? "Hide Error Stack" : "View Error Stack"}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <pre className="text-xs text-red-800 font-mono overflow-auto mt-2 p-2 bg-red-100 rounded">{execution.errorStack}</pre>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}

        {execution?.output && (
          <div className="mt-6 p-4 bg-green-50 rounded-md">
            <div>
              <p className="font-semibold text-sm text-green-900 mb-2">Output</p>
              <pre className="text-sm text-green-800 font-mono overflow-auto mt-2 p-2 bg-green-100 rounded">{JSON.stringify(execution.output, null, 2)}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};  