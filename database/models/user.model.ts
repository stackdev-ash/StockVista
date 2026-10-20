import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  image?: string | null;
  emailVerified?: Date | null;
  verificationToken?: string | null;
  verificationTokenExpiry?: Date | null;
  investmentGoal: string;
  riskTolerance: string;
  preferredIndustry: string;
  onboardingCompleted: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: true,
    },
    image: {
      type: String,
      default: null,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    verificationToken: {
      type: String,
      default: null,
      select: false,
    },
    verificationTokenExpiry: {
      type: Date,
      default: null,
      select: false,
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
