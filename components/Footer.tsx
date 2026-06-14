import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-[#2A2A2A] bg-gray-800 mt-12">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/assets/icons/icons.svg"
                alt="StockVista Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />

              <div>
                <h2 className="text-xl font-bold ">StockVista</h2>
                <p className="text-xs text-gray-500">Market Intelligence</p>
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-4 max-w-xs">
              Real-time stock insights, market news, watchlists, and analytics
              in one place.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigate To</h3>

            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-colors duration-200 underline"
              >
                Dashboard
              </Link>

              <Link
                href="/search"
                className="text-gray-400 hover:text-white transition-colors duration-200 underline"
              >
                Search
              </Link>

              <Link
                href="/watchlist"
                className="text-gray-400 hover:text-white transition-colors duration-200 underline"
              >
                Watchlist
              </Link>

            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect With Me</h3>

            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/ashish-cse/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaLinkedin size={22} />
              </a>

              <a
                href="https://github.com/stackdev-ash"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaGithub size={22} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#2A2A2A] text-center text-sm text-gray-500">
          © 2026 StockVista. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
