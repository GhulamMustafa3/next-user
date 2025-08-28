import { getUsers } from "@/lib/db";
import UserTable from "@/components/UserTable";

export default function UsersPage() {
  const users = getUsers();
  return (
    <main>
      <h1 className="text-2xl font-bold">All Users</h1>
      <UserTable users={users} />
    </main>
  );
}
