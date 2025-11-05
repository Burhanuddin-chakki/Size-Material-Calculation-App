import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { PipeType } from "../../common/interfaces";


interface TrackDetailProps {
    pipeType: PipeType[];
}
export const trackPipeSchema = z.object({
    trackPipeType: z.string(),
    trackPipeRate: z.number().min(1, "Track rate must be greater than 0"),
    extraTrackPipeLength: z.number().optional(),
})
export default function TrackDetail(props: TrackDetailProps ) {
    const { register, formState: { errors }, setValue, watch } = useFormContext();
    const [showExtraTrack, setShowExtraTrack] = useState(false);

    const ExtraTrackButtonLabel = showExtraTrack ? "Hide Extra Track" : "Show Extra Track";

    

    const showExtraTrackField = () => {
        setShowExtraTrack(!showExtraTrack);
        setValue("extraTrackPipeLength", 0);
    }

    useEffect(() => {
        setValue("trackPipeRate", props.pipeType.find(pt => pt.color === watch("trackPipeType"))?.ratePerKg || 0);
    }, [watch("trackPipeType")]);

    return (
        <>
            <div className="row">
                <h3>Track</h3>
            </div>
            <div className="row mt-3">
                <div className="col-3">
                    <label className="form-label">Track Type</label>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {watch("trackPipeType")}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark">
                            {
                                props.pipeType.map((type) => (
                                    <li key={type.id}><a className="dropdown-item" href="#" onClick={(e) => {
                                        e.preventDefault();
                                        setValue("trackPipeType", type.color);
                                    }}>{type.color}</a></li>
                                ))
                            }
                        </ul>
                    </div>
                    {errors.trackPipeType && (
                        <div className="text-danger small mt-1">
                            {errors.trackPipeType.message as string}
                        </div>
                    )}
                </div>

                <div className="col-3">
                    <label className="form-label">Track Rate</label>
                    <div className="input-group mb-3">
                        <input 
                            type="number" 
                            className={`form-control ${errors.trackPipeRate ? 'is-invalid' : ''}`}
                            placeholder="Rate" 
                            aria-label="rate"
                            step="1.00"
                            onWheel={(e) => e.currentTarget.blur()}
                            {...register("trackPipeRate", { valueAsNumber: true })}
                        />
                        <span className="input-group-text">$</span>
                        {errors.trackPipeRate && (
                            <div className="invalid-feedback">
                                {errors.trackPipeRate.message as string}
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-2" style={{ marginTop: "2rem" }}>
                    <button className="btn btn-primary" type="button" onClick={showExtraTrackField}>
                        {ExtraTrackButtonLabel}
                    </button>
                </div>
                {showExtraTrack &&
                    <div className="col-3">
                        <label className="form-label">Extra Track Length</label>
                        <div className="input-group mb-3">
                            <input 
                                type="number" 
                                className={`form-control ${errors.extraTrackPipeLength ? 'is-invalid' : ''}`}
                                placeholder="Track Length" 
                                aria-label="track-length"
                                step="1.00"
                                onWheel={(e) => e.currentTarget.blur()}
                                {...register("extraTrackPipeLength", { valueAsNumber: true })}
                            />
                            <span className="input-group-text">Inch</span>
                            {errors.extraTrackPipeLength && (
                                <div className="invalid-feedback">
                                    {errors.extraTrackPipeLength.message as string}
                                </div>
                            )}
                        </div>
                    </div>
                }
            </div>
        </>
    );
}