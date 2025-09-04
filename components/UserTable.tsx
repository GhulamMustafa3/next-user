"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { User } from "@/types"; 

// type User = {
//   id: number;
//   name: string;
//   email: string;
//   age?: number;
//   role: string;
//   team?: number[];
//   image_url?: string;
// };

type UserTableProps = {
  filters?: {
    name?: string;
    email?: string;
    age?: string;
    role?: string;
  };
};

export default function UserTable({ filters = {} }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const router = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState<string>("");

  useEffect(() => {
    const role = localStorage.getItem("role") || "";
    setCurrentUserRole(role);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8008/api/users", {
          credentials: "include",
        });
        const data: User[] = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };
    fetchUsers();
  }, []);

  const canEditOrDelete =
    currentUserRole === "admin" || currentUserRole === "manager";

   const filteredUsers = users.filter((u) => {
    const { name = "", email = "", age = "", role = "" } = filters;

    const matchesName = name
      ? u.name.toLowerCase().includes(name.toLowerCase())
      : true;

    const matchesEmail = email
      ? u.email.toLowerCase().includes(email.toLowerCase())
      : true;

    const matchesAge = age ? String(u.age || "").includes(age) : true;

    const matchesRole = role
      ? u.role.toLowerCase() === role.toLowerCase()
      : true;

    return matchesName && matchesEmail && matchesAge && matchesRole;
  });


  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);


  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [filters, filteredUsers, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  const handleEdit = (userId: string) =>
    router.push(`/dashboard/user/${userId}/edit`);

  const handleDelete = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:8008/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== userId));
      else {
        const errorData = await res.json();
        console.error("Delete failed:", errorData);
        alert(errorData.error || "Delete failed");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Error deleting user.");
    }
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-xl shadow-md overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left rounded-tl-lg">Avatar</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Age</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-center">Team Size</th>
            {canEditOrDelete && (
              <th className="px-4 py-2 text-center rounded-tr-lg">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {currentUsers.length > 0 ? (
            currentUsers.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2">
                  {u.image_url ? (
                    <Image
                      src={u.image_url}
                      alt={u.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {u.name[0]}
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 font-medium">{u.name}</td>
                <td className="px-4 py-2 text-gray-600">{u.email}</td>
                <td className="px-4 py-2 ">{u.age ?? "-"}</td>
                <td className="px-4 py-2 capitalize">{u.role}</td>
                <td className="px-4 py-2 text-center">{u.team?.length || 0}</td>
                {canEditOrDelete && (
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(u.id)}
                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>

                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={canEditOrDelete ? 7 : 6}
                className="px-4 py-6 text-center text-gray-400"
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="mt-4 flex justify-center items-center space-x-4">

        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>


        <span className="px-4 py-2 bg-blue-600 text-white rounded">
          {currentPage} / {totalPages || 1}
        </span>


        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
