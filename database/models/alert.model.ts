import { Schema, model, models } from "mongoose";

const AlertSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    symbol: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    alertName: {
      type: String,
      required: true,
    },

    alertType: {
      type: String,
      enum: ["upper", "lower"],
      required: true,
    },

    threshold: {
      type: Number,
      required: true,
    },

    currentPrice: {
      type: Number,
      default: 0,
    },

    changePercent: {
      type: Number,
      default: 0,
    },

    frequency: {
      type: String,
      enum: ["once", "daily"],
      default: "once",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastTriggeredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default models.Alert || model("Alert", AlertSchema);
