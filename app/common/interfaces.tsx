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
    windowTypeId: number[];
}

export interface PipeType {
    id: number;
    color: string;
    ratePerKg: number;
}