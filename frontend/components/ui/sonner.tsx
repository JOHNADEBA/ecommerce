"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",

          // Custom colors for better contrast
          "--warning-bg": "#fef3c7", // Soft yellow background
          "--warning-border": "#fbbf24", // Amber border
          "--warning-text": "#92400e", // Dark amber text
          "--warning-close-button": "#92400e",

          "--error-bg": "#fee2e2", // Soft red background
          "--error-border": "#ef4444", // Red border
          "--error-text": "#991b1b", // Dark red text

          "--success-bg": "#dcfce7", // Soft green background
          "--success-border": "#22c55e", // Green border
          "--success-text": "#166534", // Dark green text

          "--info-bg": "#dbeafe", // Soft blue background
          "--info-border": "#3b82f6", // Blue border
          "--info-text": "#1e40af", // Dark blue text
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "border-0 shadow-lg",
          title: "text-sm font-semibold",
          description: "text-sm opacity-90",
          actionButton:
            "bg-primary text-primary-foreground hover:bg-primary/90",
          cancelButton: "bg-muted text-muted-foreground hover:bg-muted/80",
        },
      }}
      expand={false}
      visibleToasts={1} // Show only one toast at a time
      closeButton
      {...props}
    />
  );
};

export { Toaster };
