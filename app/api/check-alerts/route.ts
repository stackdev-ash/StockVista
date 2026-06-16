import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import Alert from "@/database/models/alert.model";
import { connectToDatabase } from "@/database/mongoose";

import { sendUpperAlertEmail, sendLowerAlertEmail } from "@/lib/nodemailer";

import { getWatchlistStockData } from "@/lib/actions/finnhub.actions";

function canSendDaily(lastTriggeredAt: Date | null) {
  if (!lastTriggeredAt) return true;

  const now = Date.now();
  const last = new Date(lastTriggeredAt).getTime();

  const hoursPassed = (now - last) / (1000 * 60 * 60);

  return hoursPassed >= 24;
}

export async function GET() {
  try {
    await connectToDatabase();

    const alerts = await Alert.find({
      isActive: true,
    });

    const db = Alert.db.db;

    if (!db) {
      throw new Error("Database connection not available");
    }

    let triggeredCount = 0;

    for (const alert of alerts) {
      try {
        const stockData = await getWatchlistStockData(alert.symbol);

        if (!stockData) continue;

        const currentPrice = stockData.currentPrice;

        const user = await db.collection("users").findOne({
          _id: new ObjectId(alert.userId),
        });

        if (!user?.email) continue;

        const isUpperTriggered =
          alert.alertType === "upper" && currentPrice >= alert.threshold;

        const isLowerTriggered =
          alert.alertType === "lower" && currentPrice <= alert.threshold;

        if (!isUpperTriggered && !isLowerTriggered) {
          continue;
        }

        if (
          alert.frequency === "daily" &&
          !canSendDaily(alert.lastTriggeredAt)
        ) {
          continue;
        }

        if (isUpperTriggered) {
          await sendUpperAlertEmail({
            email: user.email,
            name: user.name || "Investor",
            symbol: alert.symbol,
            company: alert.company,
            currentPrice,
            targetPrice: alert.threshold,
          });
        }

        if (isLowerTriggered) {
          await sendLowerAlertEmail({
            email: user.email,
            name: user.name || "Investor",
            symbol: alert.symbol,
            company: alert.company,
            currentPrice,
            targetPrice: alert.threshold,
          });
        }

        triggeredCount++;

        alert.lastTriggeredAt = new Date();

        if (alert.frequency === "once") {
          alert.isActive = false;
        }

        await alert.save();
      } catch (err) {
        console.error(`Failed checking alert ${alert.symbol}`, err);
      }
    }

    return NextResponse.json({
      success: true,
      checked: alerts.length,
      triggered: triggeredCount,
    });
  } catch (error) {
    console.error("Alert cron failed:", error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}
