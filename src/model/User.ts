import mongoose, { Document, Schema } from "mongoose";
import { Message, MessageSchema } from "./Message";

export interface User extends Document {
  userName: string;
  email: string;
  password: string;
  isAcceptingMessages: boolean;
  isVerified: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  messages: Message[];
}

export const UserSchema: Schema<User> = new Schema({
  userName: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify code expiry is required"],
  },
  messages: [MessageSchema],
});

export const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model("User", UserSchema);
