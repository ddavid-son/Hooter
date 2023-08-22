import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  hoots: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hoot" }],
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  members: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Community =
  mongoose.models.Community || mongoose.model("Community", communitySchema);

export default Community;
