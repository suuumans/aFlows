"use client";

import {
  EmptyView,
  ErrorView,
  ExecutionContainer,
  ExecutionHeader,
  ExecutionItem,
  ExecutionList,
  ExecutionPagination,
  ExecutionSearch,
  LoadingView,
} from "@/components/execution-components";
import { useCreateCredential, useRemoveCredential, useSuspenseCredentials } from "../hooks/use-credentials";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "@/hooks/use-execution-search";
import { formatDistanceToNow } from "date-fns";
import { Credential } from "@/generated/prisma/client";
import { CredentialType } from "@/generated/prisma/enums";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = useEntitySearch({ params, setParams });

  return <ExecutionSearch placeholder="Search Credentials" value={searchValue} onChange={onSearchChange} />;
};

export const CredentialsList = () => {
  const credentials = useSuspenseCredentials();

  return (
    <ExecutionList
      items={credentials.data.items}
      getKey={(credential) => credential.id}
      renderItem={(credential) => <CredentialItem data={credential} />}
      emptyView={<CredentialsEmpty />}
    />
  );
};

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <ExecutionHeader
      title="Credentials"
      description="Create and manage your credentials"
      newButtonLabel="New Credential"
      newButtonHref="/credentials/new"
      disabled={disabled}
    />
  );
};

export const CredentialsPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();

  return (
    <ExecutionPagination
      disabled={credentials.isFetching}
      totalPages={credentials.data.totalPages}
      page={credentials.data.currentPage}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const CredentialsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <ExecutionContainer header={<CredentialsHeader />} search={<CredentialsSearch />} pagination={<CredentialsPagination />}>
      {children}
    </ExecutionContainer>
  );
};

export const CredentialsLoading = () => {
  return <LoadingView message="Loading Credentials" />;
};

export const CredentialsError = () => {
  return <ErrorView message="Error Loading Credentials" />;
};

export const CredentialsEmpty = () => {
  const router = useRouter();

  const createCredential = useCreateCredential();
  const { handleError, modal } = useUpgradeModal();

  const handleCreate = () => {
    router.push(`/credentials/new`);
  };
  return (
    <EmptyView onNew={handleCreate} message="No Credentials Found. Get started by creating your first credential" />
  );
};

const credentialLogos: Record<CredentialType, string> = {
  [CredentialType.ANTHROPIC]: "/logos/Anthropic.svg",
  [CredentialType.GEMINI]: "/logos/Gemini.svg",
  [CredentialType.OPENAI]: "/logos/OpenAI-Logo.svg",
}

export const CredentialItem = ({ data }: { data: Pick<Credential, "id" | "name" | "type" | "createdAt" | "updatedAt"> }) => {
  const removeCredential = useRemoveCredential();

  const handleRemove = () => {
    removeCredential.mutate({ id: data.id });
  };

  const logo = credentialLogos[data.type] || "/logos/Gemini.svg";

  return (
    <ExecutionItem
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })} &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="flex size-8 items-center justify-center">
          <Image src={logo} alt={data.type} width={16} height={16} />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};
