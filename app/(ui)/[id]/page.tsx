'use client';

import { fetchMaterialList, fetchPipeDetail, fetchPipeType, fetchWindowfromWindowId } from "@/app/api/window";
import { MaterialType, PipeDetailType, PipeType } from "@/app/common/interfaces";
import TrackDetail from "@/app/(ui)/component/track-detail";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import WindowDetail from "../component/window-detail";
import ShutterDetail from "@/app/(ui)/component/shutter-detail";
import InterLockDetail from "@/app/(ui)/component/interlock-detail";
import VChannelDetail from "@/app/(ui)/component/vchannel-detail";
import MaterialPrice from "@/app/(ui)/component/material-price";
import EstimationDetail from "@/app/(ui)/component/estimation-detail";
import SpdpDetail, { spdpPipeSchema } from "@/app/(ui)/component/spdp-detail";
import { getDefaultFormValues, getSchemaForWindowsPipe } from "@/app/common/utility";
import TrackTopDetail from "../component/track-top-detail";
import TrackBottomDetail from "../component/track-bottom-detail";
import HandleDetail from "../component/handle-detail";
import LongBearingDetail from "../component/long-bearing-detail";

const pipeTypeToComponentMapping: Record<string, Array<React.ComponentType<any>>> = {
    '3 Track Domal': [TrackDetail, ShutterDetail, InterLockDetail],
    '2 Track Domal': [TrackDetail, ShutterDetail, InterLockDetail],
    '3 Track Deep Domal': [TrackDetail, ShutterDetail, InterLockDetail, VChannelDetail],
    '2 Track Deep Domal': [TrackDetail, ShutterDetail, InterLockDetail, VChannelDetail],
    '3 Track Mini Domal': [TrackDetail, ShutterDetail, InterLockDetail],
    '2 Track Mini Domal': [TrackDetail, ShutterDetail, InterLockDetail],
    '2 Track Normal': [TrackTopDetail, TrackBottomDetail, HandleDetail, InterLockDetail, LongBearingDetail],
    '3 Track Normal': [TrackTopDetail, TrackBottomDetail, HandleDetail, InterLockDetail, LongBearingDetail],
    '2 Track 18/60': [TrackTopDetail, TrackBottomDetail, HandleDetail, InterLockDetail, LongBearingDetail],
    '3 Track 18/60': [TrackTopDetail, TrackBottomDetail, HandleDetail, InterLockDetail, LongBearingDetail],
}

