import CreateAlertDialog from "./alerts/create-alert-dialog";
import { WatchlistButton } from "./WatchlistButton";
import { cn, getChangeColorClass } from "@/lib/utils";

export default function MobileWatchlistCards({
  watchlist,
}: {
  watchlist: StockWithData[];
}) {
  return (
    <div className="md:hidden space-y-4">
        {watchlist.map((item, index) => (
          <div
            key={item.symbol + index}
            className="rounded-xl border border-gray-700 bg-gray-800 p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white">{item.company}</h3>

                <p className="text-sm text-gray-400">{item.symbol}</p>
              </div>

              <WatchlistButton
                symbol={item.symbol}
                company={item.company}
                isInWatchlist={true}
                showTrashIcon={true}
                type="icon"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400">Price</p>
                <p className="text-white font-medium">
                  {item.priceFormatted || "—"}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Change</p>
                <p
                  className={cn(
                    "font-medium",
                    getChangeColorClass(item.changePercent),
                  )}
                >
                  {item.changeFormatted || "—"}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Market Cap</p>
                <p className="text-white">{item.marketCap || "—"}</p>
              </div>

              <div>
                <p className="text-gray-400">P/E Ratio</p>
                <p className="text-white">{item.peRatio || "—"}</p>
              </div>
            </div>

            <div className="mt-4">
              <CreateAlertDialog symbol={item.symbol} company={item.company} />
            </div>
          </div>
        ))}
      </div>
  );
}
