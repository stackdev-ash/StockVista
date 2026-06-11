import Link from "next/link";
import Image from "next/image";
import WatchlistButton from "./WatchlistButton";

export default function WatchlistCard({ watchlist }: { watchlist: any[] }) {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold text-white">Your Watchlist</h2>
        <Link
          href="/watchlist"
          className="text-sm text-gray-400 hover:text-white"
        >
          View all
        </Link>
      </div>

      <div className="h-112.5 rounded-xl border border-[#2A2A2A] bg-gray-800 p-5 overflow-y-auto mt-5">
        {watchlist.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <p className="text-center text-gray-400 text-lg">
              No stocks in watchlist
            </p>

            <Link
              href="/watchlist"
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-all duration-200"
            >
              Add Stocks
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {watchlist.slice(0, 6).map((stock) => (
              <Link
                key={stock.symbol}
                href={`/stocks/${stock.symbol}`}
                className="rounded-lg border border-[#2A2A2A] p-4 hover:bg-[#1A1A1A] transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 mb-3">
                    {stock.logo && (
                      <Image
                        src={stock.logo}
                        alt={stock.company}
                        width={40}
                        height={40}
                        unoptimized
                        className="rounded-md bg-white p-1"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-white">
                        {stock.symbol}
                      </div>

                      <div className="text-sm text-gray-400 truncate">
                        {stock.company}
                      </div>
                    </div>
                  </div>

                  <WatchlistButton
                    symbol={stock.symbol}
                    company={stock.company}
                    isInWatchlist={true}
                    type="icon"
                  />
                </div>

                <div className="mt-3 text-white">{stock.priceFormatted}</div>

                <div
                  className={`text-sm ${
                    stock.changePercent >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stock.changeFormatted}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
