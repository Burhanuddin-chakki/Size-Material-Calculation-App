import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const pipeTypeSchema = new Schema(
  {
    id: { type: Number, unique: true, index: true, required: true },
    color: { type: String, required: true },
    ratePerKg: { type: Number, required: true },
  },
  { timestamps: true },
);

const PipeTypeModel = models.PipeType || model("PipeType", pipeTypeSchema);

export default PipeTypeModel;
