
import { SignupForm } from "@/features/auth/components/signup-form";
import { checkAuth } from "@/lib/auth-utils";

const page = async () => {

  await checkAuth();

  return (
    <div>
      <SignupForm />
    </div>
  );
};

export default page;
