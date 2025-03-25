"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useShoppingCart } from "use-shopping-cart";

// NextAuth
import { useSession, signOut } from "next-auth/react";

const links = [
  { name: "Home", href: "/" },
  { name: "Abstract", href: "/Abstract" },
  { name: "Culture", href: "/Culture" },
  { name: "Unique", href: "/Unique" },
  { name: "education articles", href: "/education", isButton: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { handleCartClick } = useShoppingCart();

  // NextAuth session
  const { data: session } = useSession();

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push("/");
  }

  return (
    <header className="mb-8 border-b">
      <div className="flex items-center justify-between mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-2xl md:text-4xl font-light">
            artist<span className="text-green-600 font-bold">Hub</span>
          </h1>
        </Link>

        {/* Nav links */}
        <nav className="hidden gap-12 lg:flex 2xl:ml-16">
          {links.map((link, idx) => {
            if (link.isButton) {
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

        {/* Right side: Cart + Single Auth Button */}
        <div className="flex items-center space-x-6">
          {/* Cart Button */}
          <Button
            variant="outline"
            onClick={() => handleCartClick()}
            className="flex flex-col gap-y-1.5 h-12 w-12 sm:h-20 sm:w-24 md:w-24 rounded-none"
          >
            <ShoppingBag />
            <span className="hidden text-xs font-semibold text-gray-500 sm:block">Cart</span>
          </Button>

          {/* Single Auth Button */}
          {!session?.user ? (
            // Not logged in => Log In
            <Button
              onClick={() => router.push("/login")}
              className="bg-primary text-white hover:bg-primary/80 px-4 py-2"
            >
              Log In
            </Button>
          ) : (
            // Logged in => show user name & small dropdown
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white hover:bg-primary/80 rounded">
                <span>{session.user.name ?? "Profile"}</span>
              </button>
              {/* Dropdown on hover/focus (optional) */}
              <div className="absolute right-0 mt-2 hidden group-hover:block w-32 bg-white border rounded shadow">
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
