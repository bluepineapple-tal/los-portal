"use client";

import { FC } from "react";

import { DataTable } from "@/components/ui/data-table";

import { UserDTO } from "../onboarding/user.schema";
import { userTableColumns } from "./user-table-columns";

interface Props {
  users: UserDTO[];
}

export const UserList: FC<Props> = ({ users }) => {
  if (!users.length) return <p>No users found.</p>;

  return <DataTable columns={userTableColumns} data={users} />;
};
