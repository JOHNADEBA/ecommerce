"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function FaqSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
  };

  return (
    <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search FAQs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 pr-10 py-6 text-base"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </form>
  );
}
