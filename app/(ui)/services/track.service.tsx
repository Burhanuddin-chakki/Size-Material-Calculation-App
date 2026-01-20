import {
  BestCombinationOption,
  CombinationResult,
  CuttingEstimation,
  EstimationData,
  OptimizationResult,
  PipeEstimation,
  TrackType,
  WindowInputDetails,
} from "@/types";
import { getNoOfPannels, roundToTwoDecimals } from "./material.service";
import {
  minWasteLimit,
  pipeTypeRateAndWeightMapping,
} from "../constants/pipeTypeMapping";
import { is } from "zod/locales";

const getPipeSizes = (inputData: any, trackType: TrackType): number[] => {
  const pipeSizes: number[] = [];
  if (
    inputData[pipeTypeRateAndWeightMapping[trackType][4]] &&
    inputData[pipeTypeRateAndWeightMapping[trackType][5]]
  ) {
    // Placeholder for size 180 check
    pipeSizes.push(180);
    pipeSizes.push(192);
  } else if (inputData[pipeTypeRateAndWeightMapping[trackType][4]]) {
    pipeSizes.push(180);
  } else if (inputData[pipeTypeRateAndWeightMapping[trackType][5]]) {
    pipeSizes.push(192);
  }
  return pipeSizes;
};

export const getTrackCuttingEstimation = (inputData: any): PipeEstimation => {
  const trackRequireCuts = getTrackRequiredCuts(inputData);
  const trackPipeSizes: number[] = getPipeSizes(inputData, "track");

  return optimizePipesUtilisation(
    trackRequireCuts,
    trackPipeSizes,
    inputData.extraTrackPipeLength,
    inputData,
    "track",
  );
};

export const getTrackTopCuttingEstimation = (
  inputData: any,
): PipeEstimation => {
  const trackRequireCuts = getTrackTopRequiredCuts(inputData);
  const trackTopPipeSizes: number[] = getPipeSizes(inputData, "trackTop");
  return optimizePipesUtilisation(
    trackRequireCuts,
    trackTopPipeSizes,
    inputData.extraTrackTopPipeLength,
    inputData,
    "trackTop",
  );
};
export const getTrackBottomCuttingEstimation = (
  inputData: any,
): PipeEstimation => {
  const trackRequireCuts = getTrackBottomRequiredCuts(inputData);
  const trackBottomPipeSizes: number[] = getPipeSizes(inputData, "trackBottom");
  return optimizePipesUtilisation(
    trackRequireCuts,
    trackBottomPipeSizes,
    inputData.extraTrackBottomPipeLength,
    inputData,
    "trackBottom",
  );
};
export const getHandleTrackCuttingEstimation = (
  inputData: any,
): PipeEstimation => {
  const handleRequireCuts = getHandleTrackRequiredCuts(inputData);
  const handlePipeSizes: number[] = getPipeSizes(inputData, "handle");
  return optimizePipesUtilisation(
    handleRequireCuts,
    handlePipeSizes,
    inputData.extraHandlePipeLength,
    inputData,
    "handle",
  );
};

export const getLongBearingCuttingEstimation = (
  inputData: any,
): PipeEstimation => {
  const handleRequireCuts = getLongBearingRequiredCuts(inputData);
  const longBearingPipeSizes: number[] = getPipeSizes(inputData, "longBearing");
  return optimizePipesUtilisation(
    handleRequireCuts,
    longBearingPipeSizes,
    inputData.extraLongBearingPipeLength,
    inputData,
    "longBearing",
  );
};

export const getShutterTrackCuttingEstimation = (
  inputData: any,
): PipeEstimation => {
  const shutterTrackRequireCuts = getShutterTrackRequiredCuts(inputData);
  const shutterPipeSizes: number[] = getPipeSizes(inputData, "shutter");
  return optimizePipesUtilisation(
    shutterTrackRequireCuts,
    shutterPipeSizes,
    inputData.shutterExtraTrackLength,
    inputData,
    "shutter",
  );
};

export const getUChannelCuttingEstimation = (
  inputData: any,
): PipeEstimation => {
  const uChannelRequireCuts = uChannelRequiredCuts(inputData);
  const uChannelPipeSizes: number[] = getPipeSizes(inputData, "uchannel");
  return optimizePipesUtilisation(
    uChannelRequireCuts,
    uChannelPipeSizes,
    inputData.uChannelExtraLength,
    inputData,
    "uchannel",
  );
};

