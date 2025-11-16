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