"use client";

import { Button } from "@/components/ui/button";
import { useShoppingCart } from "use-shopping-cart";
import { urlfor } from "../lib/sanity";

export interface ProductCart {
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
}

export function AddToBag({
  currency,
  description,
  image,
  name,
  price,
}: ProductCart) {
  const { addItem, handleCartClick } = useShoppingCart();

  const product = {
    id: `${name}-${Date.now()}`,
    name,
    description,
    price,
    currency,
    image: urlfor(image).url(),
  };

  return (
    <Button
      onClick={() => {
        addItem(product);
        handleCartClick();
      }}
    >
      Add To Cart
    </Button>
  );
}
