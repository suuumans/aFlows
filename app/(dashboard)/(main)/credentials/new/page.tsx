
import { CredentialForm } from "@/features/credentials/components/credential-form";
import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
    await requireAuth();
    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
          <div className="mx-auto max-w-screen-md w-full flex flex-col h-full gap-y-8">
            <h1>New Credential</h1>
            <CredentialForm />
          </div>
        </div>
    );
};

export default Page;
