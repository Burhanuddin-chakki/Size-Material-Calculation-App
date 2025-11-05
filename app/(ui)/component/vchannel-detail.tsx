import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { PipeType } from "../../common/interfaces";
import z from "zod";

interface VChannelDetailProps {
    pipeType: PipeType[];
}

export const vChannelSchema = z.object({
    vChannelType: z.string(),
    vChannelRate: z.number().min(1, "V-Channel rate must be greater than 0"),
    vChannelExtraLength: z.number().optional(),
});

export default function VChannelDetail(props: VChannelDetailProps) {
    const { register, formState: { errors }, setValue, watch } = useFormContext();
    const [showExtraTrack, setShowExtraTrack] = useState(false);

    const ExtraTrackButtonLabel = showExtraTrack ? "Hide Extra Track" : "Show Extra Track";

    const showExtraTrackField = () => {
        setShowExtraTrack(!showExtraTrack);
        setValue("vChannelExtraLength", 0);
    }

    useEffect(() => {
        setValue("vChannelRate", props.pipeType.find(pt => pt.color === watch("vChannelType"))?.ratePerKg || 0);
    }, [watch("vChannelType")]);

    return (
        <>
            <div className="row">
                <h3>V-Channel</h3>
            </div>
            <div className="row mt-3">
                <div className="col-3">
                    <label className="form-label">V-Channel Type</label>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {watch("vChannelType")}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark">
                            {
                                props.pipeType.map((type) => (
                                    <li key={type.id}><a className="dropdown-item" href="#" onClick={(e) => {
                                        e.preventDefault();
                                        setValue("vChannelType", type.color);
                                    }}>{type.color}</a></li>
                                ))
                            }
                        </ul>
                    </div>
                    {errors.vChannelType && (
                        <div className="text-danger small mt-1">
                            {errors.vChannelType.message as string}
                        </div>
                    )}
                </div>

                <div className="col-3">
                    <label className="form-label">V-Channel Rate</label>
                    <div className="input-group mb-3">
                        <input 
                            type="number" 
                            className={`form-control ${errors.vChannelRate ? 'is-invalid' : ''}`}
                            placeholder="Rate" 
                            aria-label="rate"
                            step="1.00"
                            onWheel={(e) => e.currentTarget.blur()}
                            {...register("vChannelRate", { valueAsNumber: true })}
                        />
                        <span className="input-group-text">$</span>
                        {errors.vChannelRate && (
                            <div className="invalid-feedback">
                                {errors.vChannelRate.message as string}
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
                        <label className="form-label">Extra V-Channel Length</label>
                        <div className="input-group mb-3">
                            <input 
                                type="number" 
                                className={`form-control ${errors.vChannelExtraLength ? 'is-invalid' : ''}`}
                                placeholder="V-Channel Length" 
                                aria-label="V-Channel-Length"
                                step="1.00"
                                onWheel={(e) => e.currentTarget.blur()}
                                {...register("vChannelExtraLength", { valueAsNumber: true })}
                            />
                            <span className="input-group-text">Inch</span>
                            {errors.vChannelExtraLength && (
                                <div className="invalid-feedback">
                                    {errors.vChannelExtraLength.message as string}
                                </div>
                            )}
                        </div>
                    </div>
                }
            </div>
        </>
    );
}