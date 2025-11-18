import z from "zod";
import { vChannelSchema } from "../(ui)/component/vchannel-detail";
import { windowInputSchema } from "../(ui)/component/window-detail";
import { trackPipeSchema } from "../(ui)/component/track-detail";
import { shutterPipeSchema } from "../(ui)/component/shutter-detail";
import { interLockPipeSchema } from "../(ui)/component/interlock-detail";
import { PipeType } from "./interfaces";
import { trackBottomPipeSchema } from "../(ui)/component/track-bottom-detail";
import { trackTopPipeSchema } from "../(ui)/component/track-top-detail";
import { handlePipeSchema } from "../(ui)/component/handle-detail";
import { longBearingPipeSchema } from "../(ui)/component/long-bearing-detail";

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

export const getDefaultFormValues = (windowType: string, pipeType: PipeType[]) => {
    let defaults: any = {
        height: 0,
        width: 0,
        numberOfDoors: 2,
        isContainMacharJali: true,
        isContainGrillJali: true,
        selectedSpOrDpPipe: "none",
        interLockType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
        interLockRate: pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
        interLockExtraLength: 0,
    };
    if (/(Domal)/.test(windowType)) {
        defaults = {
            ...defaults,
            trackPipeType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
            trackPipeRate: pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
            extraTrackPipeLength: 0,
            shutterTrackType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
            shutterTrackRate: pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
            shutterExtraTrackLength: 0,
        };
    }
    if (/(Deep)/.test(windowType)) {
        defaults = {
            ...defaults,
            vChannelType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
            vChannelRate: pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
            vChannelExtraLength: 0,
        };
    }
    if (/(18\/60|Normal)/.test(windowType)) {
        defaults = {
            ...defaults,
            trackTopPipeType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
            trackTopPipeRate: pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
            extraTrackTopPipeLength: 0,
            trackBottomPipeType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
            trackBottomPipeRate: pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
            extraTrackBottomPipeLength: 0,
            handlePipeType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
            handlePipeRate: pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
            extraHandlePipeLength: 0,
            longBearingPipeType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
            longBearingPipeRate: pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
            extraLongBearingPipeLength: 0,
        };
    }

    return defaults;
};