"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CheckoutNow() {
  const { data: session} = useSession();
  const router = useRouter();

  function handleCheckout() {
    if (!session?.user) {
      router.push("/login"); // redirect to login if not authenticated
    } else {
      // Proceed to checkout
      router.push("/checkout"); // or your actual checkout route
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      className="w-full mt-4 bg-primary text-white hover:bg-primary/80"
    >
      Checkout
    </Button>
  );
}
