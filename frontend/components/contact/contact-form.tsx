"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

// Simple textarea component since we don't have shadcn textarea
const Textarea = ({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  orderNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      orderNumber: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSuccess(true);
      toast.success("Message sent successfully!", {
        description: "We'll get back to you within 24 hours.",
      });
      reset();

      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      toast.error("Failed to send message", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>

      {isSuccess ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
          <p className="text-muted-foreground">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Order Number Field */}
          <div className="space-y-2">
            <label htmlFor="orderNumber" className="text-sm font-medium">
              Order Number (Optional)
            </label>
            <Input
              id="orderNumber"
              placeholder="ORD-123456"
              {...register("orderNumber")}
            />
          </div>

          {/* Subject Field */}
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <Input
              id="subject"
              placeholder="How can we help you?"
              {...register("subject")}
              className={errors.subject ? "border-red-500" : ""}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject.message}</p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Tell us more about your inquiry..."
              rows={5}
              {...register("message")}
              className={errors.message ? "border-red-500" : ""}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            By submitting this form, you agree to our{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>
            .
          </p>
        </form>
      )}
    </Card>
  );
}
