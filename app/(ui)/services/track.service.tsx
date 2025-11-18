import {
    BestCombinationOption,
    CombinationResult,
    CuttingEstimation,
    OptimizationResult,
    PipeEstimation,
    TrackType
} from "@/app/common/interfaces";
import { getNoOfPannels } from "./material.service";

const minWasteLimit = 36;
const pipeTypeRateAndWeightMapping: Record<TrackType, string[]> = {
    'track': ["trackPipeType", "trackPipeRate", "smallTrackPipeWeight", "bigTrackPipeWeight","trackPipeSize180", "trackPipeSize192"],
    'shutter': ["shutterTrackType", "shutterTrackRate", "smallShutterTrackWeight"," bigShutterTrackWeight", "shutterPipeSize180", "shutterPipeSize192"],
    'interlock': ["interLockType", "interLockRate", "smallInterLockWeight", "bigInterLockWeight", "interLockPipeSize180", "interLockPipeSize192"],
    'vchannel': ["vChannelType", "vChannelRate", "smallVChannelWeight", "bigVChannelWeight", "vChannelPipeSize180", "vChannelPipeSize192"],
    'trackTop': ["trackTopPipeType", "trackTopPipeRate", "smallTrackTopPipeWeight", "bigTrackTopPipeWeight", "trackTopPipeSize180", "trackTopPipeSize192"],
    'trackBottom': ["trackBottomPipeType", "trackBottomPipeRate", "smallTrackBottomPipeWeight", "bigTrackBottomPipeWeight", "trackBottomPipeSize180", "trackBottomPipeSize192"],
    'handle': ["handlePipeType", "handlePipeRate", "smallHandlePipeWeight", "bigHandlePipeWeight", "handlePipeSize180", "handlePipeSize192"],
    'longBearing': ["longBearingPipeType", "longBearingPipeRate", "smallLongBearingPipeWeight", "bigLongBearingPipeWeight", "longBearingPipeSize180", "longBearingPipeSize192"],
    'spdp': ["spdpPipeType", "spdpPipeRate", "smallSpdpPipeWeight", "bigSpdpPipeWeight", "spdpPipeSize180", "spdpPipeSize192", "spdpType"],
};

const getPipeSizes = (inputData: any, trackType: TrackType): number[] => {
    const pipeSizes: number[] = [];
    if (inputData[pipeTypeRateAndWeightMapping[trackType][4]] && inputData[pipeTypeRateAndWeightMapping[trackType][5]]) { // Placeholder for size 180 check
        pipeSizes.push(180);
        pipeSizes.push(192);
    } else if (inputData[pipeTypeRateAndWeightMapping[trackType][4]]) {
        pipeSizes.push(180);
    } else if (inputData[pipeTypeRateAndWeightMapping[trackType][5]]) {
        pipeSizes.push(192);
    }
    return pipeSizes;
}

export const getTrackCuttingEstimation = (inputData: any): PipeEstimation => {
    const trackRequireCuts = getTrackRequiredCuts(inputData);
    const trackPipeSizes: number[] = getPipeSizes(inputData, 'track');

    return optimizePipesUtilisation(trackRequireCuts, trackPipeSizes, [inputData.extraTrackPipeLength], inputData, 'track');

}

export const getTrackTopCuttingEstimation = (inputData: any): PipeEstimation => {
    const trackRequireCuts = getTrackTopRequiredCuts(inputData);
    const trackTopPipeSizes: number[] = getPipeSizes(inputData, 'trackTop');
    return optimizePipesUtilisation(trackRequireCuts, trackTopPipeSizes, [inputData.extraTrackTopPipeLength], inputData, 'trackTop');

}
export const getTrackBottomCuttingEstimation = (inputData: any): PipeEstimation => {
    const trackRequireCuts = getTrackBottomRequiredCuts(inputData);
    const trackBottomPipeSizes: number[] = getPipeSizes(inputData, 'trackBottom');
    return optimizePipesUtilisation(trackRequireCuts, trackBottomPipeSizes, [inputData.extraTrackBottomPipeLength], inputData, 'trackBottom');

}
export const getHandleTrackCuttingEstimation = (inputData: any): PipeEstimation => {
    const handleRequireCuts = getHandleTrackRequiredCuts(inputData);
    const handlePipeSizes: number[] = getPipeSizes(inputData, 'handle');
    return optimizePipesUtilisation(handleRequireCuts, handlePipeSizes, [inputData.extraTrackHandlePipeLength], inputData, 'handle');
}

