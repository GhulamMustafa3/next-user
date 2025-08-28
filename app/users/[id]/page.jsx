import Image from "next/image";
import { getUser } from "@/lib/db";

export default function UserDetailPage({ params }) {
  const user = getUser(params.id);

  if (!user) {
    return (
      <main>
        <h1 className="text-2xl font-bold">User not found</h1>
      </main>
    );
  }

  return (
    <main>
      <h1 className="text-2xl font-bold">{user.name}</h1>
      <Image
        src={user.imageUrl}
        alt={user.name}
        width={120}
        height={120}
        className="rounded-full"
      />
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </main>
  );
}
