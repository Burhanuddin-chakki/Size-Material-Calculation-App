import { MaterialEstimation, MaterialEstimationResult, WindowInputDetails } from "@/types";
import {
  centerMeetingRequiredCuts,
  getCuttingEstimation,
  getNoOfInterlock,
  getPipeWithOptimalCuts,
  isWindow3Track4Partition,
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
    centerMeeting: getCenterMeetingQuantity,
  };
  return functionMapping[field]
    ? functionMapping[field](inputData)
    : { quantity: 0, rate: 0, totalPrice: 0 };
};

export const getNoOfPannels = (numberOfTrack: number, numberOfDoors: number): number =>
  numberOfDoors === numberOfTrack
    ? numberOfDoors
    : numberOfDoors > numberOfTrack
      ? numberOfDoors
      : numberOfTrack;

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

const getRoundFeettoQuarter = (inches: number): number => {
  const feet = inches / 12;
  if (feet === Math.floor(feet)) {
    return feet; // If it's a whole number, return as is
  }
  const wholePart = Math.floor(feet);
  const decimal = feet - wholePart;
  if (decimal <= 0.25) {
    return wholePart + 0.25; // Round to next 0.25
  } else if (decimal <= 0.5) {
    return wholePart + 0.5; // Round to next 0.5
  } else if (decimal <= 0.75) {
    return wholePart + 0.75; // Round to next 0.75
  } else {
    return wholePart + 1; // Round to next whole number
  }
};

const getAnglequantity = (inputData: any): MaterialEstimationResult => {
  let quantity = 0
  inputData.windows.forEach((window: WindowInputDetails) => {
    quantity += 100;
  })
  const totalPrice = quantity * inputData.angleRate / 1000;
  return { quantity, rate: 340, totalPrice };
};
const getBearingQuantity = (inputData: any): MaterialEstimationResult => {
  let quantity = 0;
  inputData.windows.forEach((window: WindowInputDetails) => {
    quantity += 2 * (isWindow3Track4Partition(inputData.numberOfTrack, window.numberOfDoors) ? 6 : getNoOfPannels(inputData.numberOfTrack, window.numberOfDoors));
  })
  const totalPrice = inputData.bearing_rate * quantity;
  return { quantity, rate: inputData.bearing_rate, totalPrice };
};
const getLockQuantity = (inputData: any): MaterialEstimationResult => {
  let quantity = 0;
  inputData.windows.forEach((window: WindowInputDetails) => {
    quantity += window.isContainMacharJali
      ? getNoOfPannels(inputData.numberOfTrack, window.numberOfDoors)
      : getNoOfPannels(inputData.numberOfTrack, window.numberOfDoors) - 1;
  })
  const totalPrice = inputData.lock_rate * quantity;
  return { quantity, rate: inputData.lock_rate, totalPrice };
};
const getScrew13_6Quantity = (inputData: any): MaterialEstimationResult => {
  const lockQuantity = getLockQuantity(inputData).quantity;
  let quantity = lockQuantity * 2;
  inputData.windows.forEach((window: WindowInputDetails) => {
    quantity += 16 + 6;
    if(window.selectedSpOrDpPipe === "DP" || window.selectedSpOrDpPipe === "SP"){
      quantity += 16;
    }
  })
  const totalPrice = Math.ceil((inputData.screw13_6 / 12) * quantity);
  return { quantity, rate: inputData.screw13_6, totalPrice };
};

