import { keyof } from "zod";

export interface WindowType {
    id: number;
    windowType: string;
    imageURL: string;
    windowTrack: number;
}

export interface MaterialType {
    id: number;
    label: string;
    field: string;
    unit: string;
    rate: number;
    type?: Array<{
        name: string;
        field: string;
        rate: number;
    }>;
    windowTypeId: number[];
}

export interface PipeType {
    id: number;
    color: string;
    ratePerKg: number;
}

export interface PipeDetailType {
    id: number;
    pipeName: string;
    pipeType: string;
    pipeSizeUnit: string;
    pipeWeightUnit: string;
    windowType: number[];
    pipeSizes: {
        size: number;
        weight: number;
    }[];
}

export interface PipeEstimation {
    pipeType: string;
    pipeRate: number;
    unit: string;
    totalInches?: number;
    partialSmallPipeInches?: number;
    partialLargePipeInches?: number;
    fullSmallPipeCount?: number;
    fullLargePipeCount?: number;
    fullExtraPipeCount?: number;
    partialExtraPipeInches?: number;
    extraPipeSize?: number;
    totalWeight?: number;
    totalAmount?: number;
    cuttingEstimation: CuttingEstimation[];
}

export interface CuttingEstimation {
    pipeLength: number;
    pipeCuts: number[];
    wastage: number;
    full: boolean;
    partial: boolean;
}

export interface EstimationData {
    'Track Top'?: PipeEstimation;
    'Track Bottom'?: PipeEstimation;
    'Handle'?: PipeEstimation;
    'Long Bearing'?: PipeEstimation;
    'Interlock': PipeEstimation;
    'Track'?: PipeEstimation;
    'Shutter'?: PipeEstimation;
    'V Channel'?: PipeEstimation;
    '2 track Deep Domal'?: PipeEstimation;
    '3 track Deep Domal'?: PipeEstimation;
    'SP'?: PipeEstimation;
    'DP'?: PipeEstimation;
}

export type TrackType = 'trackTop' | 'trackBottom' | 'handle' | 'longBearing' | 'interlock' | 'track' | 'shutter' | 'vchannel' | 'spdp';

export interface OptimizationResult {
    pipe: number;
    cuts: number[];
    waste: number;
}

export interface CombinationResult {
    combination: number[];
    sum: number;
}

export interface BestCombinationOption {
    pipe: number;
    bestCombo: CombinationResult | null;
    leastWaste: number;
}

export type MaterialEstimationResult = { quantity: number, rate: number, totalPrice: number }
