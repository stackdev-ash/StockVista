import { Star } from "lucide-react";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import SearchCommand from "@/components/SearchCommand";
import { getWatchlistWithData } from "@/lib/actions/watchlist.actions";
import { getUserAlerts } from "@/lib/actions/alert.actions";
import { WatchlistTable } from "../../../components/WatchlistTable";
import AlertsPanel from "../../../components/alerts/alerts-panel";
import { auth } from "@/lib/nextauth/auth";
import { redirect } from "next/navigation";

const Watchlist = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const watchlist: any = await getWatchlistWithData();
  const initialStocks: StockWithWatchlistStatus[] = [];
  const alerts = await getUserAlerts();

  // Empty state
  if (watchlist.length === 0) {
    return (
      <div className="flex justify-center items-center">
        <section className="flex watchlist-empty-container">
          <div className="watchlist-empty">
            <Star className="watchlist-star" />
            <h2 className="empty-title">Your watchlist is empty</h2>
            <p className="empty-description">
              Start building your watchlist by searching for stocks and clicking
              the star icon to add them.
            </p>
          </div>
          <SearchCommand initialStocks={initialStocks} />
        </section>
      </div>
    );
  }

  return (
    <section className="watchlist">
      <div className="grid lg:grid-cols-[2fr_1fr] gap-6 items-start">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="watchlist-title">Watchlist</h2>
            <SearchCommand initialStocks={initialStocks} />
          </div>

          <WatchlistTable watchlist={watchlist} />
        </div>
        <div className="flex flex-col mt-[0.400rem] gap-6 sticky top-24">
          <h2 className="watchlist-title">Alerts</h2>

          <AlertsPanel alerts={alerts} />
        </div>
      </div>
    </section>
  );
};

export default Watchlist;
