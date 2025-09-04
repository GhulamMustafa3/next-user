"use client";

import Link from "next/link";
import UserTable from "@/components/UserTable";
import UserSearch from "@/components/SearchBar"; // advanced search component
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

type Filters = {
  query?: string;
  role?: string;
 
};

export default function UsersPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({}); 
  const { isChecking } = useAuthRedirect();

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "";
    setRole(storedRole);
  }, []);

  if (isChecking) {
    return <p className="p-4">Checking authentication...</p>;
  }

  return (
    <main className="p-4">
    

     
      <UserSearch onSearch={(f: Filters) => setFilters(f)} />

   
      <UserTable filters={filters} />
    </main>
  );
}
