import { requireAuth } from "@/lib/auth-utils"

const Page = async () => {
  await requireAuth()
  
  return (
    <div>
      <h1>executions page</h1>
    </div>
  )
}

export default Page