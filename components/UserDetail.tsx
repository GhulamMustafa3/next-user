import Image from "next/image";

export default function UserDetail({ user }) {
  if (!user) {
    return (
      <div>
        <h1 className="text-2xl font-bold">User not found</h1>
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}
