"use client";

import SideBar from "@/components/SideBar";
import TopBar from "@/components/Topbar";
import { User } from "@/types";
import { useRouter } from "next/navigation";

import { ReactNode, useEffect, useState } from "react";


interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const router=useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
     useEffect(() => {
        const fetchCurrentUser = async () => {
          try {
            const res = await fetch("http://localhost:8008/api/me", {
              credentials: "include",
            });
            if (res.status === 401) {
              router.push("auth/login");
              return;
            }
            const data: User = await res.json();
            setCurrentUser(data);
            
          } catch (err) {
            console.error("Error fetching current user", err);
          }
        };
        fetchCurrentUser();
      }, [router]);
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">

            <SideBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />


            <div className="flex-1 flex flex-col">

                <TopBar
                    profileUrl={currentUser?.image_url}
                    toggleSidebar={toggleSidebar}
                    userId={currentUser?.id}
                />

                <main className="flex-1 p-6 overflow-auto mt-10">{children}</main>
            </div>
        </div>
    );
}