export const getLongBearingCuttingEstimation = (inputData: any): PipeEstimation => {
    const handleRequireCuts = getLongBearingRequiredCuts(inputData);
    const longBearingPipeSizes: number[] = getPipeSizes(inputData, 'longBearing');
    return optimizePipesUtilisation(handleRequireCuts, longBearingPipeSizes, [inputData.extraTrackLongBearingPipeLength], inputData, 'longBearing');
}

export const getShutterTrackCuttingEstimation = (inputData: any): PipeEstimation => {
    const shutterTrackRequireCuts = getShutterTrackRequiredCuts(inputData);
    const shutterPipeSizes: number[] = getPipeSizes(inputData, 'shutter');
    return optimizePipesUtilisation(shutterTrackRequireCuts, shutterPipeSizes, [inputData.shutterExtraTrackLength], inputData, 'shutter');
}

export const getInterLockCuttingEstimation = (inputData: any): PipeEstimation => {
    const interLockRequireCuts = getInterLockRequiredCuts(inputData);
    const interLockPipeSizes: number[] = getPipeSizes(inputData, 'interlock');
    return optimizePipesUtilisation(interLockRequireCuts, interLockPipeSizes, [inputData.interLockExtraLength], inputData, 'interlock');
}

export const getVChannelCuttingEstimation = (inputData: any): PipeEstimation => {
    const vChannelRequireCuts = getVChannelRequiredCuts(inputData);
    const vChannelPipeSizes: number[] = getPipeSizes(inputData, 'vchannel');
    return optimizePipesUtilisation(vChannelRequireCuts, vChannelPipeSizes, [inputData.vChannelExtraLength], inputData, 'vchannel');
}
export const getSPDPTrackCuttingEstimation = (inputData: any): PipeEstimation => {
    const spdpRequireCuts = getTrackRequiredCuts(inputData);
    const spdpPipeSizes: number[] = getPipeSizes(inputData, 'spdp');
    return optimizePipesUtilisation(spdpRequireCuts, spdpPipeSizes, [inputData.extraSpdpPipeLength], inputData, 'spdp');

}


const getTrackRequiredCuts = (inputData: any) => {
    return [inputData.height, inputData.width, inputData.height, inputData.width];
}
const getTrackTopRequiredCuts = (inputData: any) => {
    return [inputData.height, inputData.width, inputData.height];
}
const getTrackBottomRequiredCuts = (inputData: any) => {
    return [inputData.width];
}
const getHandleTrackRequiredCuts = (inputData: any) => {
    const iteration = getNoOfPannels(inputData);
    const requireCuts: number[] = [];
    for (let i = 0; i < iteration; i++) {
        requireCuts.push(inputData.height);
    }
    return requireCuts;
}
const getLongBearingRequiredCuts = (inputData: any) => {
    const iteration = getNoOfPannels(inputData);
    const partitionWidth = inputData.width / inputData.numberOfDoors;
    const requireCuts: number[] = [];
    for (let i = 0; i < iteration; i++) {
        requireCuts.push(partitionWidth);
        requireCuts.push(partitionWidth);
    }
    return requireCuts;
}

const getShutterTrackRequiredCuts = (inputData: any) => {
    const requireCuts: number[] = [];
    const iteration = getNoOfPannels(inputData);
    const partitionWidth = inputData.width / inputData.numberOfDoors;
    for (let i = 0; i < iteration * 2; i++) {
        requireCuts.push(partitionWidth);
        requireCuts.push(inputData.height);
    }
    return requireCuts;
}

