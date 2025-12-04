import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const windowSchema = new Schema(
  {
    id: { type: Number, unique: true, index: true, required: true },
    windowType: { type: String, required: true },
    windowGroup: { type: String, required: true },
    imageURL: { type: String, required: true },
    windowTrack: { type: Number, required: true },
  },
  { timestamps: true },
);

const WindowModel = models.Window || model("Window", windowSchema);

export default WindowModel;
