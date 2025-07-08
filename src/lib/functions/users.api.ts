import { IUser } from "@/components/onboarding/user.schema";

import { API_BASE_URL } from "../constants";
import { fetchApi } from "../fetch-api";

/* --------------------------------------------------------------- */
/* helper – decides JSON vs FormData automatically                 */
/* --------------------------------------------------------------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeBody(data: Record<string, any>): BodyInit {
  const hasFile = Object.values(data).some((v) => v instanceof File);
  if (!hasFile) return JSON.stringify(data);

  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => v !== undefined && fd.append(k, v));
  return fd;
}

/* --------------------------------------------------------------- */
/* CRUD                                                            */
/* --------------------------------------------------------------- */

export async function createUser(data: IUser): Promise<IUser> {
  return fetchApi<IUser>(`${API_BASE_URL}/users`, {
    method: "POST",
    body: makeBody(data),
  });
}

export async function updateUser(
  id: string,
  data: Partial<IUser>,
): Promise<IUser> {
  return fetchApi<IUser>(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    body: makeBody(data),
  });
}

export async function getMe(): Promise<IUser> {
  return fetchApi<IUser>(`${API_BASE_URL}/users/me`, { method: "GET" });
}

export async function deleteUser(id: string): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
  });
}
