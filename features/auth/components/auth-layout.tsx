
import Link from "next/link"
import Image from "next/image"


const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted flex min-h-screen justify-center items-center p-4">
      <div className="flex flex-col gap-6 w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 justify-center font-medium">
          <Image src="/logos/Logoipsum-246.svg" alt="applogo" width={30} height={30} />
          <span className="text-2xl text-primary">aFlows</span>
        </Link>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout