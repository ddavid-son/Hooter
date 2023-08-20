import mongoose from "mongoose";

export interface IHoot {
  text: string;
  author: mongoose.Types.ObjectId | string;
  createdAt: Date;
  children: mongoose.Types.ObjectId[];
  community?: mongoose.Types.ObjectId | undefined;
  parentId?: string | undefined;
}

const hootSchema = new mongoose.Schema<IHoot>({
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
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hoot",
    },
  ],
});

const Hoot = mongoose.models.Hoot || mongoose.model<IHoot>("Hoot", hootSchema);

export default Hoot;