export const getInterLockCuttingEstimation = (
  inputData: any,
): PipeEstimation => {
  const interLockRequireCuts = getInterLockRequiredCuts(inputData);
  const interLockPipeSizes: number[] = getPipeSizes(inputData, "interlock");
  return optimizePipesUtilisation(
    interLockRequireCuts,
    interLockPipeSizes,
    inputData.interLockExtraLength,
    inputData,
    "interlock",
  );
};

export const getVChannelCuttingEstimation = (
  inputData: any,
): PipeEstimation => {
  const vChannelRequireCuts = getVChannelRequiredCuts(inputData);
  const vChannelPipeSizes: number[] = getPipeSizes(inputData, "vchannel");
  return optimizePipesUtilisation(
    vChannelRequireCuts,
    vChannelPipeSizes,
    inputData.vChannelExtraLength,
    inputData,
    "vchannel",
  );
};
export const getSPDPTrackCuttingEstimation = (
  inputData: any,
): PipeEstimation => {
  const spdpRequireCuts = getTrackRequiredCuts(inputData);
  const spdpPipeSizes: number[] = getPipeSizes(inputData, "spdp");
  return optimizePipesUtilisation(
    spdpRequireCuts,
    spdpPipeSizes,
    inputData.extraSpdpPipeLength,
    inputData,
    "spdp",
  );
};

const getTrackRequiredCuts = (inputData: any) => {
  const requiredCuts: number[] = []
  inputData.windows.forEach((window: WindowInputDetails) => {
    requiredCuts.push(...[window.height, window.width, window.height, window.width]);
  })
  return requiredCuts;
};
const getTrackTopRequiredCuts = (inputData: any) => {
  const requiredCuts: number[] = [];
  inputData.windows.forEach((window: WindowInputDetails) => {
    requiredCuts.push(window.height, window.width, window.height);
  });
  return requiredCuts;
};
const getTrackBottomRequiredCuts = (inputData: any) => {
  const requiredCuts: number[] = [];
  inputData.windows.forEach((window: WindowInputDetails) => {
    requiredCuts.push(window.width);
  });
  return requiredCuts;
};
const getHandleTrackRequiredCuts = (inputData: any) => {
  const requireCuts: number[] = [];
  inputData.windows.forEach((window: WindowInputDetails) => {
      const iteration = isWindow3Track4Partition(inputData.numberOfTrack, window.numberOfDoors) ? 6 : getNoOfPannels(inputData.numberOfTrack, window.numberOfDoors);
      for (let i = 0; i < iteration; i++) {
        requireCuts.push(window.height);
      }
      
  })
  return requireCuts;
};
const getLongBearingRequiredCuts = (inputData: any) => {
  const requireCuts: number[] = [];
  inputData.windows.forEach((window: WindowInputDetails) => {
    const iteration = isWindow3Track4Partition(inputData.numberOfTrack, window.numberOfDoors) ? 6 : getNoOfPannels(inputData.numberOfTrack, window.numberOfDoors);
    const partitionWidth = roundToTwoDecimals(window.width / window.numberOfDoors);
    for (let i = 0; i < iteration; i++) {
      requireCuts.push(...[partitionWidth, partitionWidth]);
    }
  });
  return requireCuts;
};

const getShutterTrackRequiredCuts = (inputData: any) => {
  const requireCuts: number[] = [];
  inputData.windows.forEach((window: WindowInputDetails) => {
    const iteration = isWindow3Track4Partition(inputData.numberOfTrack, window.numberOfDoors) ? 6 : getNoOfPannels(inputData.numberOfTrack, window.numberOfDoors);
    const partitionWidth = roundToTwoDecimals(window.width / window.numberOfDoors);
    for (let i = 0; i < iteration * 2; i++) {
      requireCuts.push(partitionWidth);
      requireCuts.push(window.height);
    }
  });
  return requireCuts;
};

const getInterLockRequiredCuts = (inputData: any) => {
  const requireCuts: number[] = [];
  inputData.windows.forEach((window: WindowInputDetails) => {
    const iteration = getNoOfInterlock(inputData.numberOfTrack, window.numberOfDoors);
    for (let i = 0; i < iteration; i++) {
      requireCuts.push(window.height);
    }
  });
  return requireCuts;
};

const getVChannelRequiredCuts = (inputData: any) => {
  const requireCuts: number[] = [];
  inputData.windows.forEach((window: WindowInputDetails) => {
    for (let i = 0; i < inputData.numberOfTrack; i++) {
      requireCuts.push(window.width);
    }
  });
  return requireCuts;
};

