'use client'

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const page = () => {
  const { data } = authClient.useSession();
  const session = data?.user
  console.log(session)

  return (
    <div className="text-3xl text-amber-100 font-bold bg-black h-screen w-screen px-3 py-3.5">
      This is the data {JSON.stringify(data, null, 2)}
      {data && (
        <Button onClick={() => authClient.signOut()}>
          Logout
        </Button>
      )}
    </div>
  );
};

export default page;


// https://www.youtube.com/watch?v=ED2H_y6dmC8    ---->>>    2h12m