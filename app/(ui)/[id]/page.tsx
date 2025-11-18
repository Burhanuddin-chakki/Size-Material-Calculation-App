'use client';

import { fetchMaterialList, fetchPipeDetail, fetchPipeType, fetchWindowfromWindowId } from "@/app/api/window";
import { MaterialType, PipeDetailType, PipeType } from "@/app/common/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import dynamic from "next/dynamic";
import WindowDetail from "../component/window-detail";
import { getDefaultFormValues, getSchemaForWindowsPipe } from "@/app/common/utility";
import { spdpPipeSchema } from "@/app/(ui)/component/spdp-detail";

// ✅ Code Splitting: Lazy load heavy components
// These components are loaded only when needed (after user fills window details)
const TrackDetail = dynamic(() => import("@/app/(ui)/component/track-detail"), {
  loading: () => <div className="text-center p-3"><div className="spinner-border spinner-border-sm" role="status"></div></div>
});
const ShutterDetail = dynamic(() => import("@/app/(ui)/component/shutter-detail"), {
  loading: () => <div className="text-center p-3"><div className="spinner-border spinner-border-sm" role="status"></div></div>
});
const InterLockDetail = dynamic(() => import("@/app/(ui)/component/interlock-detail"), {
  loading: () => <div className="text-center p-3"><div className="spinner-border spinner-border-sm" role="status"></div></div>
});
const VChannelDetail = dynamic(() => import("@/app/(ui)/component/vchannel-detail"), {
  loading: () => <div className="text-center p-3"><div className="spinner-border spinner-border-sm" role="status"></div></div>
});
const TrackTopDetail = dynamic(() => import("../component/track-top-detail"), {
  loading: () => <div className="text-center p-3"><div className="spinner-border spinner-border-sm" role="status"></div></div>
});
const TrackBottomDetail = dynamic(() => import("../component/track-bottom-detail"), {
  loading: () => <div className="text-center p-3"><div className="spinner-border spinner-border-sm" role="status"></div></div>
});
const HandleDetail = dynamic(() => import("../component/handle-detail"), {
  loading: () => <div className="text-center p-3"><div className="spinner-border spinner-border-sm" role="status"></div></div>
});
const LongBearingDetail = dynamic(() => import("../component/long-bearing-detail"), {
  loading: () => <div className="text-center p-3"><div className="spinner-border spinner-border-sm" role="status"></div></div>
});
const SpdpDetail = dynamic(() => import("@/app/(ui)/component/spdp-detail"), {
  loading: () => <div className="text-center p-3"><div className="spinner-border spinner-border-sm" role="status"></div></div>
});
const MaterialPrice = dynamic(() => import("@/app/(ui)/component/material-price"), {
  loading: () => <div className="text-center p-3"><div className="spinner-border spinner-border-sm" role="status"></div></div>
});

// ✅ Estimation Detail is heavy - only load when user submits form
const EstimationDetail = dynamic(() => import("@/app/(ui)/component/estimation-detail"), {
  loading: () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading estimation...</span>
      </div>
    </div>
  ),
  ssr: false // Client-side only for complex calculations
});

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
    const [showAdditionalSections, setShowAdditionalSections] = useState(false);
    const [showEstimationDetailView, setShowEstimationDetailView] = useState(false);
    const [numberOfTrack, setNumberOfTrack] = useState<number>(2);
    const [materialList, setMaterialList] = useState<MaterialType[]>([]);
    const [windowType, setWindowType] = useState<string>("");
    const [pipeType, setPipeType] = useState<PipeType[]>([]);
    const [pipeDetail, setPipeDetail] = useState<PipeDetailType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [includeSpDpSchema, setIncludeSpDpSchema] = useState(false);
    const [showUChannelSections, setShowUChannelSections] = useState(false);
    const [materialWithType, setMaterialWithType] = useState<MaterialType[]>([]);
    const [materialWithoutType, setMaterialWithoutType] = useState<MaterialType[]>([]);
    const [materialEstimationData, setMaterialEstimationData] = useState<any>(null);
    const params = useParams();
    const windowId = params['id'];

    // Separate the material categorization into useEffect
    useEffect(() => {
        if (materialList.length > 0) {
            const withType: MaterialType[] = [];
            const withoutType: MaterialType[] = [];
            materialList.forEach((item) => {
                if (item.type && item.type.length > 0) {
                    if (item.field !== "uChannel") {
                        withType.push(item);
                    } else {
                        showUChannelSections && withType.push(item);
                    }
                } else {
                    withoutType.push(item);
                }
            });
            setMaterialWithType(withType);
            setMaterialWithoutType(withoutType);
        }
    }, [materialList, showUChannelSections]);

    const getMaterialSchema = () => {
        let schema = z.object({});
        materialList.forEach((item) => {
            if (item.type && item.type.length > 0) {
                if (item.field !== "uChannel") {
                    schema = schema.extend({
                        [`${item.field}_type`]: z.string(),
                        [`${item.field}_rate`]: z.number().min(1, `${item.label} rate must be at least 1`),
                    });
                } else {
                    if (showUChannelSections) {
                        schema = schema.extend({
                            [`${item.field}_type`]: z.string(),
                            [`${item.field}_rate`]: z.number().min(1, `${item.label} rate must be at least 1`),
                        });
                    }
                }

            } else {
                schema = schema.extend({
                    [item.field]: z.number().min(1, `${item.label} rate must be at least 1`),
                });
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
    }, [windowType, materialList, includeSpDpSchema, showUChannelSections]);

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
        setShowUChannelSections(showUChannelDetail);
    }, [showUChannelDetail]);


    // Functions Definition
    const onSubmit = async (data: FormData) => {
        const inputObject: any = { ...data };
        inputObject['numberOfTrack'] = Number(numberOfTrack);
        setMaterialEstimationData(inputObject);
        setShowEstimationDetailView(true);
    };

    const openMaterialAdditionalSections = () => {
        methods.trigger(['height', 'width'] as any).then((isValid) => {
            if(isValid){
                setShowAdditionalSections(true);
                return;
            }
        })
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

            return components.map((Component,index) => {
               return  <Component key={`component-${index}`} pipeType={pipeType} pipeDetail={pipeDetail} />;
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
                {showEstimationDetailView ? <button 
                        className="btn btn-light position-absolute start-0 ms-3 d-flex align-items-center gap-2" 
                        onClick={() => setShowEstimationDetailView(false)}
                        style={{ 
                            border: "1px solid rgba(255,255,255,0.2)",
                            transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "";
                        }}
                    >
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                        </svg>
                        Back
                    </button> : null}
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
                            <MaterialPrice materialWithType={materialWithType} materialWithoutType={materialWithoutType} />
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
                    <EstimationDetail materialList={materialList} windowType={windowType} inputData={materialEstimationData} />
                </div>
            }
        </>
    );
}