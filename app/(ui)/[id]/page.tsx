'use client';

import { fetchMaterialList, fetchPipeType, fetchWindowfromWindowId } from "@/app/api/window";
import { MaterialType, PipeType } from "@/app/common/interfaces";
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
import { getDefaultFormValues, getSchemaForWindowsPipe } from "@/app/common/utility";


const pipeTypeToComponentMapping: Record<string, Array<React.ComponentType<any>>> = {
    '3 Track Domal': [TrackDetail, ShutterDetail, InterLockDetail, VChannelDetail]
}

export default function WindowTypePage() {

    // variables
    const [showAdditionalSections, setShowAdditionalSections] = useState(true);
    const [showEstimationDetailView, setShowEstimationDetailView] = useState(false);
    const [numberOfTrack, setNumberOfTrack] = useState<number>(2);
    const [materialList, setMaterialList] = useState<MaterialType[]>([]);
    const [windowType, setWindowType] = useState<string>("");
    const [pipeType, setPipeType] = useState<PipeType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const windowId = params['id'];

    // const updateMaterialList() {

    // }

    const getMaterialSchema = () => {
        let schema = z.object({});
        materialList.forEach((item) => {
            schema = schema.extend({
                [item.field]: z.number().min(1, `${item.label} rate must be at least 1`),
            });
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

        return schema;
    }, [windowType, materialList]);

    type FormData = z.infer<typeof parentSchema>;

    // Initialize form methods - will be updated when data loads
    const methods = useForm<FormData>({
        resolver: zodResolver(parentSchema),
        defaultValues: {},
        // mode: 'onChange'
    });

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = methods;



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
    }

    //used to get dynamic components based on window type
    const getPipeDetailComponent = useMemo(() => {
        if (!isLoading && windowType && windowType in pipeTypeToComponentMapping) {
            return (pipeTypeToComponentMapping)[windowType].map((Component) => {
                return <Component key={Component.name} pipeType={pipeType} />;
            });
        }
    }, [isLoading, windowType, pipeType]);

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
            {!showEstimationDetailView ? <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row main-container">
                        <WindowDetail onEstimateMaterial={openMaterialAdditionalSections} />
                    </div>

                    {/* Open after clicking on Estimate Material         */}
                    {showAdditionalSections && <div>
                        {getPipeDetailComponent?.map(component => {
                            return <div className="row main-container" style={{ marginTop: "2rem" }} key={component.key}>
                                {component}
                            </div>
                        })}

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
            </FormProvider> 
            : 
            <EstimationDetail materialList={materialList}/>
            }
        </>
    );
}