import { LoginForm } from "@/features/auth/components/login-form";
import { checkAuth } from "@/lib/auth-utils";

const Page = async () => {
  await checkAuth();

  return <LoginForm />;
};

export default Page;
