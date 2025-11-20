import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { PipeDetailType, PipeType } from "../../common/interfaces";

interface TrackBottomDetailProps {
    pipeType: PipeType[];
    pipeDetail: PipeDetailType[] 
}
export const trackBottomPipeSchema = z.object({
    trackBottomPipeType: z.string(),
    trackBottomPipeRate: z.number().min(1, "Track rate must be greater than 0"),
    smallTrackBottomPipeWeight: z.number().min(1, "Track weight must be greater than 0"),
    bigTrackBottomPipeWeight: z.number().min(1, "Track weight must be greater than 0"),
    trackBottomPipeSize180: z.boolean(),
    trackBottomPipeSize192: z.boolean(),
    extraTrackBottomPipeLength: z.array(z.number().min(1, "Extra track length must be greater than 0")).optional(),
})
export default function TrackBottomDetail(props: TrackBottomDetailProps ) {
    const { register, formState: { errors }, setValue, watch } = useFormContext();
    const [showExtraTrack, setShowExtraTrack] = useState(false);
    const [extraTrackCount, setExtraTrackCount] = useState(1);

    const ExtraTrackButtonLabel = showExtraTrack ? "Hide Extra Track" : "Show Extra Track";

    const showExtraTrackField = () => {
        setShowExtraTrack(!showExtraTrack);
        setValue("extraTrackBottomPipeLength", []);
    }

    const addExtraTrackField = () => {
        setExtraTrackCount(prev => prev + 1);
    }

    const removeExtraTrackField = () => {
        if (extraTrackCount > 1) {
            setExtraTrackCount(prev => prev - 1);
            const currentValues = watch("extraTrackBottomPipeLength") || [];
            setValue("extraTrackBottomPipeLength", currentValues.slice(0, -1));
        }
    }

    useEffect(() => {
        const trackBottomPipeDetail = props.pipeDetail.find(pd => pd.pipeType === 'Track Bottom');
        setValue("smallTrackBottomPipeWeight", trackBottomPipeDetail?.pipeSizes[0].weight || 0);
        setValue("bigTrackBottomPipeWeight", trackBottomPipeDetail?.pipeSizes[1].weight || 0);
    }, [watch("trackBottomPipeType")]);

    useEffect(() => {
        setValue("trackBottomPipeRate", props.pipeType.find(pt => pt.color === watch("trackBottomPipeType"))?.ratePerKg || 0);
        setValue("trackBottomPipeSize180", true);
        setValue("trackBottomPipeSize192", true);
    }, [watch("trackBottomPipeType")]);

    return (
        <>
            <div className="row">
                <h3>Track Bottom</h3>
            </div>
            <div className="row mt-3">
                <div className="col-2">
                    <label className="form-label">Track Type</label>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {watch("trackBottomPipeType")}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark">
                            {
                                props.pipeType.map((type) => (
                                    <li key={type.id}><a className="dropdown-item" href="#" onClick={(e) => {
                                        e.preventDefault();
                                        setValue("trackBottomPipeType", type.color);
                                    }}>{type.color}</a></li>
                                ))
                            }
                        </ul>
                    </div>
                    {errors.trackBottomPipeType && (
                        <div className="text-danger small mt-1">
                            {errors.trackBottomPipeType.message as string}
                        </div>
                    )}
                </div>

                <div className="col-2">
                    <label className="form-label">Track Rate</label>
                    <div className="input-group mb-3">
                        <input 
                            type="number" 
                            className={`form-control ${errors.trackBottomPipeRate ? 'is-invalid' : ''}`}
                            placeholder="Rate" 
                            aria-label="rate"
                            step="1.00"
                            onWheel={(e) => e.currentTarget.blur()}
                            {...register("trackBottomPipeRate", { valueAsNumber: true })}
                        />
                        <span className="input-group-text">$</span>
                        {errors.trackBottomPipeRate && (
                            <div className="invalid-feedback">
                                {errors.trackBottomPipeRate.message as string}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-2">
                    <label className="form-label">Track Weight (KG)</label>
                    <div className="input-group mb-3">
                        <input 
                            type="number" 
                            className={`form-control ${errors.smallTrackBottomPipeWeight ? 'is-invalid' : ''}`}
                            placeholder="Weight" 
                            aria-label="weight"
                            step="0.01"
                            onWheel={(e) => e.currentTarget.blur()}
                            {...register("smallTrackBottomPipeWeight", { valueAsNumber: true })}
                        />
                        <span className="input-group-text">180"</span>
                        {errors.smallTrackBottomPipeWeight && (
                            <div className="invalid-feedback">
                                {errors.smallTrackBottomPipeWeight.message as string}
                            </div>
                        )}
                    </div>
                    <div className="input-group mb-3">
                        <input 
                            type="number" 
                            className={`form-control ${errors.bigTrackBottomPipeWeight ? 'is-invalid' : ''}`}
                            placeholder="Weight" 
                            aria-label="weight"
                            step="0.01"
                            onWheel={(e) => e.currentTarget.blur()}
                            {...register("bigTrackBottomPipeWeight", { valueAsNumber: true })}
                        />
                        <span className="input-group-text">192"</span>
                        {errors.bigTrackBottomPipeWeight && (
                            <div className="invalid-feedback">
                                {errors.bigTrackBottomPipeWeight.message as string}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-1" style={{ marginTop: "1.5rem" }}>
                    <div className="d-flex flex-column">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="trackBottomPipeSize180"
                                {...register("trackBottomPipeSize180")}
                            />
                            <label className="form-check-label" htmlFor="trackBottomPipeSize180">
                                180"
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="trackBottomPipeSize192"
                                {...register("trackBottomPipeSize192")}
                            />
                            <label className="form-check-label" htmlFor="trackBottomPipeSize192">
                                192"
                            </label>
                        </div>
                    </div>
                </div>

                <div className="col-auto" style={{ marginTop: "2rem" }}>
                    <button className="btn btn-primary" type="button" onClick={showExtraTrackField}>
                        {ExtraTrackButtonLabel}
                    </button>
                </div>
                {showExtraTrack &&
                <>
                <div className="row">
                    {Array.from({ length: extraTrackCount }).map((_, index) => (
                        <div className="col-2" key={index}>
                            <label className="form-label">Extra Track-Bottom {index + 1}</label>
                            <div className="input-group mb-3">
                                <input 
                                    type="number" 
                                    className={`form-control ${(errors.extraTrackBottomPipeLength as any)?.[index] ? 'is-invalid' : ''}`}
                                    placeholder="Track-Bottom Length" 
                                    aria-label="track-bottom-length"
                                    step="1.00"
                                    onWheel={(e) => e.currentTarget.blur()}
                                    {...register(`extraTrackBottomPipeLength.${index}`, { valueAsNumber: true })}
                                />
                                <span className="input-group-text">Inch</span>
                                {(errors.extraTrackBottomPipeLength as any)?.[index] && (
                                    <div className="invalid-feedback">
                                        {(errors.extraTrackBottomPipeLength as any)[index]?.message as string}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                    
                    
                    <div className="col-12 mt-2">
                        <button className="btn btn-success btn-sm me-2" type="button" onClick={addExtraTrackField}>
                            + Add Track-Bottom
                        </button>
                        {extraTrackCount > 1 && (
                            <button className="btn btn-danger btn-sm" type="button" onClick={removeExtraTrackField}>
                                - Remove Track-Bottom
                            </button>
                        )}
                    </div>
                </>
                }
            </div>
        </>
    );
}