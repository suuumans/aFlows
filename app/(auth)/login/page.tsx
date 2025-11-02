
import { LoginForm } from "@/features/auth/components/login-form";
import { checkAuth } from "@/lib/auth-utils";
import Image from "next/image";
import Link from "next/link";

const Page = async () => {

  await checkAuth();

  return (
    <div className="bg-muted flex flex-col min-h-screen justify-center items-center">
      <div className="flex flex-col gap-6 max-w-sm mx-auto w-full sm:w-auto">
        <Link href="/" className="flex items-center gap-2 justify-center align-center self-center font-medium">
        <Image  src="/logos/Logoipsum-246.svg" alt="applogo" width={30} height={30} />
          <span className="text-2xl text-primary">aFlows</span>
        </Link>
        <LoginForm />
      </div>
    </div>
  );
};

export default Page;