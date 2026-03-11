"use client";

import { useEffect } from "react";
import { useAdminCheck } from "@/lib/hooks/use-admin-check";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, checking, checkAdminStatus } = useAdminCheck();

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  if (checking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return isAdmin ? <>{children}</> : null;
}
