import { useMemo } from "react";
import { EstimationData, MaterialEstimation, MaterialType, WindowInputDetails } from "@/types";
import {
  calculateTrackTotalAmount,
  getHandleTrackCuttingEstimation,
  getInterLockCuttingEstimation,
  getLongBearingCuttingEstimation,
  getShutterTrackCuttingEstimation,
  getSPDPTrackCuttingEstimation,
  getTrackBottomCuttingEstimation,
  getTrackCuttingEstimation,
  getTrackTopCuttingEstimation,
  getUChannelCuttingEstimation,
  getVChannelCuttingEstimation,
  isWindow3Track4Partition,
} from "../services/track.service";
import {
  calculateMaterialTotalAmount,
  handleMaterialFunction,
  roundToTwoDecimals,
} from "../services/material.service";
import CuttingEstimation from "../utility/cutting-estimation";
import FinalPipeBill from "../utility/final-pipe-bill";
import FinalMaterialBill from "../utility/final-material-bill";

interface MaterialPriceProps {
  materialList: MaterialType[];
  windowType: string;
  inputData: any;
}

export default function MaterialPrice({
  materialList,
  windowType,
  inputData,
}: MaterialPriceProps) {
  //Sp and DP selected for any of the window
  const isSpDpPipeSelected = inputData.windows.some((window: WindowInputDetails) => window.selectedSpOrDpPipe === "SP" || window.selectedSpOrDpPipe === "DP");

  // ✅ Memoized material estimation - recalculates only when deps change
  const materialEstimationDetail = useMemo((): MaterialEstimation[] => {
    const materialEstimationList: MaterialEstimation[] = [];
    materialList.forEach((material) => {
      let isMaterialEstimationNeeded = false;
      if (
        material.field !== "macharJali" &&
        material.field !== "grillJali" &&
        material.field !== "uChannel" &&
        material.field !== "screw25_6" &&
        material.field !== "centerMeeting"
      ) {
        isMaterialEstimationNeeded = true;
      }
      if (material.field === "macharJali" && inputData.windows.some((window: WindowInputDetails) => window.isContainMacharJali)) {
        isMaterialEstimationNeeded = true;
      }
      if (material.field === "grillJali" && inputData.windows.some((window: WindowInputDetails) => window.isContainGrillJali)) {
        isMaterialEstimationNeeded = true;
      }
      if (
        material.field === "uChannel" && inputData.windows.some((window: WindowInputDetails) => window.isContainMacharJali && !window.isContainGrillJali)
      ) {
        isMaterialEstimationNeeded = true;
      }
      if (
        material.field === "screw25_6" && isSpDpPipeSelected
      ) {
        isMaterialEstimationNeeded = true;
      }
      if (
        material.field === "centerMeeting" && inputData.windows.some((window: WindowInputDetails) => isWindow3Track4Partition(inputData.numberOfTrack, window.numberOfDoors))
      ) {
        isMaterialEstimationNeeded = true;
      }
      if (isMaterialEstimationNeeded) {
        const { quantity, rate, totalPrice, type } = handleMaterialFunction(
          material.field,
          inputData,
        );
        materialEstimationList.push({
          materialName: material.label,
          quantity: quantity,
          rate: rate,
          type: inputData[`${material.field}_type`] || type || "",
          unit: material.unit,
          totalPrice: roundToTwoDecimals(totalPrice),
        });
      }
    });
    return materialEstimationList;
  }, [materialList, inputData]);

  // ✅ Memoized pipe estimation - recalculates only when deps change
  const trackEstimationDetail = useMemo((): EstimationData => {
    const estimation: EstimationData = {
      Interlock: getInterLockCuttingEstimation(inputData),
    };
    if (/(Domal)/.test(windowType)) {
      estimation["Track"] = getTrackCuttingEstimation(inputData);
      estimation["Shutter"] = getShutterTrackCuttingEstimation(inputData);
      if (inputData.showUChannelPipeDetails) {
        estimation["U Channel"] = getUChannelCuttingEstimation(inputData);
      }
    }
    if (/(Deep)/.test(windowType)) {
      estimation["V Channel"] = getVChannelCuttingEstimation(inputData);
    }
    if (/(18\/60|Normal)/.test(windowType)) {
      estimation["Track Top"] = getTrackTopCuttingEstimation(inputData);
      estimation["Track Bottom"] = getTrackBottomCuttingEstimation(inputData);
      estimation["Handle"] = getHandleTrackCuttingEstimation(inputData);
      estimation["Long Bearing"] = getLongBearingCuttingEstimation(inputData);
    }
    if (isSpDpPipeSelected) {
      estimation[inputData.windows.find((window: WindowInputDetails) => window.selectedSpOrDpPipe === "SP" || window.selectedSpOrDpPipe === "DP")?.selectedSpOrDpPipe as "SP" | "DP"] =
        getSPDPTrackCuttingEstimation(inputData);
    }
    return estimation;
  }, [inputData, windowType]);

  const showExtraPipeColumn = useMemo((): boolean => {
    return Object.values(trackEstimationDetail).some(
      (estimation) =>
        estimation.extraPipeSize && estimation.extraPipeSize.length > 0,
    );
  }, [trackEstimationDetail]);

  const totalTrackAmount = calculateTrackTotalAmount(trackEstimationDetail);
  const totalMaterialAmount = calculateMaterialTotalAmount(
    materialEstimationDetail,
  );

  return (
    <>
      <div className="row main-container">
        <CuttingEstimation trackEstimationDetail={trackEstimationDetail} />
      </div>
      <br />
      <div className="row main-container">
        <div className="row">
          <h3>Final Bill</h3>
        </div>
        <FinalPipeBill
          trackEstimationDetail={trackEstimationDetail}
          showExtraPipeColumn={showExtraPipeColumn}
        />
        <br />
        {/* Final Material Bill Table */}
        <FinalMaterialBill
          materialEstimationDetail={materialEstimationDetail}
        />
      </div>
      <br />
      <div className="row main-container">
        <div className="row">
          <h3>Grand Total Bill</h3>
        </div>
        <div className="row mt-4">
          <h4>
            <strong>
              Total Amount:{" "}
              {trackEstimationDetail && materialEstimationDetail
                ? `${totalTrackAmount} + ${totalMaterialAmount} = 
                    ${
                      trackEstimationDetail && materialEstimationDetail
                        ? roundToTwoDecimals(
                            totalTrackAmount + totalMaterialAmount,
                          )
                        : 0
                    }`
                : ""}
            </strong>
          </h4>
        </div>
      </div>
    </>
  );
}
