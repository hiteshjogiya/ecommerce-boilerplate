import { ProfileForm } from "@/features/account/components/profile-form";
import { getUserProfileSummaryServer } from "@/src/services/account.server";

export default async function AccountProfilePage() {
  const profile = await getUserProfileSummaryServer();

  return <ProfileForm initialProfile={profile} />;
}
