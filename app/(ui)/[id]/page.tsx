'use client';

import { fetchMaterialList, fetchPipeType, fetchWindowfromWindowId } from "@/app/api/window";
import { MaterialType, PipeType } from "@/app/common/interfaces";
import TrackDetail, { trackPipeSchema } from "@/app/track-detail";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import WindowDetail, { windowInputSchema } from "../component/window-detail";

export default function WindowTypePage() {

    // variables
    const [showAdditionalSections, setShowAdditionalSections] = useState(true);
    const [numberOfTrack, setNumberOfTrack] = useState<number>(2);
    const [materialList, setMaterialList] = useState<MaterialType[]>([]);
    const [windowType, setWindowType] = useState<string>("");
    const [pipeType, setPipeType] = useState<PipeType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const windowId = params['id'];

    // Create dynamic schema based on windowType using useMemo
    const parentSchema = useMemo(() => {
        let schema = z.object({});
        if (windowType === "3 Track Domal") {
            schema = schema.extend({
                ...windowInputSchema.shape,
                ...trackPipeSchema.shape,
            });
        }
        
        return schema;
    }, [windowType]);

    type FormData = z.infer<typeof parentSchema>;

    // Create default values based on schema - always provide default values to prevent controlled/uncontrolled switching
    // const getDefaultValues = useMemo(() => {
    //     console.log("Calculating default values for isLoading:", isLoading);
    //     let defaults: any = {};
    //     if(windowType === "3 Track Domal") {
    //         defaults = {
    //             // Always provide base defaults to prevent undefined values
    //             height: 0,
    //             width: 0,
    //             numberOfDoors: 2,
    //             isContainMacharJali: false,
    //             trackPipeType: "",
    //             trackPipeRate: 0,
    //             extraTrackPipeLength: 0
    //         };
    //         if(pipeType.length > 0) {
    //             defaults.trackPipeType = pipeType[0]?.color || "";
    //             defaults.trackPipeRate = pipeType[0]?.ratePerKg || 0;
    //         }
    //     }
    //     console.log("Default values set to: ", defaults);

    //     return defaults;
    // }, [isLoading]);

    const getDefaultValues = () => {
        console.log("Calculating default values for isLoading:", isLoading);
        let defaults: any = {};
        if(windowType === "3 Track Domal") {
            defaults = {
                // Always provide base defaults to prevent undefined values
                height: 0,
                width: 0,
                numberOfDoors: 2,
                isContainMacharJali: false,
                trackPipeType: "",
                trackPipeRate: 0,
                extraTrackPipeLength: 0
            };
            if(pipeType.length > 0) {
                defaults.trackPipeType = pipeType[0]?.color || "";
                defaults.trackPipeRate = pipeType[0]?.ratePerKg || 0;
            }
        }
        console.log("Default values set to: ", defaults);

        return defaults;
    }

    // Initialize form methods - will be updated when data loads
    const methods = useForm<FormData>({
        resolver: zodResolver(parentSchema),
        defaultValues: {},
        // mode: 'onChange'
    });

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = methods;



    // Functions Definition
    const onSubmit = async (data: FormData) => {
        console.log("Form Data Submitted: ", data);
    };

    async function getWindowDetail() {
        const windowDetail = await fetchWindowfromWindowId(Number(windowId));
        setNumberOfTrack(windowDetail.windowTrack);
        setWindowType(windowDetail.windowType);
        console.log("Fetched window detail:", windowType);
    }

    async function getMaterialList() {
        const materialList = await fetchMaterialList();
        setMaterialList(materialList);
    }

    async function getPipeType() {
        const pipeType = await fetchPipeType();
        setPipeType(pipeType);
    }

    async function runAllSideEffects() {
        setIsLoading(true);
        try {
            await Promise.all([getWindowDetail(), getMaterialList(), getPipeType()]);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
        console.log("Loaded windowType:", windowType);
    }

    //React Hooks
    useEffect(() => {
        runAllSideEffects();
    }, []);

    // Reset form methods after getting data from database
    useEffect(() => {
        if (!isLoading && windowType && pipeType.length > 0) {
            // Reset form with proper schema and default values after data is loaded
            const newDefaults = getDefaultValues();
            
            methods.reset(newDefaults, { 
                keepDefaultValues: false, // Use new default values
                keepValues: false // Don't keep current form values
            });
            console.log("Form reset after data load with defaults:", newDefaults);
        }
    }, [isLoading]);

    // Form will be automatically recreated when parentSchema changes due to useMemo above


    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row main-container">
                        <WindowDetail />

                        {/* <div className="col-3">
                            <label className="form-label">Window Size</label>
                            <div className="row">
                                <div className="col-6">
                                    <div className="input-group mb-3">
                                        <input
                                            type="number"
                                            className={`form-control ${errors.height ? 'is-invalid' : ''}`}
                                            placeholder="height"
                                            aria-label="height"
                                            step="1.00"
                                            onWheel={(e) => e.currentTarget.blur()}
                                            {...register("height", { valueAsNumber: true })}
                                        />
                                        <span className="input-group-text">Inch</span>
                                        {errors.height && (
                                            <div className="invalid-feedback">
                                                {errors.height.message}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="input-group mb-3">
                                        <input
                                            type="number"
                                            className={`form-control ${errors.width ? 'is-invalid' : ''}`}
                                            placeholder="width"
                                            aria-label="width"
                                            step="1.00"
                                            onWheel={(e) => e.currentTarget.blur()}
                                            {...register("width", { valueAsNumber: true })}
                                        />
                                        <span className="input-group-text">Inch</span>
                                        {errors.width && (
                                            <div className="invalid-feedback">
                                                {errors.width.message}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-2">
                            <label className="form-label">No. of Partition</label>
                            <div className="dropdown">
                                <button
                                    className="btn btn-secondary dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {watch("numberOfDoors")}
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                    {
                                        [2, 3, 4].map((num) => (
                                            <li key={num}><a className="dropdown-item" href="#" onClick={(e) => {
                                                e.preventDefault();
                                                setValue("numberOfDoors", num);
                                            }}>{num}</a></li>
                                        ))
                                    }
                                </ul>
                            </div>
                            {errors.numberOfDoors && (
                                <div className="text-danger small mt-1">
                                    {errors.numberOfDoors.message}
                                </div>
                            )}
                        </div>

                        <div className="col-2" style={{ marginTop: "2rem" }}>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="macharJaliRadio"
                                    {...register("isContainMacharJali")}
                                />
                                <label className="form-check-label" htmlFor="macharJaliRadio">Machar Jali</label>
                            </div>
                            {errors.isContainMacharJali && (
                                <div className="text-danger small mt-1">
                                    {errors.isContainMacharJali.message}
                                </div>
                            )}
                        </div>
                        <div className="col-2" style={{ marginTop: "2rem" }}>
                            <button
                                className="btn btn-success"
                                type="button"
                            >
                                Estimate Material
                            </button>
                        </div> */}
                    </div>

                    {/* Open after clicking on Estimate Material         */}
                    {showAdditionalSections && <div>
                        {/* Track Pipe Block */}
                        <div className="row main-container" style={{ marginTop: "2rem" }}>
                            <TrackDetail pipeType={pipeType} />
                        </div>

                        {/* Shutter Block */}
                        {/* <div className="row main-container" style={{ marginTop: "2rem" }}>
                            <ShutterDetail shutterTrackTypes={shutterTrackTypes} />
                        </div> */}

                        {/* {domalType.includes(watch('selectedWindowType')) && <div className="row main-container" style={{ marginTop: "2rem" }}>
                            <InterLockDetail allInterLockTypes={allInterLockTypes} />
                        </div>} */}

                        {/* {deepDomalType.includes(watch('selectedWindowType')) && <div className="row main-container" style={{ marginTop: "2rem" }}>
                            <VChannelDetail allVChannelTypes={allVChannelTypes} />
                        </div>} */}

                        {/* Material Prices */}
                        {/* <div className="row main-container" style={{ marginTop: "2rem" }}>
                            <MaterialPrice materialList={materialList} />
                        </div> */}

                        <div className="row main-container" style={{ marginTop: "2rem" }}>
                            <button className="btn btn-success" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Processing...' : 'Submit'}
                            </button>
                        </div>
                    </div>}
                </form>
            </FormProvider>
        </>
    );
}