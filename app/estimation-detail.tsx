import { useEffect, useState } from "react";
import { MaterialItemType } from "./window-estimation";

// Type definitions for the estimation data structure
interface CuttingEstimation {
    pipeLength: number;
    pipeCuts: number[];
    wastage: number;
    full: boolean;
    partial: boolean;
}

interface PipeEstimation {
    pipeType: string;
    pipeRate: number;
    unit: string;
    totalInches?: number;
    partialSmallPipeInches?: number;
    partialLargePipeInches?: number;
    fullSmallPipeCount?: number;
    fullLargePipeCount?: number;
    totalWeight?: number;
    totalAmount?: number;
    cuttingEstimation: CuttingEstimation[];
}

interface EstimationData {
    track: PipeEstimation;
    shutter: PipeEstimation;
    interlock?: PipeEstimation;
    vChannel?: PipeEstimation;
}

// Additional types for optimization functions
interface CombinationResult {
    combination: number[];
    sum: number;
}

interface BestCombinationOption {
    pipe: number;
    bestCombo: CombinationResult | null;
    leastWaste: number;
}

interface OptimizationResult {
    pipe: number;
    cuts: number[];
    waste: number;
}

interface MaterialEstimation {
    materialName: string;
    quantity: number;
    rate: number;
    totalPrice: number;
}

interface MaterialPriceProps {
    materialList: MaterialItemType[];
    allDomalTypes: string[];
    deepDomalType: string[];
    domalType: string[];
}

type TrackType = 'track' | 'shutter' | 'interlock' | 'vchannel';

