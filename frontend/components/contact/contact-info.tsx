import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface ContactInfoProps {
  icon: ReactNode;
  title: string;
  details: string[];
  highlight?: string;
}

export function ContactInfo({
  icon,
  title,
  details,
  highlight,
}: ContactInfoProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="text-primary">{icon}</div>
        <div>
          <h3 className="font-semibold mb-2">{title}</h3>
          {details.map((detail, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {detail}
            </p>
          ))}
          {highlight && (
            <p className="text-sm text-primary font-medium mt-2">{highlight}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
