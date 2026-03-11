"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FaqSectionProps {
  title: string;
  description: string;
  questions: Array<{ q: string; a: string }>;
}

export function FaqSection({ title, description, questions }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="border rounded-lg overflow-hidden">
      <div className="bg-muted/50 p-6">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="divide-y">
        {questions.map((item, index) => (
          <div key={index} className="p-6">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="font-medium text-lg">{item.q}</span>
              {openIndex === index ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
            </button>

            {openIndex === index && (
              <div className="mt-4 text-muted-foreground leading-relaxed">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