export const uChannelRequiredCuts = (inputData: any) => {
  const requireCuts: number[] = [];
  inputData.windows.forEach((window: WindowInputDetails) => {
    if(window.isContainMacharJali && !window.isContainGrillJali){
      const partitionWidth = roundToTwoDecimals(window.width / window.numberOfDoors);
      const cuts = isWindow3Track4Partition(inputData.numberOfTrack, window.numberOfDoors) ? [window.height, partitionWidth, window.height, partitionWidth, window.height, partitionWidth, window.height, partitionWidth] : [window.height, partitionWidth, window.height, partitionWidth]
      requireCuts.push(...cuts);
    }
  })
  return requireCuts;
};

export const centerMeetingRequiredCuts = (inputData: any) => {
  const requireCuts: number[] = [];
  inputData.windows.forEach((window: WindowInputDetails) => {
    if(isWindow3Track4Partition(inputData.numberOfTrack, window.numberOfDoors)){
      const cuts = [window.height, window.height];
      requireCuts.push(...cuts);
    }
  })
  return requireCuts;
}

function optimizePipesUtilisation(
  requiredCuts: number[],
  pipeSizes: number[],
  extraPipeSize: number[],
  inputData: any,
  trackType: TrackType,
  minWaste = minWasteLimit,
): PipeEstimation {
  const { results, usedExtraSizes } = getPipeWithOptimalCuts(
    requiredCuts,
    pipeSizes,
    extraPipeSize,
  );
  const cuttingEstimation = getCuttingEstimation(results, minWaste);
  const {
    fullSmallPipeCount,
    fullLargePipeCount,
    partialSmallPipeInches,
    partialLargePipeInches,
    fullExtraPipeCount,
    partialExtraPipeInches,
  } = getPipeCountAndInches(cuttingEstimation);

  const totalInches = calculateTotalInches(cuttingEstimation);
  const totalWeight = getTotalWeight(cuttingEstimation, trackType, inputData);
  const totalAmount =
    totalWeight * inputData[pipeTypeRateAndWeightMapping[trackType][1]];
  const finalEstimation: PipeEstimation = {
    pipeType:
      trackType !== "spdp"
        ? inputData[pipeTypeRateAndWeightMapping[trackType][0]]
        : `${inputData[pipeTypeRateAndWeightMapping[trackType][6]]} / ${inputData[pipeTypeRateAndWeightMapping[trackType][0]]}`,
    pipeRate: inputData[pipeTypeRateAndWeightMapping[trackType][1]],
    unit: "Inches",
    totalInches: totalInches,
    partialSmallPipeInches: partialSmallPipeInches,
    partialLargePipeInches: partialLargePipeInches,
    fullSmallPipeCount: fullSmallPipeCount,
    fullLargePipeCount: fullLargePipeCount,
    fullExtraPipeCount: fullExtraPipeCount,
    partialExtraPipeInches: partialExtraPipeInches,
    extraPipeSize: usedExtraSizes,
    totalWeight: totalWeight, //Later inches x weight per inch
    totalAmount: roundToTwoDecimals(totalAmount),
    cuttingEstimation: cuttingEstimation,
  };

  return finalEstimation;
}

export const getPipeWithOptimalCuts = (
  requiredCuts: number[],
  pipeSizes: number[],
  extraPipeSize: number[],
) => {
  const results: OptimizationResult[] = [];
  const remainingCuts = requiredCuts.slice();
  let remainingPipeSizes = extraPipeSize.slice();
  const usedExtraSizes: number[] = [];
  while (remainingCuts.length > 0) {
    const combinations = getAllSumCombinations(remainingCuts);
    const allPipeSizes = (remainingPipeSizes.length > 0 && remainingPipeSizes[0] > 0)
      ? pipeSizes.concat(remainingPipeSizes)
      : pipeSizes;
    const bestOptions = findBestCombinations(combinations, allPipeSizes);

    let selectedOption: OptimizationResult | null = null;
    let bestWaste = Infinity;
    for (let i = 0; i < bestOptions.length; i++) {
      const option = bestOptions[i];
      if (option.bestCombo && option.leastWaste < bestWaste) {
        bestWaste = option.leastWaste;
        selectedOption = {
          pipe: option.pipe,
          cuts: option.bestCombo.combination,
          waste: option.leastWaste,
        };
      }
    }
    if (!selectedOption) break;

    // Remove the used extra pipe size (if any) in-place for efficiency
    if (remainingPipeSizes.length > 0 && remainingPipeSizes.includes(selectedOption.pipe)) {
      const idx = remainingPipeSizes.indexOf(selectedOption.pipe);
      if (idx !== -1) {
        usedExtraSizes.push(selectedOption.pipe);
        remainingPipeSizes.splice(idx, 1);
      }
    }

    results.push(selectedOption);

    // Remove used cuts from remainingCuts in-place
    for (let i = 0; i < selectedOption.cuts.length; i++) {
      const cut = selectedOption.cuts[i];
      const idx = remainingCuts.indexOf(cut);
      if (idx !== -1) {
        remainingCuts.splice(idx, 1);
      }
    }
  }
  return { results, usedExtraSizes };
};

