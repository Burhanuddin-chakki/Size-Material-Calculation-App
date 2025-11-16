import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

//I want my document model 
// { label: "Angle", field: "angleRate", unit:"kg",  rate: 10, windowTypeId: 
//     [3,4,6,8,9]
//  }

const materialSchema = new Schema({
    id: { type: Number, unique: true, index: true, required: true },
    label: { type: String, required: true },
    field: { type: String, required: true },
    unit: { type: String, required: true },
    rate: { type: Number, required: true },
    type: [{
        name: { type: String },
        rate: { type: Number },
    }],
    windowTypeId: { type: [Number], required: true },
}, { timestamps: true });

const MaterialModel = models.Material || model('Material', materialSchema);

export default MaterialModel;