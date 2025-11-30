"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@@@/constants";

// Example import: adjust based on your actual path

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const access =
      typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN) : null;
    const refresh =
      typeof window !== "undefined"
        ? localStorage.getItem(REFRESH_TOKEN)
        : null;

    // No tokens → redirect
    if (!access || !refresh) {
      router.replace("/auth/signin");
      return;
    }

    try {
      const decoded = jwtDecode(access);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        // Access token expired → redirect to login (or trigger refresh flow if you have one)
        router.replace("/auth/signin");
        return;
      }

      // All good → render dashboard
      setIsReady(true);
    } catch (err) {
      router.replace("/auth/signin");
    }
  }, [router]);

  if (!isReady) {
    return null; // or loading spinner
  }

  return <>{children}</>;
}
