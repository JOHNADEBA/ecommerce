import { currentUser } from '@clerk/nextjs/server';
import { CartClient } from './cart-client';
import { SignInPrompt } from './sign-in-prompt';

export default async function CartPage() {
  const user = await currentUser();
  
  if (!user) {
    return <SignInPrompt />;
  }

  return <CartClient clerkId={user.id} />;
}