const getInterLockRequiredCuts = (inputData: any) => {
    return [inputData.height, inputData.width, inputData.height, inputData.width];
}

const getVChannelRequiredCuts = (inputData: any) => {
    return [inputData.width];
}


function optimizePipesUtilisation(
    requiredCuts: number[],
    pipeSizes: number[],
    extraPipeSize: number[],
    inputData: any,
    trackType: TrackType,
    minWaste = minWasteLimit
): PipeEstimation {
    const results: OptimizationResult[] = [];
    let remainingCuts = [...requiredCuts]; // Create a copy
    let isExtraPipeUsed = false;

    while (remainingCuts.length > 0) {
        // Get all possible combinations from remaining cuts
        const combinations = getAllSumCombinations(remainingCuts);
        const allPipeSizes = !isExtraPipeUsed && extraPipeSize[0] > 0 ? [...pipeSizes, ...extraPipeSize] : pipeSizes;
        // Find best combinations for each pipe size
        const bestOptions = findBestCombinations(combinations, allPipeSizes);

        // Select the overall best option (least waste)
        let selectedOption = null;
        let bestWaste = Infinity;

        for (let option of bestOptions) {
            if (option.bestCombo && option.leastWaste < bestWaste) {
                bestWaste = option.leastWaste;
                selectedOption = {
                    pipe: option.pipe,
                    cuts: option.bestCombo.combination,
                    waste: option.leastWaste
                };
            }
        }

        // If no valid combination found, break
        if (!selectedOption) {
            break;
        }
        if(!isExtraPipeUsed) {
            isExtraPipeUsed = extraPipeSize.includes(selectedOption.pipe);
        }

        // Add to results
        results.push(selectedOption);

        // Remove used cuts from remaining cuts
        for (let cut of selectedOption.cuts) {
            const index = remainingCuts.indexOf(cut);
            if (index !== -1) {
                remainingCuts.splice(index, 1);
            }
        }
    }
    const cuttingEstimation = getCuttingEstimation(results, minWaste);
    const {
        fullSmallPipeCount,
        fullLargePipeCount,
        partialSmallPipeInches,
        partialLargePipeInches,
        fullExtraPipeCount,
        partialExtraPipeInches
    } = getPipeCountAndInches(cuttingEstimation);

    const totalInches = calculateTotalInches(cuttingEstimation);
    const totalWeight = getTotalWeight(cuttingEstimation, trackType, inputData);
    const totalAmount = totalWeight * inputData[pipeTypeRateAndWeightMapping[trackType][1]]
    
    const finalEstimation: PipeEstimation = {
        pipeType: trackType !== 'spdp' ? inputData[pipeTypeRateAndWeightMapping[trackType][0]] : `${inputData[pipeTypeRateAndWeightMapping[trackType][6]]} / ${inputData[pipeTypeRateAndWeightMapping[trackType][0]]}`,
        pipeRate: inputData[pipeTypeRateAndWeightMapping[trackType][1]],
        unit: 'Inches',
        totalInches: totalInches,
        partialSmallPipeInches: partialSmallPipeInches,
        partialLargePipeInches: partialLargePipeInches,
        fullSmallPipeCount: fullSmallPipeCount,
        fullLargePipeCount: fullLargePipeCount,
        fullExtraPipeCount: fullExtraPipeCount,
        partialExtraPipeInches: partialExtraPipeInches,
        extraPipeSize: extraPipeSize[0],
        totalWeight: totalWeight,    //Later inches x weight per inch
        totalAmount: Math.round(totalAmount * 100) / 100,    // Later total weight x rate
        cuttingEstimation: cuttingEstimation
    }

    return finalEstimation;
}

