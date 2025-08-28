
import Link from "next/link";
import Image from "next/image";
import { getUsers } from "@/lib/db";


export default function HomePage() {
  const users = getUsers();

  return (
    <main>
      <h1 className="text-2xl font-bold">User Directory</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            <Image src={u.imageUrl} alt={u.name} width={50} height={50} />
            <Link href={`/users/${u.id}`}>{u.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
