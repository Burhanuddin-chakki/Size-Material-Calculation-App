import { MaterialEstimation, MaterialEstimationResult } from "@/types";
import {
  getCuttingEstimation,
  getPipeWithOptimalCuts,
  uChannelRequiredCuts,
} from "./track.service";

export const handleMaterialFunction = (
  field: string,
  inputData: any,
): MaterialEstimationResult => {
  const functionMapping: {
    [key: string]: (inputData: any) => MaterialEstimationResult;
  } = {
    angleRate: getAnglequantity,
    bearing: getBearingQuantity,
    screw13_6: getScrew13_6Quantity,
    lock: getLockQuantity,
    pvcBrush: getPvcBrushQuantity,
    glassRubber: getGlassRubberQuantity,
    labour: getLabourQuantity,
    silicon: getSiliconQuantity,
    screw75_10: getScrew75_10Quantity,
    glass: getGlassQuantity,
    lConnector: getLConnectorQuantity,
    lPatti: getLPattiQuantity,
    kekda: getKekdaQuantity,
    maleFemale: getMaleFemaleQuantity,
    waterGuide: getWaterGuideQuantity,
    macharJali: getMacharJaliQuantity,
    grillJali: getGrillJaliQuantity,
    screw25_6: getScrew25_6Quantity,
    screw60_6: getScrew60_6Quantity,
    uChannel: getUChannelQuantity,
  };
  return functionMapping[field]
    ? functionMapping[field](inputData)
    : { quantity: 0, rate: 0, totalPrice: 0 };
};

export const getNoOfPannels = (inputData: any): number =>
  inputData.numberOfDoors === inputData.numberOfTrack
    ? inputData.numberOfDoors
    : inputData.numberOfDoors > inputData.numberOfTrack
      ? inputData.numberOfDoors
      : inputData.numberOfTrack;

const getRoundFeet = (inches: number): number => {
  const feet = inches / 12;
  if (feet === Math.floor(feet)) {
    return feet; // If it's a whole number, return as is
  }
  const wholePart = Math.floor(feet);
  const decimal = feet - wholePart;
  if (decimal <= 0.5) {
    return wholePart + 0.5; // Round to next 0.5
  } else {
    return wholePart + 1; // Round to next whole number
  }
};

const getAnglequantity = (inputData: any): MaterialEstimationResult => {
  const totalPrice = inputData.angleRate / 10;
  return { quantity: 100, rate: 340, totalPrice };
};
const getBearingQuantity = (inputData: any): MaterialEstimationResult => {
  const quantity = 2 * getNoOfPannels(inputData);
  const totalPrice = inputData.bearing_rate * quantity;
  return { quantity, rate: inputData.bearing_rate, totalPrice };
};
const getLockQuantity = (inputData: any): MaterialEstimationResult => {
  const quantity = inputData.isContainMacharJali
    ? getNoOfPannels(inputData)
    : getNoOfPannels(inputData) - 1;
  const totalPrice = inputData.lock_rate * quantity;
  return { quantity, rate: inputData.lock_rate, totalPrice };
};
const getScrew13_6Quantity = (inputData: any): MaterialEstimationResult => {
  let quantity = 16 + getLockQuantity(inputData).quantity * 2 + 6;
  if (
    inputData.selectedSpOrDpPipe === "DP" ||
    inputData.selectedSpOrDpPipe === "SP"
  ) {
    quantity += 16;
  }
  const totalPrice = Math.ceil((inputData.screw13_6 / 12) * quantity);
  return { quantity, rate: inputData.screw13_6, totalPrice };
};

