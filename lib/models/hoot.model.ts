import mongoose from "mongoose";

const hootSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: { type: Date, default: Date.now },
  parentId: { type: String },
  likes: {
    type: mongoose.Schema.Types.Map,
    of: String,
  },
  // {
  //   type: Map,
  //   of: new mongoose.Schema({
  //     // from https://mongoosejs.com/docs/schematypes.html (map section)
  //     handle: String,
  //     _id: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //   }),
  // },
  // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hoot",
    },
  ],
});

const Hoot = mongoose.models.Hoot || mongoose.model("Hoot", hootSchema);

export default Hoot;
