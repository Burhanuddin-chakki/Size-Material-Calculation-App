import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { PipeDetailType, PipeType } from "../../common/interfaces";

interface LongBearingDetailProps {
    pipeType: PipeType[];
    pipeDetail: PipeDetailType[] 
}
export const longBearingPipeSchema = z.object({
    longBearingPipeType: z.string(),
    longBearingPipeRate: z.number().min(1, "Long Bearing rate must be greater than 0"),
    smallLongBearingPipeWeight: z.number().min(1, "Long Bearing weight must be greater than 0"),
    bigLongBearingPipeWeight: z.number().min(1, "Long Bearing weight must be greater than 0"),
    longBearingPipeSize180: z.boolean(),
    longBearingPipeSize192: z.boolean(),
    extraTrackLongBearingPipeLength: z.number().optional(),
})
export default function LongBearingDetail(props: LongBearingDetailProps ) {
    const { register, formState: { errors }, setValue, watch } = useFormContext();
    const [showExtraTrack, setShowExtraTrack] = useState(false);

    const ExtraTrackButtonLabel = showExtraTrack ? "Hide Extra Track" : "Show Extra Track";

    const showExtraTrackField = () => {
        setShowExtraTrack(!showExtraTrack);
        setValue("extraTrackLongBearingPipeLength", 0);
    }

    useEffect(() => {
        const longBearingPipeDetail = props.pipeDetail.find(pd => pd.pipeType === 'Long Bearing');
        setValue("smallLongBearingPipeWeight", longBearingPipeDetail?.pipeSizes[0].weight || 0);
        setValue("bigLongBearingPipeWeight", longBearingPipeDetail?.pipeSizes[1].weight || 0);
    }, [watch("longBearingPipeType")]);

    useEffect(() => {
        setValue("longBearingPipeRate", props.pipeType.find(pt => pt.color === watch("longBearingPipeType"))?.ratePerKg || 0);
        setValue("longBearingPipeSize180", true);
        setValue("longBearingPipeSize192", true);
    }, [watch("longBearingPipeType")]);

    return (
        <>
            <div className="row">
                <h3>Long Bearing</h3>
            </div>
            <div className="row mt-3">
                <div className="col-2">
                    <label className="form-label">Long Bearing Type</label>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {watch("longBearingPipeType")}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark">
                            {
                                props.pipeType.map((type) => (
                                    <li key={type.id}><a className="dropdown-item" href="#" onClick={(e) => {
                                        e.preventDefault();
                                        setValue("longBearingPipeType", type.color);
                                    }}>{type.color}</a></li>
                                ))
                            }
                        </ul>
                    </div>
                    {errors.longBearingPipeType && (
                        <div className="text-danger small mt-1">
                            {errors.longBearingPipeType.message as string}
                        </div>
                    )}
                </div>

                <div className="col-2">
                    <label className="form-label">Track Rate</label>
                    <div className="input-group mb-3">
                        <input 
                            type="number" 
                            className={`form-control ${errors.longBearingPipeRate ? 'is-invalid' : ''}`}
                            placeholder="Rate" 
                            aria-label="rate"
                            step="1.00"
                            onWheel={(e) => e.currentTarget.blur()}
                            {...register("longBearingPipeRate", { valueAsNumber: true })}
                        />
                        <span className="input-group-text">$</span>
                        {errors.longBearingPipeRate && (
                            <div className="invalid-feedback">
                                {errors.longBearingPipeRate.message as string}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-2">
                    <label className="form-label">Track Weight (KG)</label>
                    <div className="input-group mb-3">
                        <input 
                            type="number" 
                            className={`form-control ${errors.smallLongBearingPipeWeight ? 'is-invalid' : ''}`}
                            placeholder="Weight" 
                            aria-label="weight"
                            step="0.01"
                            onWheel={(e) => e.currentTarget.blur()}
                            {...register("smallLongBearingPipeWeight", { valueAsNumber: true })}
                        />
                        <span className="input-group-text">180"</span>
                        {errors.smallLongBearingPipeWeight && (
                            <div className="invalid-feedback">
                                {errors.smallLongBearingPipeWeight.message as string}
                            </div>
                        )}
                    </div>
                    <div className="input-group mb-3">
                        <input 
                            type="number" 
                            className={`form-control ${errors.bigLongBearingPipeWeight ? 'is-invalid' : ''}`}
                            placeholder="Weight" 
                            aria-label="weight"
                            step="0.01"
                            onWheel={(e) => e.currentTarget.blur()}
                            {...register("bigLongBearingPipeWeight", { valueAsNumber: true })}
                        />
                        <span className="input-group-text">192"</span>
                        {errors.bigLongBearingPipeWeight && (
                            <div className="invalid-feedback">
                                {errors.bigLongBearingPipeWeight.message as string}
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
                                id="longBearingPipeSize180"
                                {...register("longBearingPipeSize180")}
                            />
                            <label className="form-check-label" htmlFor="longBearingPipeSize180">
                                180"
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="longBearingPipeSize192"
                                {...register("longBearingPipeSize192")}
                            />
                            <label className="form-check-label" htmlFor="longBearingPipeSize192">
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
                    <div className="col-2">
                        <label className="form-label">Extra Track Length</label>
                        <div className="input-group mb-3">
                            <input 
                                type="number" 
                                className={`form-control ${errors.extraTrackLongBearingPipeLength ? 'is-invalid' : ''}`}
                                placeholder="Track Length" 
                                aria-label="track-length"
                                step="1.00"
                                onWheel={(e) => e.currentTarget.blur()}
                                {...register("extraTrackLongBearingPipeLength", { valueAsNumber: true })}
                            />
                            <span className="input-group-text">Inch</span>
                            {errors.extraTrackLongBearingPipeLength && (
                                <div className="invalid-feedback">
                                    {errors.extraTrackLongBearingPipeLength.message as string}
                                </div>
                            )}
                        </div>
                    </div>
                }
            </div>
        </>
    );
}