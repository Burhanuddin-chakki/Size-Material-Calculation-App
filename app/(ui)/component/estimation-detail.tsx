import { useEffect, useState } from "react";
import {
    EstimationData,
    MaterialType,
    PipeEstimation
} from "@/app/common/interfaces";
import {
    getHandleTrackCuttingEstimation,
    getInterLockCuttingEstimation,
    getLongBearingCuttingEstimation,
    getShutterTrackCuttingEstimation,
    getSPDPTrackCuttingEstimation,
    getTrackBottomCuttingEstimation,
    getTrackCuttingEstimation,
    getTrackTopCuttingEstimation,
    getVChannelCuttingEstimation
} from "../services/track.service";
import { handleMaterialFunction } from "../services/material.service";

interface MaterialEstimation {
    materialName: string;
    quantity: number;
    rate: number;
    unit: string;
    totalPrice: number;
}

type windowType = '2 Track Domal' | 'Mini Domal' | 'Normal' | '18/60';

interface MaterialPriceProps {
    materialList: MaterialType[];
    windowType: string;
    inputData: any;
}


export default function MaterialPrice({ materialList, windowType, inputData }: MaterialPriceProps) {
    const [trackEstimationDetail, setTrackEstimationDetail] = useState<EstimationData | null>(null);
    const [materialEstimationDetail, setMaterialEstimationDetail] = useState<MaterialEstimation[] | null>(null);
    const allDomalTypes: string[] = ['3 Track Domal', '2 Track Domal', 'Mini Domal'];
    const deepDomalType: string[] = ['Deep 3 Track Domal', 'Deep 2 Track Domal'];
    const domalType: string[] = ['Domal', 'Deep Domal'];

    const pipeSizes: number[] = [180, 192];
    const vChannelPipeSizes: number[] = [180];
    const weightPerInch = 0.065;

    // const inputData: any = {
    //     "height": 48,
    //     "width": 72,
    //     "numberOfDoors": 2,
    //     "isContainMacharJali": true,
    //     "isContainGrillJali": true,
    //     "selectedSpOrDpPipe": "SP",
    //     "interLockType": "Brown",
    //     "interLockRate": 360,
    //     "smallInterLockWeight": 1.75,
    //     "bigInterLockWeight": 1.85,
    //     "interLockPipeSize180": true,
    //     "interLockPipeSize192": true,
    //     "interLockExtraLength": 0,
    //     "trackTopPipeType": "Brown",
    //     "trackTopPipeRate": 360,
    //     "smallTrackTopPipeWeight": 1,
    //     "bigTrackTopPipeWeight": 1,
    //     "trackTopPipeSize180": true,
    //     "trackTopPipeSize192": true,
    //     "extraTrackTopPipeLength": 72,
    //     "trackBottomPipeType": "Brown",
    //     "trackBottomPipeRate": 360,
    //     "smallTrackBottomPipeWeight": 1,
    //     "bigTrackBottomPipeWeight": 1,
    //     "trackBottomPipeSize180": true,
    //     "trackBottomPipeSize192": true,
    //     "extraTrackBottomPipeLength": 72,
    //     "handlePipeType": "Brown",
    //     "handlePipeRate": 360,
    //     "smallHandlePipeWeight": 1.4,
    //     "bigHandlePipeWeight": 1.5,
    //     "handlePipeSize180": true,
    //     "handlePipeSize192": true,
    //     "extraTrackHandlePipeLength": 96,
    //     "longBearingPipeType": "Brown",
    //     "longBearingPipeRate": 360,
    //     "smallLongBearingPipeWeight": 1.9,
    //     "bigLongBearingPipeWeight": 2,
    //     "longBearingPipeSize180": true,
    //     "longBearingPipeSize192": true,
    //     "angleRate": 340,
    //     "bearing_type": "Ohm",
    //     "bearing_rate": 7.5,
    //     "screw13_6": 9,
    //     "lock_type": "Eagle Boss",
    //     "lock_rate": 17.5,
    //     "pvcBrush": 60,
    //     "glassRubber": 115,
    //     "glass": 48,
    //     "silicon": 150,
    //     "screw75_10": 4,
    //     "macharJali": 15,
    //     "labour": 30,
    //     "grillJali": 35,
    //     "screw60_6": 1,
    //     "screw25_6": 1,
    //     "spdpPipeType": "Brown",
    //     "spdpPipeRate": 360,
    //     "smallSpdpPipeWeight": 2.5,
    //     "bigSpdpPipeWeight": 2.7,
    //     "spdpType": "SP Pipe 2.5/1.5",
    //     "spdpPipeSize180": true,
    //     "spdpPipeSize192": true,
    //     "extraSpdpPipeLength": 100,
    //     "numberOfTrack": 3
    // }





    const getMaterialEstimation = (): MaterialEstimation[] => {
        const materialEstimationList: MaterialEstimation[] = []
        materialList.map((material) => {
            let isMaterialEstimationNeeded = false
            if (material.field !== "macharJali" && material.field !== "grillJali" && material.field !== "uChannel" && material.field !== "screw25_6") {
                isMaterialEstimationNeeded = true
            }
            // if (material.field === "macharJali" && inputData.isContainMacharJali) {
            //     isMaterialEstimationNeeded = true
            // }
            // if (material.field === "grillJali" && inputData.isContainGrillJali) {
            //     isMaterialEstimationNeeded = true
            // }
            if (material.field === "uChannel" && inputData.isContainMacharJali && !inputData.isContainGrillJali) {
                isMaterialEstimationNeeded = true
            }
            if (material.field === "screw25_6" && (inputData.selectedSpOrDpPipe === "DP" || inputData.selectedSpOrDpPipe === "SP")) {
                isMaterialEstimationNeeded = true
            }
            if (isMaterialEstimationNeeded) {
                const { quantity, rate, totalPrice } = handleMaterialFunction(material.field, inputData);
                materialEstimationList.push({
                    materialName: material.label,
                    quantity: quantity,
                    rate: rate,
                    unit: material.unit,
                    totalPrice: Math.round(totalPrice * 100)/100
                })
            }
        })
        return materialEstimationList;
    }




    const calculateTrackTotalAmount = (trackEstimationDetail: EstimationData): number => {
        return Object.entries(trackEstimationDetail).reduce((total, [key, estimation]) => {
            return total + estimation.totalAmount;
        }, 0);
    }

    const calculateMaterialTotalAmount = (materialEstimationDetail: MaterialEstimation[]): number => {
        return materialEstimationDetail.reduce((total, item) => {
            return total + item.totalPrice;
        }, 0);
    }

    const getPipeEstimation = (): EstimationData => {
        const trackEstimationDetail: EstimationData = {
            'Interlock': getInterLockCuttingEstimation(inputData)
        }
        if (/(Domal)/.test(windowType)) {
            trackEstimationDetail['Track'] = getTrackCuttingEstimation(inputData);
            trackEstimationDetail['Shutter'] = getShutterTrackCuttingEstimation(inputData);
        }
        if (/(Deep)/.test(windowType)) {
            trackEstimationDetail['V Channel'] = getVChannelCuttingEstimation(inputData);
        }
        if (/(18\/60|Normal)/.test(windowType)) {
            trackEstimationDetail['Track Top'] = getTrackTopCuttingEstimation(inputData);
            trackEstimationDetail['Track Bottom'] = getTrackBottomCuttingEstimation(inputData);
            trackEstimationDetail['Handle'] = getHandleTrackCuttingEstimation(inputData);
            trackEstimationDetail['Long Bearing'] = getLongBearingCuttingEstimation(inputData);
        }
        if (inputData.selectedSpOrDpPipe === "SP" || inputData.selectedSpOrDpPipe === "DP") {
            trackEstimationDetail[inputData.selectedSpOrDpPipe as "SP" | "DP"] = getSPDPTrackCuttingEstimation(inputData);
        }
        return trackEstimationDetail;
    }

    useEffect(() => {
        const materialEstimation = getMaterialEstimation();
        const trackEstimationDetail: EstimationData = getPipeEstimation();
        setTrackEstimationDetail(trackEstimationDetail);
        setMaterialEstimationDetail(materialEstimation);
    }, []);

    const mergeCell = {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    return <>
        <div className="row main-container">
            <div className="row">
                <h3>Cutting Estimation</h3>
            </div>
            {/* Cutting Estimation Table */}
            <div className="row mt-4">
                {trackEstimationDetail && <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col" style={{ textAlign: 'center' }}>Track Type</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Pipe Type</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Size (Inches)</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Cuts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            trackEstimationDetail &&
                            (Object.entries(trackEstimationDetail) as [keyof EstimationData, PipeEstimation][]).map(([key, estimation]) =>
                                estimation.cuttingEstimation.map((item, idx) => (
                                    <tr key={`${key}-${idx}`}>
                                        {idx === 0 && (
                                            <>
                                                <th scope="row" rowSpan={estimation.cuttingEstimation.length} style={{ height: '100px', padding: 0 }}><div style={mergeCell}>{key}</div></th>
                                                <td rowSpan={estimation.cuttingEstimation.length} style={{ height: '100px', padding: 0 }}><div style={mergeCell}>{estimation.pipeType}</div></td>
                                            </>
                                        )}
                                        <td>{`${item.pipeLength} Inches ->`}</td>
                                        <td>{item.pipeCuts.join(', ')}</td>
                                    </tr>
                                ))
                            )
                        }
                    </tbody>
                </table>}
            </div>

        </div>
        <br />
        <div className="row main-container">
            <div className="row">
                <h3>Final Bill</h3>
            </div>
            <div className="row mt-4">
                <h4>Final Track Pipe Bill</h4>
            </div>
            {/* Final Track Pipe Bill Table */}
            <div >
                {trackEstimationDetail && <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col" style={{ textAlign: 'center' }}>Material</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Pipe Type</th>
                            <th scope="col" style={{ textAlign: 'center' }}>180 (Full)</th>
                            <th scope="col" style={{ textAlign: 'center' }}>180 partial (Inches)</th>
                            <th scope="col" style={{ textAlign: 'center' }}>192 (full)</th>
                            <th scope="col" style={{ textAlign: 'center' }}>192 partial(Inches)</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Extra Pipe Size(Inches)</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Extra Pipe(full)</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Extra Pipe Partial(Inches)</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Total Inches</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Total weight (kg)</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Rate/Kg</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            trackEstimationDetail &&
                            (Object.entries(trackEstimationDetail) as [keyof EstimationData, PipeEstimation][]).map(([key, estimation]) =>
                                <tr key={`${key}`}>
                                    <th>{key}</th>
                                    <td>{estimation.pipeType}</td>
                                    <td>{estimation.fullSmallPipeCount}</td>
                                    <td>{estimation.partialSmallPipeInches}</td>
                                    <td>{estimation.fullLargePipeCount}</td>
                                    <td>{estimation.partialLargePipeInches}</td>
                                    <td>{estimation.extraPipeSize || 0}</td>
                                    <td>{estimation.fullExtraPipeCount}</td>
                                    <td>{estimation.partialExtraPipeInches}</td>
                                    <td>{estimation.totalInches}</td>
                                    <td>{estimation.totalWeight}</td>
                                    <td>{estimation.pipeRate}</td>
                                    <td>{estimation.totalAmount}</td>
                                </tr>
                            )
                        }
                        <tr>
                            <th colSpan={12} style={{ textAlign: 'center' }}>Total</th>
                            <th>{calculateTrackTotalAmount(trackEstimationDetail)}</th>
                        </tr>
                    </tbody>
                </table>}
            </div>
            <br />
            {/* Final Material Bill Table */}
            <div className="row mt-4">
                <h4>Final Material Bill</h4>
            </div>
            <div className="row">
                {materialEstimationDetail && <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col" style={{ textAlign: 'center', width: '4%' }}>#</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Material</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Quantity</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Rate</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            materialEstimationDetail &&
                            materialEstimationDetail.map((material, index) =>
                                // estimation.cuttingEstimation.map((item, idx) => (
                                <tr key={`${index}`}>
                                    <th style={{ textAlign: 'center', width: '4%' }}>{index}</th>
                                    <th>{material.materialName}</th>
                                    <td>{material.quantity}</td>
                                    <td>{material.rate} /{material.unit}</td>
                                    <td>{material.totalPrice}</td>
                                </tr>
                            )
                        }
                        <tr>
                            <th colSpan={4} style={{ textAlign: 'center' }}>Total</th>
                            <th>{calculateMaterialTotalAmount(materialEstimationDetail)}</th>
                        </tr>
                    </tbody>
                </table>}
            </div>
        </div>
        <br />
        <div className="row main-container">
            <div className="row">
                <h3>Grand Total Bill</h3>
            </div>
            <div className="row mt-4">
                <h4><strong>Total Amount: {trackEstimationDetail && materialEstimationDetail ? `${calculateTrackTotalAmount(trackEstimationDetail)} + ${calculateMaterialTotalAmount(materialEstimationDetail)} = ${trackEstimationDetail && materialEstimationDetail ? calculateTrackTotalAmount(trackEstimationDetail) + calculateMaterialTotalAmount(materialEstimationDetail) : 0}` : ''}</strong></h4>
            </div>
        </div>

    </>;
}