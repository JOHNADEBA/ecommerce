"use client";

import { useState } from "react";
import {
  Package,
  Truck,
  RotateCcw,
  CreditCard,
  User,
  HelpCircle,
} from "lucide-react";

const categories = [
  { id: "orders", label: "Orders & Tracking", icon: Package },
  { id: "shipping", label: "Shipping & Delivery", icon: Truck },
  { id: "returns", label: "Returns & Refunds", icon: RotateCcw },
  { id: "payments", label: "Payments & Pricing", icon: CreditCard },
  { id: "account", label: "Account & Security", icon: User },
  { id: "other", label: "Other Questions", icon: HelpCircle },
];

export function FaqCategories() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setActiveCategory(categoryId);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
      {categories.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => scrollToCategory(id)}
          className={`flex flex-col items-center p-4 rounded-lg border transition-all hover:border-primary hover:bg-primary/5 ${
            activeCategory === id ? "border-primary bg-primary/5" : ""
          }`}
        >
          <Icon className="h-6 w-6 mb-2 text-primary" />
          <span className="text-xs text-center">{label}</span>
        </button>
      ))}
    </div>
  );
}
