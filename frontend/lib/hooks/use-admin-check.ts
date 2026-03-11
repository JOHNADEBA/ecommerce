import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useApi } from "@/lib/api/client";
import { toast } from "sonner";
import { useState } from "react";

export const useAdminCheck = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const api = useApi();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  const checkAdminStatus = async () => {
    if (!isLoaded) return;

    // Not logged in
    if (!isSignedIn || !user) {
      toast.error("Access Denied", {
        description: "Please sign in to access the admin area",
        duration: 5000,
      });

      setTimeout(() => router.push("/"), 2000);
      setChecking(false);
      return false;
    }

    try {
      const syncedUser = await api.auth.post("/users/sync", {
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      });

      // Logged in but not admin
      if (syncedUser.role !== "ADMIN") {
        toast.warning("Insufficient Permissions", {
          description: "This area is restricted to administrators only",
          duration: 5000,
        });

        setTimeout(() => router.push("/"), 2000);
        setChecking(false);
        return false;
      }

      // Is admin
      setIsAdmin(true);
      setChecking(false);
      return true;
    } catch (error) {
      toast.error("Verification Failed", {
        description: "Unable to verify your permissions",
        duration: 5000,
      });

      setTimeout(() => router.push("/"), 2000);
      setChecking(false);
      return false;
    }
  };

  return {
    isAdmin,
    checking,
    checkAdminStatus,
  };
};
