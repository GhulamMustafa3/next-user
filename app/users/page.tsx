import Link from "next/link";
import UserTable from "@/components/UserTable";

export default function UsersPage() {
  return (
    <main className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All Users</h1>
        <Link
          href="/users/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create User
        </Link>
      </div>

      <UserTable />
    </main>
  );
}
