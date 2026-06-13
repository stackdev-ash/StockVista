import Link from "next/link";
import Image from "next/image";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";
import UserDropdown from "./UserDropdown";
import { searchStocks } from "../lib/actions/finnhub.actions";

const Header = async ({ user }: { user: User }) => {
  const initialStocks = await searchStocks();

  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/icons/icons.svg"
            alt="StockVista logo"
            width={140}
            height={32}
            priority
            className="h-8 w-auto cursor-pointer"
          />

          <span className="text-xl font-bold text-white">StockVista</span>
        </Link>

        <nav className="hidden sm:block">
          <NavItems initialStocks={initialStocks} />
        </nav>

        <div className="hidden md:block">
          {user ? (
            <UserDropdown user={user} />
          ) : (
            <Link
              href="/sign-in"
              className="
      px-4 py-2
      rounded-lg
      border border-white/10
      bg-white/5
      text-white
      font-medium
      hover:bg-white/10
      transition-all
    "
            >
              Sign In
            </Link>
          )}
        </div>
        <MobileNav user={user} initialStocks={initialStocks} />
      </div>
    </header>
  );
};
export default Header;
