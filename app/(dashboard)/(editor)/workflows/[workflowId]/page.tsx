import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
  params: Promise <{
    workflowId: string
  }>
}

const Page = async ({ params }: PageProps) => {
  await requireAuth()
  const { workflowId } = await params;

  return (
    <div>
      <h1>workflow id: {workflowId}</h1>
    </div>
  )
}

export default Page;