"use client";

import { FC } from "react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

import { UserDTO } from "@/components/onboarding/user.schema";
import { UserList } from "@/components/users/user-list";

interface Props {
  users: UserDTO[];
}

export const UsersPageTemplate: FC<Props> = ({ users }) => {
  const session = useSessionContext();
  // Check session
  if (session.loading) {
    return <div>Loading Session...</div>;
  }
  if (session.doesSessionExist === false) {
    return <div>Session does not exist</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-bold">Loan Offers</h1>

      <UserList users={users} />
    </div>
  );
};