function getAllSumCombinations(numbers: number[]): CombinationResult[] {
    const results = [];
    const n = numbers.length;

    // Use bitmasking to generate all possible combinations
    for (let i = 1; i < (1 << n); i++) {
        const combo = [];
        for (let j = 0; j < n; j++) {
            if (i & (1 << j)) combo.push(numbers[j]);
        }
        const sum = combo.reduce((a, b) => a + b, 0);
        results.push({ combination: combo, sum });
    }

    // Optional: remove duplicates (since 48,48 repeats)
    const unique: CombinationResult[] = [];
    const seen = new Set();
    for (let item of results) {
        const key = item.combination.slice().sort((a, b) => a - b).join(',');
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(item);
        }
    }

    return unique;
}

function findBestCombinations(combinations: CombinationResult[], pipeSizes: number[]): BestCombinationOption[] {
    const results: BestCombinationOption[] = [];
    for (let pipe of pipeSizes) {
        let bestCombo: CombinationResult | null = null;
        let leastWaste = Infinity;

        for (let item of combinations) {
            const total = item.sum;
            if (total <= pipe) {
                const waste = pipe - total;
                if (waste < leastWaste) {
                    leastWaste = waste;
                    bestCombo = item;
                }
            }
        }

        // Only add if we found a valid combination
        if (bestCombo) {
            results.push({ pipe, bestCombo, leastWaste });
        } else {
            results.push({ pipe, bestCombo: null, leastWaste: Infinity });
        }
    }
    return results;
}

const getCuttingEstimation = (result: OptimizationResult[], minWaste: number): CuttingEstimation[] => {
    return result.map((res) => {
        return {
            pipeLength: res.pipe,
            pipeCuts: res.cuts,
            wastage: res.waste,
            full: res.waste < minWaste,
            partial: res.waste >= minWaste
        }
    })
}

const calculateTotalInches = (data: CuttingEstimation[]): number => {
    return data.reduce((total, item) => {
        if (item.full) {
            return total + item.pipeLength;
        }
        return total + item.pipeCuts.reduce((a, b) => a + b, 0);
    }, 0);
}

const getPipeCountAndInches = (data: CuttingEstimation[]): {
    fullSmallPipeCount: number,
    fullLargePipeCount: number,
    partialSmallPipeInches: number,
    partialLargePipeInches: number,
    fullExtraPipeCount: number,
    partialExtraPipeInches: number
} => {
    let fullSmallPipeCount = 0;
    let fullLargePipeCount = 0;
    let partialSmallPipeInches = 0;
    let partialLargePipeInches = 0;
    let fullExtraPipeCount = 0;
    let partialExtraPipeInches = 0;

    data.forEach(item => {
        if (item.full) {
            if (item.pipeLength === 180) {
                fullSmallPipeCount += 1;
            } else if (item.pipeLength === 192) {
                fullLargePipeCount += 1;
            } else{
                fullExtraPipeCount += 1;
            }

        } else if (item.partial) {
            if (item.pipeLength === 180) {
                partialSmallPipeInches += item.pipeCuts.reduce((a, b) => a + b, 0);
            } else if (item.pipeLength === 192) {
                partialLargePipeInches += item.pipeCuts.reduce((a, b) => a + b, 0);
            } else {
                partialExtraPipeInches += item.pipeCuts.reduce((a, b) => a + b, 0);
            }
        }
    })

    return {
        fullSmallPipeCount,
        fullLargePipeCount,
        partialSmallPipeInches,
        partialLargePipeInches,
        fullExtraPipeCount,
        partialExtraPipeInches
    };
}
const getTotalWeight = (cuttingEstimation: CuttingEstimation[], trackType: TrackType, inputData: any): number => {
    let totalWeight = 0;
    cuttingEstimation.forEach(item => {
        const index = item.pipeLength === 180 ? 2 : 3;
        const weightPerInch = (inputData[pipeTypeRateAndWeightMapping[trackType][index]])/item.pipeLength; // Example weights
        if (item.full) {
            totalWeight += item.pipeLength * weightPerInch;
        } else if (item.partial) {
            const cutsWeight = item.pipeCuts.reduce((a, b) => a + b, 0) * weightPerInch;
            totalWeight += cutsWeight;
        }
    });
    return Math.round(totalWeight * 100) / 100;
}