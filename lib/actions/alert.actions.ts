"use server";

import { auth } from "../../lib/nextauth/auth";
import { revalidatePath } from "next/cache";
import Alert from "@/database/models/alert.model";
import { connectToDatabase } from "@/database/mongoose";
import { getWatchlistStockData } from "./finnhub.actions";

const getCurrentUserId = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const mongoose = await connectToDatabase();

  if (!mongoose.connection.db) {
    throw new Error("Database connection failed");
  }
  const db = mongoose.connection.db;

  const user = await db.collection("users").findOne({
    email: session.user.email,
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user._id.toString();
};

export const createAlert = async ({
  symbol,
  company,
  alertName,
  alertType,
  threshold,
  frequency,
}: AlertData) => {
  try {
    await connectToDatabase();

    const userId = await getCurrentUserId();

    const existingAlert = await Alert.findOne({
      userId,
      symbol: symbol.toUpperCase(),
      alertType,
      threshold: Number(threshold),
    });

    if (existingAlert) {
      return {
        success: false,
        message: "Alert already exists",
      };
    }

    const stockData = await getWatchlistStockData(symbol);

    const currentPrice = stockData?.currentPrice || 0;

    const alert = await Alert.create({
      userId,
      symbol: symbol.toUpperCase(),
      company,
      alertName,
      alertType,
      threshold: Number(threshold),
      frequency,
      currentPrice,
      isActive: true,
    });

    revalidatePath("/watchlist");

    return {
      success: true,
      alert: JSON.parse(JSON.stringify(alert)),
    };
  } catch (error) {
    console.error("Error creating alert:", error);

    return {
      success: false,
      message: "Failed to create alert",
    };
  }
};

export const getUserAlerts = async () => {
  try {
    await connectToDatabase();

    const userId = await getCurrentUserId();

    const alerts = await Alert.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    return JSON.parse(JSON.stringify(alerts));
  } catch (error) {
    console.error("Error loading alerts:", error);
    return [];
  }
};

export const getAlertById = async (alertId: string) => {
  try {
    await connectToDatabase();
    const userId = await getCurrentUserId();

    const alert = await Alert.findOne({
      _id: alertId,
      userId,
    });

    if (!alert) return null;

    return JSON.parse(JSON.stringify(alert));
  } catch (error) {
    console.error("Error fetching alert:", error);
    return null;
  }
};

export const updateAlert = async (alertId: string, data: AlertData) => {
  try {
    await connectToDatabase();
    const userId = await getCurrentUserId();
    const alert = await Alert.findOne({
      _id: alertId,
      userId,
    });

    if (!alert) {
      throw new Error("Alert not found");
    }
    alert.symbol = data.symbol.toUpperCase();
    alert.company = data.company;
    alert.alertName = data.alertName;
    alert.alertType = data.alertType;
    alert.threshold = Number(data.threshold);
    alert.frequency = data.frequency;

    await alert.save();

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating alert:", error);
    return {
      success: false,
      message: "Failed to update alert",
    };
  }
};

export const deleteAlert = async (alertId: string) => {
  try {
    await connectToDatabase();

    const userId = await getCurrentUserId();

    const alert = await Alert.findOne({
      _id: alertId,
      userId,
    });

    if (!alert) {
      throw new Error("Alert not found");
    }

    await Alert.deleteOne({
      _id: alertId,
      userId,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting alert:", error);

    return {
      success: false,
      message: "Failed to delete alert",
    };
  }
};

export const toggleAlert = async (alertId: string) => {
  try {
    await connectToDatabase();

    const userId = await getCurrentUserId();

    const alert = await Alert.findOne({
      _id: alertId,
      userId,
    });

    if (!alert) {
      throw new Error("Alert not found");
    }

    alert.isActive = !alert.isActive;

    await alert.save();

    return {
      success: true,
      isActive: alert.isActive,
    };
  } catch (error) {
    console.error("Error toggling alert:", error);

    return {
      success: false,
      message: "Failed to update alert",
    };
  }
};

export const getStockAlerts = async (symbol: string) => {
  try {
    await connectToDatabase();

    const userId = await getCurrentUserId();

    const alerts = await Alert.find({
      userId,
      symbol: symbol.toUpperCase(),
    });

    return JSON.parse(JSON.stringify(alerts));
  } catch (error) {
    console.error("Error loading stock alerts:", error);

    return [];
  }
};
