import z from "zod";
import { vChannelSchema } from "../components/vchannel-detail";
import { windowInputSchema } from "../components/window-detail";
import { trackPipeSchema } from "../components/track-detail";
import { shutterPipeSchema } from "../components/shutter-detail";
import { interLockPipeSchema } from "../components/interlock-detail";
import { MaterialType, PipeType } from "@/types";
import { trackBottomPipeSchema } from "../components/track-bottom-detail";
import { trackTopPipeSchema } from "../components/track-top-detail";
import { handlePipeSchema } from "../components/handle-detail";
import { longBearingPipeSchema } from "../components/long-bearing-detail";

export const getSchemaForWindowsPipe = (windowType: string) => {
  let schema = z.object({});
  schema = schema.extend({
    ...windowInputSchema.shape,
    ...interLockPipeSchema.shape,
  });
  if (/(Domal)/.test(windowType)) {
    schema = schema.extend({
      ...trackPipeSchema.shape,
      ...shutterPipeSchema.shape,
    });
  }
  if (/(Deep)/.test(windowType)) {
    schema = schema.extend({
      ...vChannelSchema.shape,
    });
  }
  if (/(18\/60|Normal)/.test(windowType)) {
    schema = schema.extend({
      ...trackTopPipeSchema.shape,
      ...trackBottomPipeSchema.shape,
      ...handlePipeSchema.shape,
      ...longBearingPipeSchema.shape,
    });
  }

  return schema;
};

export const getDefaultFormValues = (
  windowType: string,
  pipeType: PipeType[],
) => {
  let defaults: any = {
    height: 0,
    width: 0,
    numberOfDoors: 2,
    isContainMacharJali: true,
    isContainGrillJali: true,
    selectedSpOrDpPipe: "none",
    interLockType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
    interLockRate: pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
    interLockExtraLength: [],
  };
  if (/(Domal)/.test(windowType)) {
    defaults = {
      ...defaults,
      trackPipeType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
      trackPipeRate: pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
      extraTrackPipeLength: [],
      shutterTrackType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
      shutterTrackRate: pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
      shutterExtraTrackLength: [],
    };
  }
  if (/(Deep)/.test(windowType)) {
    defaults = {
      ...defaults,
      vChannelType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
      vChannelRate: pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
      vChannelExtraLength: [],
    };
  }
  if (/(18\/60|Normal)/.test(windowType)) {
    defaults = {
      ...defaults,
      trackTopPipeType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
      trackTopPipeRate: pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
      extraTrackTopPipeLength: [],
      trackBottomPipeType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
      trackBottomPipeRate:
        pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
      extraTrackBottomPipeLength: [],
      handlePipeType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
      handlePipeRate: pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
      extraHandlePipeLength: [],
      longBearingPipeType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
      longBearingPipeRate:
        pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
      extraLongBearingPipeLength: [],
    };
  }

  return defaults;
};

export const getMaterialSchema = (
  materialList: MaterialType[],
  showUChannelSections: boolean,
) => {
  let schema = z.object({});
  materialList.forEach((item) => {
    if (item.type && item.type.length > 0) {
      if (item.field !== "uChannel") {
        schema = schema.extend({
          [`${item.field}_type`]: z.string(),
          [`${item.field}_rate`]: z
            .number()
            .min(1, `${item.label} rate must be at least 1`),
        });
      } else {
        if (showUChannelSections) {
          schema = schema.extend({
            [`${item.field}_type`]: z.string(),
            [`${item.field}_rate`]: z
              .number()
              .min(1, `${item.label} rate must be at least 1`),
          });
        }
      }
    } else {
      schema = schema.extend({
        [item.field]: z
          .number()
          .min(1, `${item.label} rate must be at least 1`),
      });
    }
  });
  return schema;
};