function getAllSumCombinations(numbers: number[]): CombinationResult[] {
  const result: CombinationResult[] = [];
  const seen = new Set();

  function backtrack(start: number, currentSum: number, currentCombo: number[]) {
    if (currentSum > 192) return;

    if (currentCombo.length > 0) {
      const key =
        currentCombo.length === 1
          ? String(currentCombo[0])
          : [...currentCombo].sort((a, b) => a - b).join(",");

      if (!seen.has(key)) {
        seen.add(key);
        result.push({
          combination: [...currentCombo], // preserve order
          sum: currentSum
        });
      }
    }

    for (let i = start; i < numbers.length; i++) {
      currentCombo.push(numbers[i]);
      backtrack(i + 1, currentSum + numbers[i], currentCombo);
      currentCombo.pop();
    }
  }

  backtrack(0, 0, []);
  return result;
}

function findBestCombinations(
  combinations: CombinationResult[],
  pipeSizes: number[],
): BestCombinationOption[] {
  const results: BestCombinationOption[] = [];
  for (const pipe of pipeSizes) {
    let bestCombo: CombinationResult | null = null;
    let leastWaste = Infinity;

    for (const item of combinations) {
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

export const getCuttingEstimation = (
  result: OptimizationResult[],
  minWaste: number,
): CuttingEstimation[] => {
  return result.map((res) => {
    return {
      pipeLength: res.pipe,
      pipeCuts: res.cuts,
      wastage: res.waste,
      full: res.waste < minWaste,
      partial: res.waste >= minWaste,
    };
  });
};

const calculateTotalInches = (data: CuttingEstimation[]): number => {
  return data.reduce((total, item) => {
    if (item.full) {
      return total + item.pipeLength;
    }
    return total + item.pipeCuts.reduce((a, b) => a + b, 0);
  }, 0);
};

const getPipeCountAndInches = (
  data: CuttingEstimation[],
): {
  fullSmallPipeCount: number;
  fullLargePipeCount: number;
  partialSmallPipeInches: number;
  partialLargePipeInches: number;
  fullExtraPipeCount: number;
  partialExtraPipeInches: number;
} => {
  let fullSmallPipeCount = 0;
  let fullLargePipeCount = 0;
  let partialSmallPipeInches = 0;
  let partialLargePipeInches = 0;
  let fullExtraPipeCount = 0;
  let partialExtraPipeInches = 0;

  data.forEach((item) => {
    if (item.full) {
      if (item.pipeLength === 180) {
        fullSmallPipeCount += 1;
      } else if (item.pipeLength === 192) {
        fullLargePipeCount += 1;
      } else {
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
  });

  return {
    fullSmallPipeCount,
    fullLargePipeCount,
    partialSmallPipeInches,
    partialLargePipeInches,
    fullExtraPipeCount,
    partialExtraPipeInches,
  };
};
const getTotalWeight = (
  cuttingEstimation: CuttingEstimation[],
  trackType: TrackType,
  inputData: any,
): number => {
  let totalWeight = 0;
  cuttingEstimation.forEach((item) => {
    const index = item.pipeLength === 180 ? 2 : 3;
    const weightPerInch =
      inputData[pipeTypeRateAndWeightMapping[trackType][index]] /
      item.pipeLength; // Example weights
    if (item.full) {
      totalWeight += item.pipeLength * weightPerInch;
    } else if (item.partial) {
      const cutsWeight =
        item.pipeCuts.reduce((a, b) => a + b, 0) * weightPerInch;
      totalWeight += cutsWeight;
    }
  });
  return roundToTwoDecimals(totalWeight);
};

export const calculateTrackTotalAmount = (
  trackEstimationDetail: EstimationData,
): number => {
  return roundToTwoDecimals(
    Object.entries(trackEstimationDetail).reduce((total, [, estimation]) => {
      return total + estimation.totalAmount;
    }, 0),
  );
};

export const isWindow3Track4Partition = (numberOfTrack: number, numberOfDoors: number): boolean => numberOfTrack === 3 && numberOfDoors === 4;

export const getNoOfInterlock = (numberOfTrack: number, numberOfDoors: number) : number => numberOfTrack === 3 && numberOfDoors === 3 ? 4 : numberOfDoors;