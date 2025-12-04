"use server";

import connectDb from "@/lib/db";
import MaterialModel from "@/models/material.model";
import WindowModel from "@/models/window.model";
import { MaterialType, PipeDetailType, PipeType, WindowType } from "@/types";
import PipeTypeModel from "@/models/pipe-type.model";
import PipeModel from "@/models/pipe.model";

export async function fetchWindows(): Promise<WindowType[]> {
  await connectDb();
  const response = await WindowModel.find(
    {},
    {
      _id: 0,
      id: 1,
      windowType: 1,
      windowGroup: 1,
      imageURL: 1,
      windowTrack: 1,
    },
  )
    .sort({ id: 1 })
    .lean();
  return JSON.parse(JSON.stringify(response));
}

export async function fetchWindowfromWindowId(
  windowId: number,
): Promise<WindowType> {
  await connectDb();
  const response = await WindowModel.findOne(
    { id: windowId },
    {
      _id: 0,
      id: 1,
      windowType: 1,
      windowGroup: 1,
      imageURL: 1,
      windowTrack: 1,
    },
  )
    .sort({ id: 1 })
    .lean();
  return JSON.parse(JSON.stringify(response));
}

export async function fetchMaterialList(
  windowId: number,
  windowGroup: string,
): Promise<MaterialType[]> {
  await connectDb();
  const response = await MaterialModel.aggregate([
    {
      $match: {
        windowTypeId: windowId,
      },
    },
    {
      $project: {
        id: 1,
        label: 1,
        field: 1,
        unit: 1,
        rate: 1,
        windowTypeId: 1,
        type: {
          $ifNull: [`$type.${windowGroup}`, []],
        },
      },
    },
  ]);
  return JSON.parse(JSON.stringify(response));
}

export async function fetchPipeType(): Promise<PipeType[]> {
  await connectDb();
  const response = await PipeTypeModel.find(
    {},
    { _id: 0, id: 1, color: 1, ratePerKg: 1 },
  )
    .sort({ id: 1 })
    .lean();
  return JSON.parse(JSON.stringify(response));
}

export async function fetchPipeDetail(
  windowId: number,
): Promise<PipeDetailType[]> {
  await connectDb();
  const response = await PipeModel.find(
    { windowType: windowId },
    {
      _id: 0,
      id: 1,
      pipeName: 1,
      pipeType: 1,
      pipeSizeUnit: 1,
      pipeWeightUnit: 1,
      windowType: 1,
      pipeSizes: 1,
    },
  )
    .sort({ id: 1 })
    .lean();
  return JSON.parse(JSON.stringify(response));
}
