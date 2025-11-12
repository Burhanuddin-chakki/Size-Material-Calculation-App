'use server';

import connectDb from "@/database/connection";
import MaterialModel from "@/models/material.model";
import WindowModel from "@/models/window.model";
import { MaterialType, PipeType, WindowType } from "../common/interfaces";
import PipeTypeModel from "@/models/pipe-type.model";

export async function fetchWindows(): Promise<WindowType[]> {
    await connectDb();
    const response = await WindowModel.find({}, { _id: 0, id: 1, windowType: 1, imageURL: 1, windowTrack: 1 }).sort({ id: 1 }).lean();
    return JSON.parse(JSON.stringify(response));
}

export async function fetchWindowfromWindowId(windowId: number): Promise<WindowType> {
    await connectDb();
    const response = await WindowModel.findOne({ id: windowId }, { _id: 0, id: 1, windowType: 1, imageURL: 1, windowTrack: 1 }).sort({ id: 1 }).lean();
    return JSON.parse(JSON.stringify(response));
}

export async function fetchMaterialList(): Promise<MaterialType[]> { 
    await connectDb();
    const response = await MaterialModel.find({}, { _id: 0, id: 1, label: 1, field: 1, unit: 1, rate: 1, windowTypeId: 1 }).sort({ id: 1 }).lean();
    return JSON.parse(JSON.stringify(response));
}

export async function fetchPipeType(): Promise<PipeType[]> {
    await connectDb();
    const response = await PipeTypeModel.find({}, { _id: 0, id: 1, color: 1, ratePerKg: 1 }).sort({ id: 1 }).lean();
    return JSON.parse(JSON.stringify(response));
}