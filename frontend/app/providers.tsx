"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";

function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ReactQueryProvider>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </ReactQueryProvider>
    </ClerkProvider>
  );
}
