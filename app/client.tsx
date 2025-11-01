'use client'

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Client = () => {
    const trpc = useTRPC();
    const { data: users } = useSuspenseQuery(trpc.getUsers.queryOptions())

    return (
        <div>
            <h1>Client Component Users:</h1>
            <pre className="text-sm">{JSON.stringify(users, null, 2)}</pre>
        </div>
    )
}