import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { PipeDetailType, PipeType } from "../../common/interfaces";

interface InterLockDetailProps {
    pipeType: PipeType[];
    pipeDetail: PipeDetailType[];
}

export const interLockPipeSchema = z.object({
    interLockType: z.string(),
    interLockRate: z.number().min(1, "InterLock rate must be greater than 0"),
    smallInterLockWeight: z.number().min(1, "InterLock weight must be greater than 0"),
    bigInterLockWeight: z.number().min(1, "InterLock weight must be greater than 0"),
    interLockPipeSize180: z.boolean(),
    interLockPipeSize192: z.boolean(),
    interLockExtraLength: z.array(z.number().min(1, "Extra track length must be greater than 0")).optional(),
});

export default function InterLockDetail(props: InterLockDetailProps) {
    const { register, formState: { errors }, setValue, watch } = useFormContext();
    const [showExtraTrack, setShowExtraTrack] = useState(false);
    const [extraTrackCount, setExtraTrackCount] = useState(1);

    const ExtraTrackButtonLabel = showExtraTrack ? "Hide Extra Track" : "Show Extra Track";

    const showExtraTrackField = () => {
        setShowExtraTrack(!showExtraTrack);
        setValue("interLockExtraLength", []);
    }

    const addExtraTrackField = () => {
        setExtraTrackCount(prev => prev + 1);
    }

    const removeExtraTrackField = () => {
        if (extraTrackCount > 1) {
            setExtraTrackCount(prev => prev - 1);
            const currentValues = watch("interLockExtraLength") || [];
            setValue("interLockExtraLength", currentValues.slice(0, -1));
        }
    }

    useEffect(() => {
        const interLockPipeDetail = props.pipeDetail.find(pd => pd.pipeType === 'InterLock');
        setValue("smallInterLockWeight", interLockPipeDetail?.pipeSizes[0].weight || 0);
        setValue("bigInterLockWeight", interLockPipeDetail?.pipeSizes[1].weight || 0);
    }, [watch("interLockType")]);

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
                    <label className="form-label">InterLock Weight (KG)</label>
                    <div className="input-group mb-3">
                        <input
                            type="number"
                            className={`form-control ${errors.smallInterLockWeight ? 'is-invalid' : ''}`}
                            placeholder="Weight"
                            aria-label="weight"
                            step="0.01"
                            onWheel={(e) => e.currentTarget.blur()}
                            {...register("smallInterLockWeight", { valueAsNumber: true })}
                        />
                        <span className="input-group-text">180"</span>
                        {errors.smallInterLockWeight && (
                            <div className="invalid-feedback">
                                {errors.smallInterLockWeight.message as string}
                            </div>
                        )}
                    </div>
                    <div className="input-group mb-3">
                        <input
                            type="number"
                            className={`form-control ${errors.bigInterLockWeight ? 'is-invalid' : ''}`}
                            placeholder="Weight"
                            aria-label="weight"
                            step="0.01"
                            onWheel={(e) => e.currentTarget.blur()}
                            {...register("bigInterLockWeight", { valueAsNumber: true })}
                        />
                        <span className="input-group-text">192"</span>
                        {errors.bigInterLockWeight && (
                            <div className="invalid-feedback">
                                {errors.bigInterLockWeight.message as string}
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
                    <>
                        <div className="row">
                            {Array.from({ length: extraTrackCount }).map((_, index) => (
                                <div className="col-2" key={index}>
                                    <label className="form-label">Extra InterLock {index + 1}</label>
                                    <div className="input-group mb-3">
                                        <input
                                            type="number"
                                            className={`form-control ${(errors.interLockExtraLength as any)?.[index] ? 'is-invalid' : ''}`}
                                            placeholder="InterLock Length"
                                            aria-label="interlock-length"
                                            step="1.00"
                                            onWheel={(e) => e.currentTarget.blur()}
                                            {...register(`interLockExtraLength.${index}`, { valueAsNumber: true })}
                                        />
                                        <span className="input-group-text">Inch</span>
                                        {(errors.interLockExtraLength as any)?.[index] && (
                                            <div className="invalid-feedback">
                                                {(errors.interLockExtraLength as any)[index]?.message as string}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>


                        <div className="col-12 mt-2">
                            <button className="btn btn-success btn-sm me-2" type="button" onClick={addExtraTrackField}>
                                + Add Extra InterLock
                            </button>
                            {extraTrackCount > 1 && (
                                <button className="btn btn-danger btn-sm" type="button" onClick={removeExtraTrackField}>
                                    - Remove Extra InterLock
                                </button>
                            )}
                        </div>
                    </>
                }
            </div>
        </>
    );
}