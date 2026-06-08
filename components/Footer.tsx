import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-[#2A2A2A] bg-[#141414] mt-12">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/assets/icons/icons.svg"
                alt="StockVista Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
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
                className="text-gray-400 hover:text-cyan-400 transition underline"
              >
                Dashboard
              </Link>

              <Link
                href="/search"
                className="text-gray-400 hover:text-cyan-400 transition underline"
              >
                Search
              </Link>

              <Link
                href="/watchlist"
                className="text-gray-400 hover:text-cyan-400 transition underline"
              >
                Watchlist
              </Link>

              <Link
                href="/news"
                className="text-gray-400 hover:text-cyan-400 transition underline"
              >
                News
              </Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect With Me</h3>

            <div className="flex items-center gap-4">
              <a
                href="YOUR_LINKEDIN_URL"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition"
              >
                <FaLinkedin size={22} />
              </a>

              <a
                href="YOUR_GITHUB_URL"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition"
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
