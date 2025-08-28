import { getUser } from "@/lib/db";
import UserDetail from "@/components/UserDetail";

export default function UserDetailPage({ params }) {
  const user = getUser(params.id);

  return (
    <main>
      <UserDetail user={user} />
    </main>
  );
}
