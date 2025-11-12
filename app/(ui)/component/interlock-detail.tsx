import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { PipeType } from "../../common/interfaces";

interface InterLockDetailProps {
    pipeType: PipeType[];
}

export const interLockPipeSchema = z.object({
    interLockType: z.string(),
    interLockRate: z.number().min(1, "InterLock rate must be greater than 0"),
    interLockWeight: z.number().min(1, "InterLock weight must be greater than 0"),
    interLockPipeSize180: z.boolean(),
    interLockPipeSize192: z.boolean(),
    interLockExtraLength: z.number().optional(),
});

export default function InterLockDetail(props: InterLockDetailProps) {
    const { register, formState: { errors }, setValue, watch } = useFormContext();
    const [showExtraTrack, setShowExtraTrack] = useState(false);

    const ExtraTrackButtonLabel = showExtraTrack ? "Hide Extra Track" : "Show Extra Track";

    const showExtraTrackField = () => {
        setShowExtraTrack(!showExtraTrack);
        setValue("interLockExtraLength", 0);
    }

    useEffect(() => {
        setValue("interLockRate", props.pipeType.find(pt => pt.color === watch("interLockType"))?.ratePerKg || 0);
        setValue("interLockPipeSize180", true);
        setValue("interLockPipeSize192", true);
    }, [watch("interLockType")]);

    return (
        <>
            <div className="row">
                <h3>InterLock</h3>
            </div>
            <div className="row mt-3">
                <div className="col-2">
                    <label className="form-label">Track Type</label>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {watch("interLockType")}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark">
                            {
                                props.pipeType.map((type) => (
                                    <li key={type.id}><a className="dropdown-item" href="#" onClick={(e) => {
                                        e.preventDefault();
                                        setValue("interLockType", type.color);
                                    }}>{type.color}</a></li>
                                ))
                            }
                        </ul>
                    </div>
                    {errors.interLockType && (
                        <div className="text-danger small mt-1">
                            {errors.interLockType.message as string}
                        </div>
                    )}
                </div>

                <div className="col-2">
                    <label className="form-label">Track Rate</label>
                    <div className="input-group mb-3">
                        <input
                            type="number"
                            className={`form-control ${errors.interLockRate ? 'is-invalid' : ''}`}
                            placeholder="Rate"
                            aria-label="rate"
                            step="1.00"
                            onWheel={(e) => e.currentTarget.blur()}
                            {...register("interLockRate", { valueAsNumber: true })}
                        />
                        <span className="input-group-text">$</span>
                        {errors.interLockRate && (
                            <div className="invalid-feedback">
                                {errors.interLockRate.message as string}
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-2">
                    <label className="form-label">InterLock Weight</label>
                    <div className="input-group mb-3">
                        <input
                            type="number"
                            className={`form-control ${errors.interLockWeight ? 'is-invalid' : ''}`}
                            placeholder="Weight"
                            aria-label="weight"
                            step="1.00"
                            onWheel={(e) => e.currentTarget.blur()}
                            {...register("interLockWeight", { valueAsNumber: true })}
                        />
                        <span className="input-group-text">Kg</span>
                        {errors.interLockWeight && (
                            <div className="invalid-feedback">
                                {errors.interLockWeight.message as string}
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
                                id="interLockPipeSize180"
                                {...register("interLockPipeSize180")}
                            />
                            <label className="form-check-label" htmlFor="interLockPipeSize180">
                                180"
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="interLockPipeSize192"
                                {...register("interLockPipeSize192")}
                            />
                            <label className="form-check-label" htmlFor="interLockPipeSize192">
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
                                className={`form-control ${errors.interLockExtraLength ? 'is-invalid' : ''}`}
                                placeholder="Track Length"
                                aria-label="track-length"
                                step="1.00"
                                onWheel={(e) => e.currentTarget.blur()}
                                {...register("interLockExtraLength", { valueAsNumber: true })}
                            />
                            <span className="input-group-text">Inch</span>
                            {errors.interLockExtraLength && (
                                <div className="invalid-feedback">
                                    {errors.interLockExtraLength.message as string}
                                </div>
                            )}
                        </div>
                    </div>
                }
            </div>
        </>
    );
}