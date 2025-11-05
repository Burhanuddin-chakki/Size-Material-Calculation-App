import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { PipeType } from "../../common/interfaces";

interface ShutterDetailProps {
    pipeType: PipeType[];
}

export const shutterPipeSchema = z.object({
    shutterTrackType: z.string(),
    shutterTrackRate: z.number().min(1, "Shutter track rate must be greater than 0"),
    shutterExtraTrackLength: z.number().optional(),
});

export default function ShutterDetail(props: ShutterDetailProps) {
    const { register, formState: { errors }, setValue, watch } = useFormContext();
    const [showExtraTrack, setShowExtraTrack] = useState(false);

    const ExtraTrackButtonLabel = showExtraTrack ? "Hide Extra Track" : "Show Extra Track";

    const showExtraTrackField = () => {
        setShowExtraTrack(!showExtraTrack);
        setValue("shutterExtraTrackLength", 0);
    }

    useEffect(() => {
            setValue("shutterTrackRate", props.pipeType.find(pt => pt.color === watch("shutterTrackType"))?.ratePerKg || 0);
        }, [watch("shutterTrackType")]);

    return (
        <>
            <div className="row">
                <h3>Shutter</h3>
            </div>
            <div className="row mt-3">
                <div className="col-3">
                    <label className="form-label">Shutter Track Type</label>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {watch("shutterTrackType")}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark">
                            {
                                props.pipeType.map((type) => (
                                    <li key={type.id}><a className="dropdown-item" href="#" onClick={(e) => {
                                        e.preventDefault();
                                        setValue("shutterTrackType", type.color);
                                    }}>{type.color}</a></li>
                                ))
                            }
                        </ul>
                    </div>
                    {errors.shutterTrackType && (
                        <div className="text-danger small mt-1">
                            {errors.shutterTrackType.message as string}
                        </div>
                    )}
                </div>

                <div className="col-3">
                    <label className="form-label">Shutter Track Rate</label>
                    <div className="input-group mb-3">
                        <input
                            type="number"
                            className={`form-control ${errors.shutterTrackRate ? 'is-invalid' : ''}`}
                            placeholder="Rate"
                            aria-label="rate"
                            step="1.00"
                            onWheel={(e) => e.currentTarget.blur()}
                            {...register("shutterTrackRate", { valueAsNumber: true })}
                        />
                        <span className="input-group-text">$</span>
                        {errors.shutterTrackRate && (
                            <div className="invalid-feedback">
                                {errors.shutterTrackRate.message as string}
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
                                className={`form-control ${errors.shutterExtraTrackLength ? 'is-invalid' : ''}`}
                                placeholder="Track Length"
                                aria-label="track-length"
                                step="1.00"
                                onWheel={(e) => e.currentTarget.blur()}
                                {...register("shutterExtraTrackLength", { valueAsNumber: true })}
                            />
                            <span className="input-group-text">Inch</span>
                            {errors.shutterExtraTrackLength && (
                                <div className="invalid-feedback">
                                    {errors.shutterExtraTrackLength.message as string}
                                </div>
                            )}
                        </div>
                    </div>
                }
            </div>
        </>
    );
}