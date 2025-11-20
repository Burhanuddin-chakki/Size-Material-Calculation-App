import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const pipeSchema = new Schema(
  {
    id: { type: Number, unique: true, index: true, required: true },
    pipeName: { type: String, required: true },
    pipeType: { type: String, required: true },
    pipeSizeUnit: { type: String, required: true },
    pipeWeightUnit: { type: String, required: true },
    windowType: { type: [Number], required: true },
    pipeSizes: [
      {
        size: { type: Number, required: true },
        weight: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true },
);

const PipeModel = models.Pipe || model("Pipe", pipeSchema);

export default PipeModel;
