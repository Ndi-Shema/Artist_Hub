"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useShoppingCart } from "use-shopping-cart";

const links = [
  { name: "Home", href: "/" },
  { name: "Abstract", href: "/Abstract" },
  { name: "Culture", href: "/Culture" },
  { name: "Beautiful", href: "/Beautiful" },
  { name: "Legal Articles", href: "/education", isButton: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { handleCartClick } = useShoppingCart();

  return (
    <header className="mb-8 border-b">
      <div className="flex items-center justify-between mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl">
        <Link href="/">
          <h1 className="text-2xl md:text-4xl font-light">
            artist<span className="text-green-600 font-bold">Hub</span>
          </h1>
        </Link>

        <nav className="hidden gap-12 lg:flex 2xl:ml-16">
          {links.map((link, idx) => {
            if (link.isButton) {
              // Use router.push to navigate programmatically
              return (
                <div className="ml-12" key={idx}>
                  <Button
                    onClick={() => router.push(link.href)}
                    variant="default"
                    className="bg-primary hover:bg-primary/70 text-white"
                  >
                    {link.name}
                  </Button>
                </div>
              );
            } else {
              return (
                <div key={idx}>
                  {pathname === link.href ? (
                    <Link className="text-lg font-semibold text-primary" href={link.href}>
                      {link.name}
                    </Link>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-lg font-semibold text-gray-600 transition duration-100 hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              );
            }
          })}
        </nav>

        <div className="flex divide-x border-r sm:border-l">
          <Button
            variant="outline"
            onClick={() => handleCartClick()}
            className="flex flex-col gap-y-1.5 h-12 w-12 sm:h-20 sm:w-24 md:w-24 rounded-none"
          >
            <ShoppingBag />
            <span className="hidden text-xs font-semibold text-gray-500 sm:block">
              Cart
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
