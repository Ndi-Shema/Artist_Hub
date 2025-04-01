"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Image from "next/image";
import { useShoppingCart } from "use-shopping-cart";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { useCallback, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FlutterWaveResponse {
  status: string;
  transaction_id: number;
  tx_ref: string;
}

export default function ShoppingCartModal() {
  const {
    cartCount,
    shouldDisplayCart,
    handleCartClick,
    cartDetails,
    removeItem,
    totalPrice,
    setItemQuantity,
  } = useShoppingCart();

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const { data: session } = useSession();
  const router = useRouter();

  const totalAmount = (totalPrice ?? 0) > 0 ? totalPrice! : 1;

  const config = useMemo(() => ({
    public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || "",
    tx_ref: "ARTSHOP-" + Date.now(),
    amount: totalAmount,
    currency: "RWF",
    payment_options: "card, mobilemoneyrwanda",
    customer: {
      email: session?.user?.email || "",
      phone_number: phoneNumber,
      name: session?.user?.name || "Guest",
    },
    customizations: {
      title: "The Artist Hub Checkout",
      description: "Payment for items in cart",
      logo: "https://your-logo-url.com/logo.png",
    },
    callback: async (response: FlutterWaveResponse) => {
      console.log("Payment Response:", response);
      closePaymentModal();
      alert("Payment Successful!");

      try {
        await fetch("/api/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: session?.user?.name || "Valued Customer",
            email: session?.user?.email,
            phone: phoneNumber,
            items: Object.values(cartDetails ?? {}),
            total: totalPrice,
          }),
        });
      } catch (error) {
        console.error("Failed to send confirmation email:", error);
      }
    },
    onclose: () => alert("Payment window closed"),
  }), [session, phoneNumber, cartDetails, totalPrice, totalAmount]);

  const handleFlutterwavePayment = useFlutterwave(config);

  const handlePayment = useCallback(() => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    if (typeof handleFlutterwavePayment !== "function") {
      console.error("Flutterwave payment function is not initialized properly");
      return;
    }
    handleFlutterwavePayment({
      callback: config.callback,
      onClose: config.onclose,
    });
  }, [handleFlutterwavePayment, session, router, config]);

  return (
    <Sheet open={shouldDisplayCart} onOpenChange={() => handleCartClick()}>
      <SheetContent className="sm:max-w-lg w-[90vw]">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>

        <div className="h-full flex flex-col justify-between">
          <div className="mt-8 flex-1 overflow-y-auto">
            <ul className="-my-6 divide-y divide-gray-200">
              {cartCount === 0 ? (
                <h1 className="py-6">You don&apos;t have any items.</h1>
              ) : (
                Object.values(cartDetails ?? {}).map((entry, index) => (
                  <li key={`${entry.id}-${index}`} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                      <Image src={entry.image as string} alt={entry.name} width={100} height={100} />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{entry.name}</h3>
                        <p className="ml-4">{entry.price} RWF</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{entry.description}</p>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <button onClick={() => setItemQuantity(entry.id, entry.quantity - 1)} disabled={entry.quantity === 1} className="px-2 py-1 bg-gray-200 rounded">
                            ➖
                          </button>
                          <p className="text-gray-500">{entry.quantity}</p>
                          <button onClick={() => setItemQuantity(entry.id, entry.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded">
                            ➕
                          </button>
                        </div>
                        <button onClick={() => removeItem(entry.id)} className="font-medium text-red-500 hover:text-red-700">
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+250 788 123 456"
              className="w-full border rounded px-2 py-1 text-gray-700 mb-4"
            />
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal:</p>
              <p>{totalPrice} RWF</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">Delivery and taxes are calculated at checkout.</p>
            <div className="mt-6">
              <Button className="w-full" onClick={handlePayment} disabled={cartCount === 0 || !totalPrice}>
                Checkout with Flutterwave
              </Button>
            </div>
            <div className="mt-6 flex justify-center text-sm text-gray-500">
              <button onClick={() => handleCartClick()} className="font-medium text-primary hover:text-primary/80">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
