import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  investmentGoal: string;
  riskTolerance: string;
  preferredIndustry: string;
  onboardingCompleted: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    investmentGoal: {
      type: String,
      default: "",
    },

    riskTolerance: {
      type: String,
      default: "",
    },

    preferredIndustry: {
      type: String,
      default: "",
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
