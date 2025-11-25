import Link from "next/link";
import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link href="/" className="flex items-center justify-center gap-2 font-medium">
          <Image src="/logos/Logoipsum-246.svg" alt="applogo" width={30} height={30} />
          <span className="text-primary text-2xl">aFlows</span>
        </Link>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
