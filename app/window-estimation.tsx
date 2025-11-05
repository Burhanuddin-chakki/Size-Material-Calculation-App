"use client";
import { useEffect, useState } from "react";
import TrackDetail from "./track-detail";
import ShutterDetail from "./shutter-detail";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, z } from "zod";
import InterLockDetail from "./interlock-detail";
import VChannelDetail from "./vchannel-detail";
import MaterialPrice from "./material-price";
import EstimationDetail from "./estimation-detail";

export interface MaterialItemType {
    label: string;
    field: keyof FormData;
    rate: number;
}

const trackTypes = ["type 1", "type 2", "type 3"];
const shutterTrackTypes = ["hutterTrack 1", "hutterTrack 2", "hutterTrack 3"];
const allInterLockTypes = ["InterLock A", "InterLock B", "InterLock C"];
const allVChannelTypes = ["V-Channel 1", "V-Channel 2", "V-Channel 3"];
const windowType = ["Normal", "18/60", "Mini Domal", "Domal", "Deep Domal"]
const allDomalTypes = windowType.slice(2); // ["Mini Domal", "Domal", "Deep Domal"]
const domalType = windowType.slice(2, windowType.length -1); // ["Mini Domal", "Domal"]
const deepDomalType = windowType.slice(-1); // ["Deep Domal"]
const materialList: MaterialItemType[] = [
        { label: "Angle", field: "angleRate", rate: 10 },
        { label: "L Connector", field: "lConnector", rate: 12 },
        { label: "L Patti", field: "lPatti", rate: 8 },
        { label: "Bearing", field: "bearing", rate: 15 },
        { label: "Screw 13/6", field: "screw13_6", rate: 5 },
        { label: "Lock", field: "lock", rate: 20 },
        { label: "PVC Brush", field: "pvcBrush", rate: 7 },
        { label: "Glass Rubber", field: "glassRubber", rate: 9 },
        { label: "Glass", field: "glass", rate: 19 },
        { label: "Kekda", field: "kekda", rate: 11 },
        { label: "Male Female", field: "maleFemale", rate: 13 },
        { label: "Water Guide", field: "waterGuide", rate: 14 },
        { label: "Silicon", field: "silicon", rate: 16 },
        { label: "Screw 75/10", field: "screw75_10", rate: 18 },
        { label: "Machar Jali", field: "macharJali", rate: 17 },
        { label: "Labour", field: "labour", rate: 20 },
    ]

