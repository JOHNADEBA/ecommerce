import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/api/server";
import { OrderDetails } from "@/components/orders/order-details";

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: OrderPageProps) {
  const { id } = await params;

  return {
    title: `Order #${id.slice(-8)} | E-Store`,
    description: "View details and track your order.",
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in?redirect_url=/orders/" + id);
  }

  try {
    const order = await getOrder(id, user.id);

    if (!order) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <OrderDetails order={order} />
      </div>
    );
  } catch (error) {
    console.error("Error loading order:", error);
    notFound();
  }
}