const getPvcBrushQuantity = (inputData: any): MaterialEstimationResult => {
  return {
    quantity: 1,
    rate: inputData.pvcBrush,
    totalPrice: inputData.pvcBrush,
  };
};
const getGlassQuantity = (inputData: any): MaterialEstimationResult => {
  const partitionWidth = inputData.width / inputData.numberOfDoors;
  const noOfGlassDoor = inputData.isContainMacharJali
    ? getNoOfPannels(inputData) - 1
    : getNoOfPannels(inputData);
  const quantity =
    getRoundFeet(inputData.height) *
    getRoundFeet(partitionWidth) *
    noOfGlassDoor;
  const totalPrice = quantity * inputData.glass;
  return { quantity, rate: inputData.glass, totalPrice };
};
const getGlassRubberQuantity = (inputData: any): MaterialEstimationResult => {
  const quantity = 800;
  const totalPrice = (inputData.glassRubber / 1000) * quantity;
  return { quantity, rate: inputData.glassRubber, totalPrice };
};
const getLabourQuantity = (inputData: any): MaterialEstimationResult => {
  const quantity =
    getRoundFeet(inputData.height) * getRoundFeet(inputData.width);
  const totalPrice = quantity * inputData.labour;
  return { quantity, rate: inputData.labour, totalPrice };
};
const getSiliconQuantity = (inputData: any): MaterialEstimationResult => {
  return {
    quantity: 0.5,
    rate: inputData.silicon,
    totalPrice: 0.5 * inputData.silicon,
  };
};
const getScrew75_10Quantity = (inputData: any): MaterialEstimationResult => {
  return {
    quantity: 6,
    rate: inputData.screw75_10,
    totalPrice: 6 * inputData.screw75_10,
  };
};
const getScrew25_6Quantity = (inputData: any): MaterialEstimationResult => {
  return {
    quantity: 6,
    rate: inputData.screw25_6,
    totalPrice: 6 * inputData.screw25_6,
  };
};
const getScrew60_6Quantity = (inputData: any): MaterialEstimationResult => {
  const quantity = getNoOfPannels(inputData) * 8;
  const totalPrice = quantity * inputData.screw60_6;
  return { quantity, rate: inputData.screw60_6, totalPrice };
};
const getLConnectorQuantity = (inputData: any): MaterialEstimationResult => {
  const quantity = 4 * getNoOfPannels(inputData);
  const totalPrice = quantity * inputData.lConnector;
  return { quantity, rate: inputData.lConnector, totalPrice };
};
const getLPattiQuantity = (inputData: any): MaterialEstimationResult => {
  const quantity = 2 * getLConnectorQuantity(inputData).quantity;
  const totalPrice = quantity * inputData.lPatti;
  return { quantity, rate: inputData.lPatti, totalPrice };
};
const getKekdaQuantity = (inputData: any): MaterialEstimationResult => {
  const quantity = getNoOfPannels(inputData);
  const totalPrice = quantity * inputData.kekda;
  return { quantity, rate: inputData.kekda, totalPrice };
};
const getMaleFemaleQuantity = (inputData: any): MaterialEstimationResult => {
  return {
    quantity: getNoOfPannels(inputData),
    rate: inputData.maleFemale,
    totalPrice: getNoOfPannels(inputData) * inputData.maleFemale,
  };
};
const getWaterGuideQuantity = (inputData: any): MaterialEstimationResult => {
  return {
    quantity: 2,
    rate: inputData.waterGuide,
    totalPrice: 2 * inputData.waterGuide,
  };
};
const getMacharJaliQuantity = (inputData: any): MaterialEstimationResult => {
  const partitionWidth = inputData.width / inputData.numberOfDoors;
  const panelSizes = [2, 2.5, 3, 3.5, 3.75, 4, 4.5, 5];
  const { panelSize, basedOn, sqft } = calculateOptimalSqft(
    inputData.height,
    partitionWidth,
    panelSizes,
  );
  const totalPrice = sqft * inputData.macharJali;
  return {
    quantity: sqft,
    rate: inputData.macharJali,
    totalPrice: totalPrice,
    type: `${panelSize}ft based on ${basedOn}`,
  };
};
const getGrillJaliQuantity = (inputData: any): MaterialEstimationResult => {
  const partitionWidth = inputData.width / inputData.numberOfDoors;
  const panelSizes = [2, 2.5, 3, 3.5, 4];
  const { panelSize, basedOn, sqft } = calculateOptimalSqft(
    inputData.height,
    partitionWidth,
    panelSizes,
  );
  const totalPrice = sqft * inputData.grillJali;
  return {
    quantity: sqft,
    rate: inputData.grillJali,
    totalPrice: totalPrice,
    type: `${panelSize}ft based on ${basedOn}`,
  };
};

const getUChannelQuantity = (inputData: any): MaterialEstimationResult => {
  const requiredCuts = uChannelRequiredCuts(inputData);
  const pipeSizes = [extractNumberFromString(inputData.uChannel_type) * 12];
  const { results } = getPipeWithOptimalCuts(requiredCuts, pipeSizes, []);
  const cuttingEstimation = getCuttingEstimation(results, Infinity);
  return {
    quantity: cuttingEstimation.length,
    rate: inputData.uChannel_rate,
    totalPrice: cuttingEstimation.length * inputData.uChannel_rate,
  };
};
const selectJaliPannel = (size: number, panelSizes: number[]): number => {
  let selectedSize: number = 0;
  for (let i = 0; i < panelSizes.length; i++) {
    if (size === panelSizes[i]) {
      selectedSize = panelSizes[i];
      break;
    } else if (panelSizes[i + 1] > size) {
      selectedSize = panelSizes[i + 1];
      break;
    }
  }
  return selectedSize;
};

/**
 * Calculates the optimal square footage by comparing panel selection based on width vs height
 * Returns the configuration that results in minimum square footage (most profitable)
 * @param heightInches - Height in inches
 * @param widthInches - Width in inches
 * @param panelSizes - Available panel sizes in feet
 * @returns Object with selected panel size, dimension used, and total square footage
 */
export const calculateOptimalSqft = (
  heightInches: number,
  widthInches: number,
  panelSizes: number[],
): { panelSize: number; basedOn: "height" | "width"; sqft: number } => {
  const heightFeet = heightInches / 12;
  const widthFeet = widthInches / 12;

  // Option 1: Select panel based on height
  const panelByHeight = selectJaliPannel(heightFeet, panelSizes);
  const sqftByHeight = panelByHeight * widthFeet;

  // Option 2: Select panel based on width
  const panelByWidth = selectJaliPannel(widthFeet, panelSizes);
  const sqftByWidth = panelByWidth * heightFeet;

  // Return the option with minimum square footage (most profitable)
  if (sqftByHeight && sqftByHeight <= sqftByWidth) {
    return {
      panelSize: panelByHeight,
      basedOn: "height",
      sqft: roundToTwoDecimals(sqftByHeight),
    };
  } else {
    return {
      panelSize: panelByWidth,
      basedOn: "width",
      sqft: roundToTwoDecimals(sqftByWidth),
    };
  }
};

export const calculateMaterialTotalAmount = (
  materialEstimationDetail: MaterialEstimation[],
): number => {
  return roundToTwoDecimals(
    materialEstimationDetail.reduce((total, item) => {
      return total + item.totalPrice;
    }, 0),
  );
};

export const roundToTwoDecimals = (number: number) =>
  Math.round(number * 100) / 100;

export const extractNumberFromString = (str: string): number => {
  const match = str.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
};
