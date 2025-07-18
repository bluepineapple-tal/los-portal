import { UserDTO } from "@/components/onboarding/user.schema";
import { UsersPageTemplate } from "@/components/templates/users";
import { API_BASE_URL } from "@/lib/constants";
import { fetchApi } from "@/lib/fetch-api";

export default async function Users() {
  const users = await fetchApi<UserDTO[]>(`${API_BASE_URL}/users`);

  return <UsersPageTemplate users={users} />;
}