const schema = z.object({
    height: z.number().min(1, "Height must be at least 1 inch"),
    width: z.number().min(1, "Width must be at least 1 inch"),
    numberOfShutters: z.number().min(2, "Minimum 2 shutters required").max(3, "Maximum 3 shutters allowed"),
    numberOfDoors: z.number().min(2, "Minimum 2 doors required").max(4, "Maximum 4 doors allowed"),
    selectedWindowType: z.enum(windowType),
    isContainMacharJali: z.boolean(),
    // Track Detail fields
    trackType: z.enum(trackTypes),
    trackRate: z.number().min(1, "Track rate must be greater than 0"),
    extraTrackLength: z.number().optional(),
    // Shutter Detail fields
    shutterTrackType: z.enum(shutterTrackTypes),
    shutterTrackRate: z.number().min(1, "Shutter track rate must be greater than 0"),
    shutterExtraTrackLength: z.number().optional(),
    // InterLock Detail fields - only required for Mini Domal and Domal
    interLockType: z.enum(allInterLockTypes).optional(),
    interLockRate: z.number().min(1, "InterLock rate must be greater than 0").optional(),
    interLockExtraLength: z.number().optional(),
    // V-Channel Detail fields - only required for Deep Domal
    vChannelType: z.enum(allVChannelTypes).optional(),
    vChannelRate: z.number().min(1, "V-Channel rate must be greater than 0").optional(),
    vChannelExtraLength: z.number().optional(),
    // Material Price fields
    angleRate: z.number().min(1, "Angle rate must be greater than 0"),
    lConnector: z.number().min(1, "L Connector rate must be greater than 0"),
    lPatti: z.number().min(1, "L Patti rate must be greater than 0"),
    bearing: z.number().min(1, "Bearing rate must be greater than 0"),
    screw13_6: z.number().min(1, "Screw 13/6 rate must be greater than 0"),
    lock: z.number().min(1, "Lock rate must be greater than 0"),
    pvcBrush: z.number().min(1, "PVC Brush rate must be greater than 0"),
    glassRubber: z.number().min(1, "Glass Rubber rate must be greater than 0"),
    glass: z.number().min(1, "Glass rate must be greater than 0"),
    kekda: z.number().min(1, "Kekda rate must be greater than 0"),
    maleFemale: z.number().min(1, "Male Female rate must be greater than 0"),
    waterGuide: z.number().min(1, "Water Guide rate must be greater than 0"),
    silicon: z.number().min(1, "Silicon rate must be greater than 0"),
    screw75_10: z.number().min(1, "Screw 75/10 rate must be greater than 0"),
    macharJali: z.number().min(1, "Machar Jali rate must be greater than 0"),
    labour: z.number().min(1, "Labour rate must be greater than 0"),
}).superRefine((data, ctx) => {
    // Validate InterLock fields only for Mini Domal and Domal
    if (domalType.includes(data.selectedWindowType)) {
        if (!data.interLockType) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "InterLock type is required for this window type",
                path: ["interLockType"],
            });
        }
        if (data.interLockRate === undefined || data.interLockRate === null || data.interLockRate < 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "InterLock rate must be greater than 0",
                path: ["interLockRate"],
            });
        }
    }

    // Validate V-Channel fields only for Deep Domal
    if (data.selectedWindowType === deepDomalType[0]) {
        if (!data.vChannelType) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "V-Channel type is required for Deep Domal window type",
                path: ["vChannelType"],
            });
        }
        if (data.vChannelRate === undefined || data.vChannelRate === null || data.vChannelRate < 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "V-Channel rate must be greater than 0",
                path: ["vChannelRate"],
            });
        }
    }
});

type FormData = z.infer<typeof schema>;

