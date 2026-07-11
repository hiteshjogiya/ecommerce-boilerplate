import { LoginPageClient } from "./login-page-client";

type LoginPageSearchParams = Record<string, string | string[] | undefined>;

export default async function LoginPage({ searchParams }: { searchParams?: Promise<LoginPageSearchParams> }) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const returnTo = typeof resolvedSearchParams?.returnTo === "string" ? resolvedSearchParams.returnTo : "/";

  return <LoginPageClient returnTo={returnTo} />;
}
