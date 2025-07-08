"use client";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

import CreateUserForm from "@/components/onboarding/create-user-form";

export default function OnboardingPage() {
  const session = useSessionContext();

  if (session.loading) {
    return null;
  }
  const userId = session.userId;

  return (
    <div className="mx-auto max-w-2xl py-10">
      <h1 className="mb-6 text-2xl font-semibold">Complete your profile</h1>
      <CreateUserForm userId={userId} />
    </div>
  );
}
