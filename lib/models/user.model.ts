import mongoose from "mongoose";
import { boolean } from "zod";

// export interface IUser {
//   id: string;
//   username: string;
//   name: string;
//   hoots: mongoose.Types.ObjectId[];
//   onboarded: boolean;
//   communities: mongoose.Types.ObjectId[];
//   image?: string | undefined;
//   bio?: string | undefined;
// }

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  hoots: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hoot" }],
  onboarded: { type: Boolean, default: false },
  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
