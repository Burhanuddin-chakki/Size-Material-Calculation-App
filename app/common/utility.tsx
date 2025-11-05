import z from "zod";
import { vChannelSchema } from "../(ui)/component/vchannel-detail";
import { windowInputSchema } from "../(ui)/component/window-detail";
import { trackPipeSchema } from "../(ui)/component/track-detail";
import { shutterPipeSchema } from "../(ui)/component/shutter-detail";
import { interLockPipeSchema } from "../(ui)/component/interlock-detail";
import { PipeType } from "./interfaces";

export const getSchemaForWindowsPipe = (windowType: string) => {
    let schema = z.object({});
    if (windowType === '3 Track Domal') {
        schema = schema.extend({
            ...windowInputSchema.shape,
            ...trackPipeSchema.shape,
            ...shutterPipeSchema.shape,
            ...interLockPipeSchema.shape,
            ...vChannelSchema.shape,
        });
    }

    return schema;
};

export const getDefaultFormValues = (windowType: string, pipeType: PipeType[]) => {
        let defaults: any = {};
        if (windowType === "3 Track Domal") {
            defaults = {
                // Always provide base defaults to prevent undefined values
                height: 0,
                width: 0,
                numberOfDoors: 2,
                isContainMacharJali: false,
                trackPipeType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
                trackPipeRate: pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
                extraTrackPipeLength: 0,
                shutterTrackType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
                shutterTrackRate: pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
                shutterExtraTrackLength: 0,
                interLockType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
                interLockRate: pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
                interLockExtraLength: 0,
                vChannelType: pipeType.length > 0 ? pipeType[0]?.color || "" : "",
                vChannelRate: pipeType.length > 0 ? pipeType[0]?.ratePerKg || 0 : 0,
                vChannelExtraLength: 0,
            };
        }

        return defaults;
    };