export default function MaterialPrice({ materialList, allDomalTypes, deepDomalType, domalType }: MaterialPriceProps) {

    const pipeSizes: number[] = [180, 192];
    const vChannelPipeSizes: number[] = [180];
    const minWasteLimit = 36;
    const weightPerInch = 0.065; 

    const inputData: any = {
        "height": 48,
        "width": 72,
        "numberOfShutters": 3,
        "numberOfDoors": 2,
        "selectedWindowType": "Domal",
        "isContainMacharJali": true,
        "trackType": "type 1",
        "trackRate": 5,
        "shutterTrackType": "hutterTrack 2",
        "shutterTrackRate": 5,
        "interLockType": "InterLock C",
        "interLockRate": 5,
        "angleRate": 5,
        "lConnector": 5,
        "lPatti": 5,
        "bearing": 5,
        "screw13_6": 5,
        "lock": 5,
        "pvcBrush": 5,
        "glassRubber": 5,
        "glass": 5,
        "kekda": 5,
        "maleFemale": 5,
        "waterGuide": 5,
        "silicon": 5,
        "screw75_10": 5,
        "macharJali": 5,
        "labour": 5
    }



    ///////////////////////////////////////////////////////////

    function optimizePipesUtilisation(
        requiredCuts: number[],
        pipeSizes: number[],
        trackType: TrackType,
        minWaste = minWasteLimit
    ): PipeEstimation {
        const results: OptimizationResult[] = [];
        let remainingCuts = [...requiredCuts]; // Create a copy

        while (remainingCuts.length > 0) {
            console.log(`\n--- Iteration with remaining cuts: [${remainingCuts.join(', ')}] ---`);

            // Get all possible combinations from remaining cuts
            const combinations = getAllSumCombinations(remainingCuts);

            // Find best combinations for each pipe size
            const bestOptions = findBestCombinations(combinations, pipeSizes);
            console.log('Best options for each pipe:', bestOptions);

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
                console.log('No more valid combinations found. Stopping.');
                break;
            }

            console.log(`Selected: Pipe ${selectedOption.pipe}, Cuts [${selectedOption.cuts.join(', ')}], Waste: ${selectedOption.waste}`);

            // Add to results
            results.push(selectedOption);

            // Remove used cuts from remaining cuts
            for (let cut of selectedOption.cuts) {
                const index = remainingCuts.indexOf(cut);
                if (index !== -1) {
                    remainingCuts.splice(index, 1);
                }
            }

            console.log(`Remaining cuts after removal: [${remainingCuts.join(', ')}]`);
        }

        const cuttingEstimation = getCuttingEstimation(results, minWaste);
        const { fullSmallPipeCount, fullLargePipeCount, partialSmallPipeInches, partialLargePipeInches } = getPipeCountAndInches(cuttingEstimation);

        const trackMapping: Record<TrackType, [string, string]> = {
            'track': ["trackType", "trackRate"],
            'shutter': ["shutterTrackType", "shutterTrackRate"],
            'interlock': ["interLockType", "interLockRate"],
            'vchannel': ["vChannelType", "vChannelRate"]
        };

        const totalInches = calculateTotalInches(cuttingEstimation);
        const totalWeight = Math.ceil(totalInches * weightPerInch)
        const finalEstimation: PipeEstimation = {
            pipeType: inputData[trackMapping[trackType][0]],
            pipeRate: inputData[trackMapping[trackType][1]],
            unit: 'Inches',
            totalInches: totalInches,
            partialSmallPipeInches: partialSmallPipeInches,
            partialLargePipeInches: partialLargePipeInches,
            fullSmallPipeCount: fullSmallPipeCount,
            fullLargePipeCount: fullLargePipeCount,
            totalWeight: totalWeight,    //Later inches x weight per inch
            totalAmount: totalWeight * inputData[trackMapping[trackType][1]],    // Later total weight x rate
            cuttingEstimation: cuttingEstimation
        }

        return finalEstimation;
    }

    const getPipeCountAndInches = (data: CuttingEstimation[]): { fullSmallPipeCount: number, fullLargePipeCount: number, partialSmallPipeInches: number, partialLargePipeInches: number } => {
        let fullSmallPipeCount = 0;
        let fullLargePipeCount = 0;
        let partialSmallPipeInches = 0;
        let partialLargePipeInches = 0;

        data.forEach(item => {
            if (item.full) {
                if (item.pipeLength === 180) {
                    fullSmallPipeCount += 1;
                } else if (item.pipeLength === 192) {
                    fullLargePipeCount += 1;
                }

            } else if (item.partial) {
                if (item.pipeLength === 180) {
                    partialSmallPipeInches += item.pipeCuts.reduce((a, b) => a + b, 0);
                } else if (item.pipeLength === 192) {
                    partialLargePipeInches += item.pipeCuts.reduce((a, b) => a + b, 0);
                }
            }
        })

        return {
            fullSmallPipeCount,
            fullLargePipeCount,
            partialSmallPipeInches,
            partialLargePipeInches
        };
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


    ////////////////////////////////////////////////////////////





    const getTrackRequiredCuts = (height: number, width: number) => {
        return [height, width, height, width];
    }

    const getShutterTrackRequiredCuts = (height: number, width: number, noOfDoor: number, noOfShutter: number) => {
        const requireCuts: number[] = [];
        const iteration = noOfDoor === noOfShutter ? noOfDoor : noOfDoor > noOfShutter ? noOfDoor : noOfShutter;
        const partitionWidth = width / noOfDoor;
        for (let i = 0; i < iteration * 2; i++) {
            requireCuts.push(partitionWidth);
            requireCuts.push(height);
        }
        return requireCuts;
    }

    const getInterLockRequiredCuts = (height: number, width: number, noOfDoor: number) => {
        return [height, width, height, width];
    }

    const getVChannelRequiredCuts = (width: number) => {
        return [width];
    }









    const getTrackCuttingEstimation = (): PipeEstimation => {
        const trackRequireCuts = getTrackRequiredCuts(inputData.height, inputData.width);
        const trackPipeSizes: number[] = inputData.extraTrackLength ? [...pipeSizes, inputData.extraTrackLength] : [...pipeSizes];
        return optimizePipesUtilisation(trackRequireCuts, trackPipeSizes, 'track');

    }

    const getShutterTrackCuttingEstimation = (): PipeEstimation => {
        const shutterTrackRequireCuts = getShutterTrackRequiredCuts(inputData.height, inputData.width, inputData.numberOfDoors, inputData.numberOfShutters);
        const shutterTrackPipeSizes: number[] = inputData.shutterExtraTrackLength ? [...pipeSizes, inputData.shutterExtraTrackLength] : [...pipeSizes];
        return optimizePipesUtilisation(shutterTrackRequireCuts, shutterTrackPipeSizes, 'shutter');
    }

    const getInterLockCuttingEstimation = (): PipeEstimation => {
        const interLockRequireCuts = getInterLockRequiredCuts(inputData.height, inputData.width, inputData.numberOfDoors);
        const interLockPipeSizes: number[] = inputData.interLockExtraLength ? [...pipeSizes, inputData.interLockExtraLength] : [...pipeSizes];
        return optimizePipesUtilisation(interLockRequireCuts, interLockPipeSizes, 'interlock');
    }

    const getVChannelCuttingEstimation = (): PipeEstimation => {
        const vChannelRequireCuts = getVChannelRequiredCuts(inputData.width);
        const vPipeSizes: number[] = inputData.vChannelExtraLength ? [...vChannelPipeSizes, inputData.vChannelExtraLength] : [...vChannelPipeSizes];
        return optimizePipesUtilisation(vChannelRequireCuts, vPipeSizes, 'vchannel');
    }




    const getMaterialEstimation = (): MaterialEstimation[] => {

        const defaultMaterial = ["angleRate", "bearing", "screw13_6", "lock", "pvcBrush", "glassRubber", "labour", "silicon", "screw75_10", "glass"]
        const domalAndMiniDomalMaterial = ["lConnector", "lPatti"]
        const allDomalMaterial = ["kekda", "maleFemale", "waterGuide"]
        const materialEstimationList: MaterialEstimation[] = []
        materialList.map((material) => {
            if (defaultMaterial.includes(material.field)) {
                const materialQuantity = handleMaterialFunction(material.field)
                materialEstimationList.push({
                    materialName: material.label,
                    quantity: materialQuantity,
                    rate: material.rate,
                    totalPrice: material.rate * materialQuantity
                })
            }
            if (allDomalTypes.includes(inputData.selectedWindowType) && allDomalMaterial.includes(material.field)) {
                const materialQuantity = handleMaterialFunction(material.field)
                materialEstimationList.push({
                    materialName: material.label,
                    quantity: materialQuantity,
                    rate: material.rate,
                    totalPrice: material.rate * materialQuantity
                })
            }
            if (domalType.includes(inputData.selectedWindowType) && domalAndMiniDomalMaterial.includes(material.field)) {
                const materialQuantity = handleMaterialFunction(material.field)
                materialEstimationList.push({
                    materialName: material.label,
                    quantity: materialQuantity,
                    rate: material.rate,
                    totalPrice: material.rate * materialQuantity
                })
            }
            if (material.field === "macharJali" && inputData.isContainMacharJali) {
                const materialQuantity = handleMaterialFunction(material.field)
                materialEstimationList.push({
                    materialName: material.label,
                    quantity: materialQuantity,
                    rate: material.rate,
                    totalPrice: material.rate * materialQuantity
                })
            }
        })
        return materialEstimationList;
    }


    const handleMaterialFunction = (field: string): number => {
        const functionMapping: any = {
            "angleRate": getAnglequantity,
            "bearing": getBearingQuantity,
            "screw13_6": getScrew13_6Quantity,
            "lock": getLockQuantity,
            "pvcBrush": getPvcBrushQuantity,
            "glassRubber": getGlassRubberQuantity,
            "labour": getLabourQuantity,
            "silicon": getSiliconQuantity,
            "screw75_10": getScrew75_10Quantity,
            "glass": getGlassQuantity,
            "lConnector": getLConnectorQuantity,
            "lPatti": getLPattiQuantity,
            "kekda": getKekdaQuantity,
            "maleFemale": getMaleFemaleQuantity,
            "waterGuide": getWaterGuideQuantity,
            "macharJali": getMacharJaliQuantity,
        }
        return functionMapping[field] ? functionMapping[field]() : 0;
    }

    const getAnglequantity = (): number => {
        return 100;
    }
    const getBearingQuantity = (): number => {
        const iteration = inputData.numberOfDoors === inputData.numberOfShutters ? inputData.numberOfDoors : inputData.numberOfDoors > inputData.numberOfShutters ? inputData.numberOfDoors : inputData.numberOfShutters;
        return 2 * iteration;
    }
    const getLockQuantity = (): number => {
        const iteration = inputData.numberOfDoors === inputData.numberOfShutters ? inputData.numberOfDoors : inputData.numberOfDoors > inputData.numberOfShutters ? inputData.numberOfDoors : inputData.numberOfShutters;
        return inputData.isContainMacharJali ? iteration : iteration - 1;
    }
    const getScrew13_6Quantity = (): number => {
        return 16 + (getLockQuantity() * 2) + 6;
    }

    const getPvcBrushQuantity = (): number => {
        const partitionWidth = inputData.width / inputData.numberOfDoors;
        const iteration = inputData.numberOfDoors === inputData.numberOfShutters ? inputData.numberOfDoors : inputData.numberOfDoors > inputData.numberOfShutters ? inputData.numberOfDoors : inputData.numberOfShutters;
        if (["Normal", "18/60"].includes(inputData.selectedWindowType)) {
            return 3 * (2 * (inputData.height + inputData.width));
        }
        return iteration * ((3 * inputData.height) + (2 * partitionWidth));
    }
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
    }
    const getGlassQuantity = (): number => {
        const partitionWidth = inputData.width / inputData.numberOfDoors;
        let iteration = inputData.numberOfDoors === inputData.numberOfShutters ? inputData.numberOfDoors : inputData.numberOfDoors > inputData.numberOfShutters ? inputData.numberOfDoors : inputData.numberOfShutters;
        iteration = inputData.isContainMacharJali ? iteration - 1 : iteration;
        return getRoundFeet(inputData.height) * getRoundFeet(partitionWidth) * iteration;
    }
    const getGlassRubberQuantity = (): number => {
        let rubberLength = 0
        const iteration = inputData.numberOfDoors === inputData.numberOfShutters ? inputData.numberOfDoors : inputData.numberOfDoors > inputData.numberOfShutters ? inputData.numberOfDoors : inputData.numberOfShutters;
        const partitionWidth = inputData.width / inputData.numberOfDoors;
        for (let i = 0; i < (inputData.isContainMacharJali ? iteration - 1 : iteration); i++) {
            rubberLength += (2 * (partitionWidth + inputData.height));
        }
        return rubberLength;
    }
    const getLabourQuantity = (): number => {
        return getRoundFeet(inputData.height) * getRoundFeet(inputData.width);
    }
    const getSiliconQuantity = (): number => {
        return 0.5;
    }
    const getScrew75_10Quantity = (): number => {
        return 6;
    }

    const getLConnectorQuantity = (): number => {
        const iteration = inputData.numberOfDoors === inputData.numberOfShutters ? inputData.numberOfDoors : inputData.numberOfDoors > inputData.numberOfShutters ? inputData.numberOfDoors : inputData.numberOfShutters;
        return 4 * iteration;
    }
    const getLPattiQuantity = (): number => {
        return 2 * getLConnectorQuantity();
    }

    const getKekdaQuantity = (): number => {
        const iteration = inputData.numberOfDoors === inputData.numberOfShutters ? inputData.numberOfDoors : inputData.numberOfDoors > inputData.numberOfShutters ? inputData.numberOfDoors : inputData.numberOfShutters;
        return iteration;
    }
    const getMaleFemaleQuantity = (): number => {
        const iteration = inputData.numberOfDoors === inputData.numberOfShutters ? inputData.numberOfDoors : inputData.numberOfDoors > inputData.numberOfShutters ? inputData.numberOfDoors : inputData.numberOfShutters;
        return iteration;
    }
    const getWaterGuideQuantity = (): number => {
        return 2;
    }
    const getMacharJaliQuantity = (): number => {
        //need to understand
        return 0
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


    const [trackEstimationDetail, setTrackEstimationDetail] = useState<EstimationData | null>(null);
    const [materialEstimationDetail, setMaterialEstimationDetail] = useState<MaterialEstimation[] | null>(null);

    useEffect(() => {
        const materialEstimation = getMaterialEstimation();
        const trackEstimationDetail: EstimationData = {
            track: getTrackCuttingEstimation(),
            shutter: getShutterTrackCuttingEstimation(),
        }
        if (domalType.includes(inputData.selectedWindowType)) {
            trackEstimationDetail.interlock = getInterLockCuttingEstimation();
        }
        if (deepDomalType.includes(inputData.selectedWindowType)) {
            trackEstimationDetail.vChannel = getVChannelCuttingEstimation();
        }
        setTrackEstimationDetail(trackEstimationDetail);
        setMaterialEstimationDetail(materialEstimation);
        console.log(domalType, "domalType");
        console.log(inputData.selectedWindowType, "inputData.selectedWindowType");
        console.log(materialEstimation, "materialEstimation");
        console.log(trackEstimationDetail, "trackEstimationDetail");
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
                            <th scope="col" style={{ textAlign: 'center' }}>180 (Full)</th>
                            <th scope="col" style={{ textAlign: 'center' }}>180 partial (Inches)</th>
                            <th scope="col" style={{ textAlign: 'center' }}>192 (full)</th>
                            <th scope="col" style={{ textAlign: 'center' }}>192 partial (Inches)</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Total Inches</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Total weight</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Rate</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            trackEstimationDetail &&
                            (Object.entries(trackEstimationDetail) as [keyof EstimationData, PipeEstimation][]).map(([key, estimation]) =>
                                <tr key={`${key}`}>
                                    <th>{key}</th>
                                    <td>{estimation.fullSmallPipeCount}</td>
                                    <td>{estimation.partialSmallPipeInches}</td>
                                    <td>{estimation.fullLargePipeCount}</td>
                                    <td>{estimation.partialLargePipeInches}</td>
                                    <td>{estimation.totalInches}</td>
                                    <td>{estimation.totalWeight}</td>
                                    <td>{estimation.pipeRate}</td>
                                    <td>{estimation.totalAmount}</td>
                                </tr>
                            )
                        }
                        <tr>
                            <th colSpan={8} style={{ textAlign: 'center' }}>Total</th>
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
                                    <td>{material.rate}</td>
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
                <h4><strong>Total Amount: {trackEstimationDetail && materialEstimationDetail ? `${calculateTrackTotalAmount(trackEstimationDetail)} + ${calculateMaterialTotalAmount(materialEstimationDetail)} = ${trackEstimationDetail && materialEstimationDetail ? calculateTrackTotalAmount(trackEstimationDetail) + calculateMaterialTotalAmount(materialEstimationDetail) : 0}`: ''}</strong></h4>
            </div>
        </div>

    </>;
}