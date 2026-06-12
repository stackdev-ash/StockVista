import TradingViewWidget from "../../components/TradingViewWidget";
import {
  HEATMAP_WIDGET_CONFIG,
  MARKET_DATA_WIDGET_CONFIG,
  MARKET_OVERVIEW_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG,
} from "../../lib/constants";
import { getWatchlistWithData } from "@/lib/actions/watchlist.actions";
import { auth } from "@/lib/nextauth/auth";
import Link from "next/link";
import WatchlistCard from "@/components/WatchlistCard";

const Home = async () => {
  const session = await auth();
  const scriptUrl =
    "https://s3.tradingview.com/external-embedding/embed-widget-";

  const watchlist = session?.user ? await getWatchlistWithData() : [];

  return (
    <div className="flex min-h-screen home-wrapper">
      {/* Row 1 */}
      <section className="grid w-full gap-8 home-section">
        <div className="md:col-span-1 xl:col-span-1">
          <TradingViewWidget
            title="Market Overview"
            scriptUrl={`${scriptUrl}market-overview.js`}
            config={MARKET_OVERVIEW_WIDGET_CONFIG}
            height={600}
          />
        </div>

        <div className="md:col-span-1 xl:col-span-2">
          {session?.user ? (
            <WatchlistCard watchlist={watchlist} />
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-semibold text-white">
                  Your Watchlist
                </h2>
              </div>

              <div className="h-112.5 rounded-xl border border-[#2A2A2A] bg-gray-800 p-5 mt-5">
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <h3 className="text-2xl font-semibold text-white">
                    Sign in to create your watchlist
                  </h3>

                  <p className="mt-3 max-w-md text-slate-400">
                    Track stocks, create alerts and manage investments.
                  </p>

                  <Link
                    href="/sign-in"
                    className="px-4 py-2 mt-6 rounded-lg bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </>
          )}{" "}
        </div>
      </section>

      {/* Row 2 */}
      <section className="grid w-full gap-8 home-section">
        <div className="md:col-span-1 xl:col-span-2">
          <TradingViewWidget
            title="Top Stocks"
            scriptUrl={`${scriptUrl}market-quotes.js`}
            config={MARKET_DATA_WIDGET_CONFIG}
            height={600}
          />
        </div>

        <div className="md:col-span-1 xl:col-span-1">
          <TradingViewWidget
            title="Financial News"
            scriptUrl={`${scriptUrl}timeline.js`}
            config={TOP_STORIES_WIDGET_CONFIG}
            height={600}
          />
        </div>
      </section>

      {/* Row 3 */}
      <section className="w-full">
        <TradingViewWidget
          title="Market Heatmap"
          scriptUrl={`${scriptUrl}stock-heatmap.js`}
          config={HEATMAP_WIDGET_CONFIG}
          height={600}
        />
      </section>
    </div>
  );
};

export default Home;
