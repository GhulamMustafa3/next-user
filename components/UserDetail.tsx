import Image from "next/image";

export default function UserDetail({ user }: { user: any }) {
  if (!user) {
    return (
      <div>
        <h1 className="text-2xl font-bold">User not found</h1>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg shadow-md max-w-md">
      <h1 className="text-2xl font-bold mb-4">{user.name}</h1>

      {user.image_url ? (
        <Image
          src={user.image_url}
          alt={user.name}
          width={120}
          height={120}
          className="rounded-full mb-4"
        />
      ) : (
        <div className="w-[120px] h-[120px] rounded-full bg-gray-200 flex items-center justify-center mb-4">
          <span className="text-gray-500">No Image</span>
        </div>
      )}

      <div className="space-y-2">
        <p><span className="font-semibold">ID:</span> {user.id}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
        <p><span className="font-semibold">Age:</span> {user.age}</p>
        <p><span className="font-semibold">Role:</span> {user.role}</p>
     
      </div>
    </div>
  );
}
