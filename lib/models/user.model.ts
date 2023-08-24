import mongoose, { ObjectId } from "mongoose";

interface IUser extends mongoose.Document {
  _id: string | mongoose.Schema.Types.ObjectId;
  id: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  hoots: ObjectId[];
  onboarded: boolean;
  likes: Map<string, string>;
  communities: any[];
}

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  hoots: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hoot" }],
  onboarded: { type: Boolean, default: false },
  likes: {
    type: mongoose.Schema.Types.Map,
    of: String,
  },
  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

// try to minimze mongoose size imports -- not succssefull
// import { Schema, Types, model, models } from "mongoose";
//
// const userSchema = new Schema({
//   id: { type: String, required: true },
//   username: { type: String, required: true, unique: true },
//   name: { type: String, required: true },
//   image: String,
//   bio: String,
//   hoots: [{ type: Schema.Types.ObjectId, ref: "Hoot" }],
//   onboarded: { type: Boolean, default: false },
//   likes: [{ type: Schema.Types.ObjectId, ref: "Hoot" }],
//   communities: [{ type: Schema.Types.ObjectId, ref: "Community" }],
// });
//
// const User = models.User || model("User", userSchema);
//
// export default User;
