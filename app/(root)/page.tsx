import TradingViewWidget from "../../components/TradingViewWidget";
import {
  HEATMAP_WIDGET_CONFIG,
  MARKET_DATA_WIDGET_CONFIG,
  MARKET_OVERVIEW_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG,
} from "../../lib/constants";
import { getWatchlistWithData } from "@/lib/actions/watchlist.actions";
import WatchlistCard from "@/components/WatchlistCard";

const Home = async () => {
  const scriptUrl =
    "https://s3.tradingview.com/external-embedding/embed-widget-";

  const watchlist = await getWatchlistWithData();

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
          <WatchlistCard watchlist={watchlist} />
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
