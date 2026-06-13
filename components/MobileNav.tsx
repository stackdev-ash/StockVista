"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { usePathname } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import SearchCommand from "./SearchCommand";
import UserDropdown from "./UserDropdown";

interface MobileNavProps {
  initialStocks: StockWithWatchlistStatus[];
  user: User;
}

export default function MobileNav({ initialStocks, user }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden text-white">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-70 bg-[#14161d] border-r border-slate-800 text-white px-5"
      >
        <SheetHeader className="pb-4 border-b border-slate-800">
          <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>

          <SheetDescription className="sr-only">
            Navigation menu for StockVista
          </SheetDescription>

          <div className="flex items-center gap-2">
            <Image
              src="/assets/icons/icons.svg"
              alt="StockVista"
              width={28}
              height={28}
              className="h-7 w-auto"
            />

            <span className="text-lg font-bold">StockVista</span>
          </div>
        </SheetHeader>

        <div className="mt-1 flex flex-col gap-2">
          {NAV_ITEMS.map(({ href, label }) => {
            if (href === "/search") {
              return (
                <div
                  key="mobile-search"
                  className="
    rounded-lg
    px-3 py-2.5
    text-sm font-semibold
    text-white
    hover:bg-white/5
    transition-all
  "
                >
                  <SearchCommand
                    renderAs="text"
                    label="Search"
                    initialStocks={initialStocks}
                  />
                </div>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all 
                    ${
                      (
                        href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(href)
                      )
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
              >
                {label}
              </Link>
            );
          })}

          <div className="border-t border-slate-800 pt-5">
            {user ? (
              <>
              <div className="flex gap-2">
                <UserDropdown user={user} />
                <span className="text-white font-semibold text-base mt-1.5">{user.name}</span>
                </div>
              </>
            ) : (
              <Link
                href="/sign-in"
                className=" flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-all
  "
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