export default function WindowEstimation() {

    const [showAdditionalSections, setShowAdditionalSections] = useState(false);
    const [showEstimationDetailView, setShowEstimationDetailView] = useState(false);

    const methods = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            numberOfShutters: 2,
            numberOfDoors: 2,
            trackType: trackTypes[0],
            shutterTrackType: shutterTrackTypes[0],
            selectedWindowType: windowType[0],
            isContainMacharJali: true,
        }
    });

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = methods;

    // Watch for window type changes and set default values for conditional fields
    const selectedWindowType = watch("selectedWindowType");
    
    useEffect(() => {
        // Handle InterLock fields based on window type
        if (domalType.includes(selectedWindowType)) {
            // Set default values when window type requires InterLock
            if (!watch("interLockType")) {
                setValue("interLockType", allInterLockTypes[0]);
            }
        } else {
            // Clear InterLock fields when not required
            setValue("interLockType", undefined);
            setValue("interLockRate", undefined);
            setValue("interLockExtraLength", undefined);
        }
        
        // Handle V-Channel fields based on window type
        if (selectedWindowType === deepDomalType[0]) {
            // Set default values when window type requires V-Channel
            if (!watch("vChannelType")) {
                setValue("vChannelType", allVChannelTypes[0]);
            }
        } else {
            // Clear V-Channel fields when not required
            setValue("vChannelType", undefined);
            setValue("vChannelRate", undefined);
            setValue("vChannelExtraLength", undefined);
        }
    }, [selectedWindowType, setValue, watch]);

    const onSubmit = (data: FormData) => {
        console.log("✅ Valid data", data);
        const inputObject = { ...data };
        console.log("Input Object for Estimation:", inputObject);
        // Here you can add your material estimation logic
        alert(JSON.stringify(inputObject, null, 2));
        setShowEstimationDetailView(true);
    };


    // const mainContainer = {
    //     backgroundColor: "#e6e4e4",
    //     borderRadius: "5px",
    //     display: "flex",
    //     justifyContent: "center",
    //     padding: "2rem",
    //     boxShadow: "3px 5px 12px rgba(0, 0, 0, 0.2)",
    // };

    const openTrackAdditionalSection = async () => {
        const formValues = methods.getValues();
        if (formValues.height && formValues.width && formValues.numberOfShutters && formValues.numberOfDoors && formValues.selectedWindowType) {
            setShowAdditionalSections(true);
            return;
        }
        setShowAdditionalSections(false);
    };

    const prefillMaterialRates = (data: MaterialItemType[]) => {
        data.forEach((item: MaterialItemType) => {
            setValue(item.field, item.rate);
        });
    }

    useEffect(() => {
        prefillMaterialRates(materialList);
    }, []);



    return (
        <>
            {!showEstimationDetailView ? <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row main-container">
                        <div className="col-3">
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

                        <div className="col-2 ml-20" >
                            <label className="form-label">No. of Shutter</label>
                            <div className="dropdown">
                                <button
                                    className="btn btn-secondary dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {watch("numberOfShutters")}
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                    {[2, 3].map((num) => (
                                        <li key={num}>
                                            <a className="dropdown-item" href="#" onClick={(e) => {
                                                e.preventDefault();
                                                setValue("numberOfShutters", num);
                                            }}>{num}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {errors.numberOfShutters && (
                                <div className="text-danger small mt-1">
                                    {errors.numberOfShutters.message}
                                </div>
                            )}
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

                        <div className="col-2">
                            <label className="form-label">Window Type</label>
                            <div className="dropdown">
                                <button
                                    className="btn btn-secondary dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {watch("selectedWindowType")}
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                    {
                                        windowType.map((type) => (
                                            <li key={type}>
                                                <a className="dropdown-item" href="#" onClick={(e) => {
                                                    e.preventDefault();
                                                    setValue("selectedWindowType", type);
                                                }}>
                                                    {type}
                                                </a>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                            {errors.selectedWindowType && (
                                <div className="text-danger small mt-1">
                                    {errors.selectedWindowType.message}
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
                                onClick={openTrackAdditionalSection}
                            >
                                Estimate Material
                            </button>
                        </div>
                    </div>

                    {/* Open after clicking on Estimate Material         */}
                    {showAdditionalSections && <div>
                        {/* Track Block */}
                        <div className="row main-container" style={{ marginTop: "2rem" }}>
                            <TrackDetail trackTypes={trackTypes} />
                        </div>

                        {/* Shutter Block */}
                        <div className="row main-container" style={{ marginTop: "2rem" }}>
                            <ShutterDetail shutterTrackTypes={shutterTrackTypes} />
                        </div>

                        {domalType.includes(watch('selectedWindowType')) &&  <div className="row main-container" style={{ marginTop: "2rem" }}>
                            <InterLockDetail allInterLockTypes={allInterLockTypes} />
                        </div>}

                        { deepDomalType.includes(watch('selectedWindowType')) && <div className="row main-container" style={{ marginTop: "2rem" }}>
                            <VChannelDetail allVChannelTypes={allVChannelTypes} />
                        </div>}

                        {/* Material Prices */}
                        <div className="row main-container" style={{ marginTop: "2rem" }}>
                            <MaterialPrice materialList={materialList} />
                        </div>

                        <div className="row main-container" style={{ marginTop: "2rem" }}>
                            <button className="btn btn-success" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Processing...' : 'Submit'}
                            </button>
                        </div>
                    </div>}
                </form>
            </FormProvider> : <EstimationDetail materialList= {materialList} allDomalTypes={allDomalTypes} deepDomalType={deepDomalType} domalType={domalType} />}
        </>
    );
}