"use server";

import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";
import { revalidatePath } from "next/cache";
import { auth } from "../nextauth/auth";
import { getStocksDetails } from "@/lib/actions/finnhub.actions";

async function getCurrentUserId() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;

  const user = await db
    ?.collection("users")
    .findOne({ email: session.user.email });

  if (!user) {
    throw new Error("User not found");
  }

  return String(user._id);
}

export async function getWatchlistSymbolsByEmail(
  email: string,
): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");

    const user = await db
      .collection("users")
      .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || "");
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error("getWatchlistSymbolsByEmail error:", err);
    return [];
  }
}

export const addToWatchlist = async (symbol: string, company: string) => {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        requiresAuth: true,
      };
    }
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    const user = await db
      ?.collection("users")
      .findOne({ email: session?.user?.email });

    if (!user) {
      throw new Error("User not found in database");
    }

    const userId = String(user._id);

    // Check if stock already exists in watchlist
    const existingItem = await Watchlist.findOne({
      userId,
      symbol: symbol.toUpperCase(),
    });

    if (existingItem) {
      return { success: false, error: "Stock already in watchlist" };
    }

    // Add to watchlist
    const newItem = new Watchlist({
      userId,
      symbol: symbol.toUpperCase(),
      company: company.trim(),
    });

    await newItem.save();
    revalidatePath("/watchlist");
    revalidatePath("/");

    return { success: true, message: "Stock added to watchlist" };
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    throw new Error("Failed to add stock to watchlist");
  }
};

// Remove stock from watchlist
export const removeFromWatchlist = async (symbol: string) => {
  try {
    const userId = await getCurrentUserId();

    await Watchlist.deleteOne({
      userId,
      symbol: symbol.toUpperCase(),
    });
    revalidatePath("/watchlist");
    revalidatePath("/");

    return { success: true, message: "Stock removed from watchlist" };
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    throw new Error("Failed to remove stock from watchlist");
  }
};

// Get user's watchlist
export const getUserWatchlist = async () => {
  try {
    const userId = await getCurrentUserId();

    const watchlist = await Watchlist.find({ userId: userId })
      .sort({ addedAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(watchlist));
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    throw new Error("Failed to fetch watchlist");
  }
};

// Get user's watchlist with stock data
export const getWatchlistWithData = async () => {
  try {
    const userId = await getCurrentUserId();

    const watchlist = await Watchlist.find({
      userId,
    })
      .sort({ addedAt: -1 })
      .lean();

    if (watchlist.length === 0) return [];

    const stocksWithData = await Promise.all(
      watchlist.map(async (item) => {
        try {
          const stockData = await getStocksDetails(item.symbol);

          if (!stockData) {
            return {
              company: item.company,
              symbol: item.symbol,
              currentPrice: null,
              priceFormatted: "N/A",
              changeFormatted: "N/A",
              changePercent: 0,
              marketCap: "N/A",
              peRatio: "N/A",
            };
          }

          return {
            company: stockData.company,
            symbol: stockData.symbol,
            logo: stockData.logo,
            currentPrice: stockData.currentPrice,
            priceFormatted: stockData.priceFormatted,
            changeFormatted: stockData.changeFormatted,
            changePercent: stockData.changePercent,
            marketCap: stockData.marketCapFormatted,
            peRatio: stockData.peRatio,
          };
        } catch {
          return {
            company: item.company,
            symbol: item.symbol,
            currentPrice: null,
            priceFormatted: "N/A",
            changeFormatted: "N/A",
            changePercent: 0,
            marketCap: "N/A",
            peRatio: "N/A",
          };
        }
      }),
    );

    return stocksWithData.filter(
      (stock): stock is NonNullable<typeof stock> => stock !== null,
    );
  } catch (error) {
    console.error("Error loading watchlist:", error);
    throw new Error("Failed to fetch watchlist");
  }
};