const getPvcBrushQuantity = (inputData: any): MaterialEstimationResult => {
  const quantity = isWindow3Track4Partition(inputData.numberOfTrack, inputData.windows[0].numberOfDoors) ? inputData.windows.length * 2 : inputData.windows.length;
  return {
    quantity,
    rate: inputData.pvcBrush,
    totalPrice: quantity * inputData.pvcBrush,
  };
};
const getGlassQuantity = (inputData: any): MaterialEstimationResult => {
  let quantity = 0;
  inputData.windows.forEach((window: WindowInputDetails) => {
    const partitionWidth = roundToTwoDecimals(window.width / window.numberOfDoors);
    const noOfGlassDoor = isWindow3Track4Partition(inputData.numberOfTrack, window.numberOfDoors) ? 4 : window.isContainMacharJali ? getNoOfPannels(inputData.numberOfTrack, window.numberOfDoors) - 1
      : getNoOfPannels(inputData.numberOfTrack, window.numberOfDoors);
    quantity +=
      getRoundFeet(window.height - 5) *
      getRoundFeet(partitionWidth - 4) *
      noOfGlassDoor;
  });
  const totalPrice = quantity * inputData.glass;
  return { quantity, rate: inputData.glass, totalPrice };
};
const getGlassRubberQuantity = (inputData: any): MaterialEstimationResult => {
  let totalQuantity = 0;
  inputData.windows.forEach((window: WindowInputDetails) => {
    totalQuantity += getGlassRubberQuantityPerWindow(inputData.windows[0].numberOfDoors, inputData.windowGroup)
  })
  const totalPrice = (inputData.glassRubber / 1000) * totalQuantity;
  return { quantity: totalQuantity, rate: inputData.glassRubber, totalPrice };
};
const getLabourQuantity = (inputData: any): MaterialEstimationResult => {
  let quantity = 0;
  inputData.windows.forEach((window: WindowInputDetails) => {
    quantity += getRoundFeettoQuarter(window.height) * getRoundFeettoQuarter(window.width);
  });
  const totalPrice = quantity * inputData.labour;

  return { quantity, rate: inputData.labour, totalPrice };
};
const getSiliconQuantity = (inputData: any): MaterialEstimationResult => {
  return {
    quantity: 0.5 * inputData.windows.length,
    rate: inputData.silicon,
    totalPrice: 0.5 * inputData.windows.length * inputData.silicon,
  };
};
const getScrew75_10Quantity = (inputData: any): MaterialEstimationResult => {
  return {
    quantity: 6 * inputData.windows.length,
    rate: inputData.screw75_10,
    totalPrice: 6 * inputData.windows.length * inputData.screw75_10,
  };
};
const getScrew25_6Quantity = (inputData: any): MaterialEstimationResult => {
  let quantity = 0;
  inputData.windows.forEach((window: WindowInputDetails) => {
    if(window.selectedSpOrDpPipe === "DP" || window.selectedSpOrDpPipe === "SP"){
      quantity += 6;
    }
  })
  return {
    quantity,
    rate: inputData.screw25_6,
    totalPrice: quantity * inputData.screw25_6,
  };
};
const getScrew60_6Quantity = (inputData: any): MaterialEstimationResult => {
  let quantity = 0;
  inputData.windows.forEach((window: WindowInputDetails) => {
    quantity += getNoOfPannels(inputData.numberOfTrack, window.numberOfDoors) * 8;
  });
  const totalPrice = quantity * inputData.screw60_6;
  return { quantity, rate: inputData.screw60_6, totalPrice };
};
const getLConnectorQuantity = (inputData: any): MaterialEstimationResult => {
  let quantity = 0;
  inputData.windows.forEach((window: WindowInputDetails) => {
    quantity += 4 * (isWindow3Track4Partition(inputData.numberOfTrack, window.numberOfDoors) ? 6 : getNoOfPannels(inputData.numberOfTrack, window.numberOfDoors));
  });
  const  totalPrice = quantity * inputData.lConnector;
  return { quantity, rate: inputData.lConnector, totalPrice };
};
const getLPattiQuantity = (inputData: any): MaterialEstimationResult => {
  const quantity = 2 * getLConnectorQuantity(inputData).quantity;
  const totalPrice = quantity * inputData.lPatti;
  return { quantity, rate: inputData.lPatti, totalPrice };
};
const getKekdaQuantity = (inputData: any): MaterialEstimationResult => {
  const quantity = 4 * inputData.windows.length;
  const totalPrice = quantity * inputData.kekda;
  return { quantity, rate: inputData.kekda, totalPrice };
};
const getMaleFemaleQuantity = (inputData: any): MaterialEstimationResult => {
  let quantity = 0;
  inputData.windows.forEach((window: WindowInputDetails) => {
    quantity += (getNoOfInterlock(inputData.numberOfTrack, window.numberOfDoors) * 2);
  })
  const totalPrice = quantity * inputData.maleFemale;
  return { quantity, rate: inputData.maleFemale, totalPrice };
};
const getWaterGuideQuantity = (inputData: any): MaterialEstimationResult => {
  return {
    quantity: 2 * inputData.windows.length,
    rate: inputData.waterGuide,
    totalPrice: 2 * inputData.windows.length * inputData.waterGuide,
  };
};
const getMacharJaliQuantity = (inputData: any): MaterialEstimationResult => {
  const panelSizes = [2, 2.5, 3, 3.5, 3.75, 4, 4.5, 5];
  let totalSqft = 0;
  let totalPrice = 0;
  let type = ''
  inputData.windows.forEach((window: WindowInputDetails) => {
    if(!window.isContainMacharJali) return;
    const partitionWidth = roundToTwoDecimals(window.width / window.numberOfDoors);
    const { panelSize, basedOn, sqft } = calculateOptimalSqft(
      inputData.numberOfTrack,
      window.numberOfDoors,
      window.height,
      partitionWidth,
      panelSizes,
    );
    totalSqft += sqft;
    totalPrice += (sqft * inputData.macharJali);
    type += `${panelSize}ft, `
  });
  
  return {
    quantity: totalSqft,
    rate: inputData.macharJali,
    totalPrice: totalPrice,
    type: type,
  };
};
const getGrillJaliQuantity = (inputData: any): MaterialEstimationResult => {
  const panelSizes = [2, 2.5, 3, 3.5, 4];
  let totalSqft = 0;
  let totalPrice = 0;
  let type = ''
  inputData.windows.forEach((window: WindowInputDetails) => {
    if(!window.isContainGrillJali) return;
    const partitionWidth = roundToTwoDecimals(window.width / window.numberOfDoors);
    const { panelSize, basedOn, sqft } = calculateOptimalSqft(
      inputData.numberOfTrack,
      window.numberOfDoors,
      window.height,
      partitionWidth,
      panelSizes,
    );
    totalSqft += sqft;
    totalPrice += (sqft * inputData.grillJali);
    type += `${panelSize}ft, `
  });
  
  return {
    quantity: totalSqft,
    rate: inputData.grillJali,
    totalPrice: totalPrice,
    type
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
const getCenterMeetingQuantity = (inputData: any): MaterialEstimationResult => {
  const requiredCuts = centerMeetingRequiredCuts(inputData);
  const pipeSizes = [180];
  const { results } = getPipeWithOptimalCuts(requiredCuts, pipeSizes, []);
  const cuttingEstimation = getCuttingEstimation(results, Infinity);
  return {
    quantity: cuttingEstimation.length,
    rate: inputData.centerMeeting,
    totalPrice: cuttingEstimation.length * inputData.centerMeeting,
  };
}
const selectJaliPannel = (size: number, panelSizes: number[]): number => {
  let selectedSize: number = 0;
  for (let i = 0; i < panelSizes.length; i++) {
    if (size === panelSizes[i]) {
      selectedSize = panelSizes[i];
      break;
    } else if (panelSizes[i] > size) {
      return panelSizes[i];
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
  numberOfTrack: number,
  numberOfDoors: number,
  heightInches: number,
  widthInches: number,
  panelSizes: number[],
): { panelSize: number; basedOn: "height" | "width"; sqft: number } => {
  const heightFeet = heightInches / 12;
  const widthFeet = widthInches / 12;
  // Option 1: Select panel based on height
  const panelByHeight = selectJaliPannel(heightFeet, panelSizes);
  const sqftByHeight = isWindow3Track4Partition(numberOfTrack, numberOfDoors) ? panelByHeight * (widthFeet * 2) : panelByHeight * widthFeet;

  // Option 2: Select panel based on width
  const panelByWidth = selectJaliPannel(widthFeet, panelSizes);
  const sqftByWidth = isWindow3Track4Partition(numberOfTrack, numberOfDoors) ? panelByWidth * (heightFeet * 2) : panelByWidth * heightFeet;
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

const getGlassRubberQuantityPerWindow = (numberOfDoors: number, windowGroup: string): number => {
  if(["Domal", "Deep Domal", "Mini Domal"].includes(windowGroup)) {
    return numberOfDoors === 2 ? 1200 : numberOfDoors === 3 ? 1500 : 2500;
  } else {
    return numberOfDoors === 2 ? 800 : numberOfDoors === 3 ? 1000 : 1500;
  }
}