export default function WindowTypePage() {

    // variables
    const [showAdditionalSections, setShowAdditionalSections] = useState(true);
    const [showEstimationDetailView, setShowEstimationDetailView] = useState(false);
    const [numberOfTrack, setNumberOfTrack] = useState<number>(2);
    const [materialList, setMaterialList] = useState<MaterialType[]>([]);
    const [windowType, setWindowType] = useState<string>("");
    const [pipeType, setPipeType] = useState<PipeType[]>([]);
    const [pipeDetail, setPipeDetail] = useState<PipeDetailType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [includeSpDpSchema, setIncludeSpDpSchema] = useState(false);
    const params = useParams();
    const windowId = params['id'];

    // const updateMaterialList() {

    // }

    const getMaterialSchema = () => {
        let schema = z.object({});
        materialList.forEach((item) => {
            if (item.type && item.type.length > 0) {
                schema = schema.extend({
                    [`${item.field}_type`]: z.string(),
                    [`${item.field}_rate`]: z.number().min(1, `${item.label} rate must be at least 1`),
                });
            //     materialWithType.push(item);
                // setValue(item.field, item.rate);
            } else {
                schema = schema.extend({
                    [item.field]: z.number().min(1, `${item.label} rate must be at least 1`),
                });
                // materialWithoutType.push(item);
                // setValue(item.field, item.rate);
            }
            
        });
        return schema;
    };

    // Create dynamic schema based on windowType using useMemo
    const parentSchema = useMemo(() => {
        let schema = z.object({});
        schema = schema.extend({
            ...getSchemaForWindowsPipe(windowType).shape,
            ...getMaterialSchema().shape
        });

        // Include SPDP schema if needed
        if (includeSpDpSchema) {
            schema = schema.extend({
                ...spdpPipeSchema.shape,
            });
        }

        return schema;
    }, [windowType, materialList, includeSpDpSchema]);

    type FormData = z.infer<typeof parentSchema>;

    // Initialize form methods - will be updated when data loads
    const methods = useForm<FormData>({
        resolver: zodResolver(parentSchema),
        defaultValues: {},
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = methods;

    const selectedSpOrDpPipe = (watch as any)("selectedSpOrDpPipe") as "SP" | "DP" | "none" | undefined;
    const showUChannelDetail = (watch as any)("isContainMacharJali") && !(watch as any)("isContainGrillJali");


    // Update form resolver when schema changes
    useEffect(() => {
        if (!isLoading) {
            // Force re-validation by clearing errors and triggering validation
            methods.clearErrors();
        }
    }, [parentSchema, isLoading, methods]);

    useEffect(() => {

    }, [showUChannelDetail]);


    // Functions Definition
    const onSubmit = async (data: FormData) => {
        console.log("✅ Valid data", data);
        const inputObject = { ...data };
        console.log("Input Object for Estimation:", inputObject);
        // Here you can add your material estimation logic
        alert(JSON.stringify(inputObject, null, 2));
        setShowEstimationDetailView(true);
    };

    const openMaterialAdditionalSections = () => {
        const formValues = methods.getValues();
        if (formValues.height && formValues.width) {
            setShowAdditionalSections(true);
            return;
        }
        setShowAdditionalSections(false);

    }

    async function getWindowDetail() {
        const windowDetail = await fetchWindowfromWindowId(Number(windowId));
        setNumberOfTrack(windowDetail.windowTrack);
        setWindowType(windowDetail.windowType);
    }

    async function getMaterialList() {
        const materialList = await fetchMaterialList(Number(windowId));
        setMaterialList(materialList);
    }

    async function getPipeType() {
        const pipeType = await fetchPipeType();
        setPipeType(pipeType);
    }

    async function getPipeDetail() {
        const pipeDetail = await fetchPipeDetail(Number(windowId));
        setPipeDetail(pipeDetail);
    }

    async function runAllSideEffects() {
        setIsLoading(true);
        try {
            await Promise.all([getWindowDetail(), getMaterialList(), getPipeType(), getPipeDetail()]);
            console.log("Pipe Detail:", pipeDetail);
            console.log("Material List:", materialList);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    //used to get dynamic components based on window type
    const getPipeDetailComponent = useMemo(() => {
        if (!isLoading && windowType && windowType in pipeTypeToComponentMapping) {
            const baseComponents = pipeTypeToComponentMapping[windowType];

            // Add SpdpDetail if SP or DP is selected
            let components = [...baseComponents];
            if (selectedSpOrDpPipe === "SP" || selectedSpOrDpPipe === "DP") {
                // Only add if not already present
                if (!components.includes(SpdpDetail)) {
                    components.push(SpdpDetail);
                }
                setIncludeSpDpSchema(true);
            } else {
                // Remove SpdpDetail if it exists
                components = components.filter(component => component !== SpdpDetail);
                setIncludeSpDpSchema(false);
            }

            return components.map((Component) => {
                return <Component key={Component.name} pipeType={pipeType} pipeDetail={pipeDetail} />;
            });
        }
        return [];
    }, [isLoading, windowType, pipeType, pipeDetail, selectedSpOrDpPipe]);

    //React Hooks
    useEffect(() => {
        runAllSideEffects();
    }, []);

    // Reset form methods after getting data from database
    useEffect(() => {
        if (!isLoading && windowType && pipeType.length > 0) {
            // Reset form with proper schema and default values after data is loaded
            const newDefaults = getDefaultFormValues(windowType, pipeType);

            methods.reset(newDefaults, {
                keepDefaultValues: false, // Use new default values
                keepValues: false // Don't keep current form values
            });
        }
    }, [isLoading, materialList]);

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
        <div className="window-fixed-top text-center">
            <h4 className="mb-0">{windowType}</h4>
        </div>
            {!showEstimationDetailView ? <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row main-container" style={{ marginTop: "70px" }}>
                        <WindowDetail onEstimateMaterial={openMaterialAdditionalSections} />
                    </div>

                    {/* Open after clicking on Estimate Material         */}
                    {showAdditionalSections && <div>
                        {getPipeDetailComponent?.map(component => {
                            return <div className="row main-container" style={{ marginTop: "1.5rem" }} key={component.key}>
                                {component}
                            </div>
                        })}

                        {/* Material Prices */}
                        <div className="row main-container" style={{ marginTop: "1.5rem" }}>
                            <MaterialPrice materialList={materialList} />
                        </div>

                        <div className="row main-container" style={{ marginTop: "1.5rem" }}>
                            <button className="btn btn-success" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Processing...' : 'Submit'}
                            </button>
                        </div>
                    </div>}
                </form>
            </FormProvider>
                :
                <div style={{ marginTop: "70px" }}>
                    <EstimationDetail materialList={materialList} />
                </div>
                }
        </>
    );
}