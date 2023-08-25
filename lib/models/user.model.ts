import mongoose, { ObjectId, Schema } from "mongoose";

interface IUser {
  _id: string | ObjectId;
  id: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  hoots: ObjectId[];
  onboarded: boolean;
  likes: Map<string, string | ObjectId>;
  communities: any[];
}

const userSchema: Schema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  hoots: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hoot" }],
  onboarded: { type: Boolean, default: false },
  // likes: [String],
  likes: { type: mongoose.Schema.Types.Map, of: String },
  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
