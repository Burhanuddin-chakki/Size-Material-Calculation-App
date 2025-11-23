import { useMemo } from "react";
import {
  EstimationData,
  MaterialEstimation,
  MaterialType,
} from "@/app/common/interfaces";
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
  getVChannelCuttingEstimation,
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
  // ✅ Memoized material estimation - recalculates only when deps change
  const materialEstimationDetail = useMemo((): MaterialEstimation[] => {
    const materialEstimationList: MaterialEstimation[] = [];
    materialList.forEach((material) => {
      let isMaterialEstimationNeeded = false;
      if (
        material.field !== "macharJali" &&
        material.field !== "grillJali" &&
        material.field !== "uChannel" &&
        material.field !== "screw25_6"
      ) {
        isMaterialEstimationNeeded = true;
      }
      if (material.field === "macharJali" && inputData.isContainMacharJali) {
        isMaterialEstimationNeeded = true;
      }
      if (material.field === "grillJali" && inputData.isContainGrillJali) {
        isMaterialEstimationNeeded = true;
      }
      if (
        material.field === "uChannel" &&
        inputData.isContainMacharJali &&
        !inputData.isContainGrillJali
      ) {
        isMaterialEstimationNeeded = true;
      }
      if (
        material.field === "screw25_6" &&
        (inputData.selectedSpOrDpPipe === "DP" ||
          inputData.selectedSpOrDpPipe === "SP")
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
    if (
      inputData.selectedSpOrDpPipe === "SP" ||
      inputData.selectedSpOrDpPipe === "DP"
    ) {
      estimation[inputData.selectedSpOrDpPipe as "SP" | "DP"] =
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
