
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuthRedirect() {
  const router = useRouter();
   const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/login");

    }else {
      setIsChecking(false); 
    }
  }, [router]);
   return { isChecking };
}
