
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { LogoutButton } from "./logout";

const page = async () => {

  await requireAuth();

  const userData = await caller.getUsers();

  return (
    <div className="h-screen w-screen bg-black px-3 py-3.5 text-3xl font-bold text-amber-100">
      <div>
        this data is comming from the procted server route
      </div>
      <div>
        {JSON.stringify(userData)}
      </div>
      <LogoutButton />
    </div>
  );
};

export default page;
