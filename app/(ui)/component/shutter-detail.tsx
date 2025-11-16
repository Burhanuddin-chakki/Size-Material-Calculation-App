import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { PipeDetailType, PipeType } from "../../common/interfaces";

interface ShutterDetailProps {
    pipeType: PipeType[];
    pipeDetail: PipeDetailType[];
}

export const shutterPipeSchema = z.object({
    shutterTrackType: z.string(),
    shutterTrackRate: z.number().min(1, "Shutter track rate must be greater than 0"),
    smallShutterTrackWeight: z.number().min(1, "Shutter track weight must be greater than 0"),
    bigShutterTrackWeight: z.number().min(1, "Shutter track weight must be greater than 0"),
    shutterPipeSize180: z.boolean(),
    shutterPipeSize192: z.boolean(),
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
        const shutterPipeDetail = props.pipeDetail.find(pd => pd.pipeType === 'Shutter');
        setValue("smallShutterTrackWeight", shutterPipeDetail?.pipeSizes[0].weight || 0);
        setValue("bigShutterTrackWeight", shutterPipeDetail?.pipeSizes[1].weight || 0);
    }, [watch("shutterTrackType")]);

    useEffect(() => {
        setValue("shutterTrackRate", props.pipeType.find(pt => pt.color === watch("shutterTrackType"))?.ratePerKg || 0);
        setValue("shutterPipeSize180", true);
        setValue("shutterPipeSize192", true);
    }, [watch("shutterTrackType")]);

    return (
        <>
            <div className="row">
                <h3>Shutter</h3>
            </div>
            <div className="row mt-3">
                <div className="col-2">
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

                <div className="col-2">
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

                <div className="col-2">
                    <label className="form-label">Shutter Track Weight (KG)</label>
                    <div className="input-group mb-3">
                        <input
                            type="number"
                            className={`form-control ${errors.smallShutterTrackWeight ? 'is-invalid' : ''}`}
                            placeholder="Weight"
                            aria-label="weight"
                            step="0.01"
                            onWheel={(e) => e.currentTarget.blur()}
                            {...register("smallShutterTrackWeight", { valueAsNumber: true })}
                        />
                        <span className="input-group-text">180"</span>
                        {errors.smallShutterTrackWeight && (
                            <div className="invalid-feedback">
                                {errors.smallShutterTrackWeight.message as string}
                            </div>
                        )}
                    </div>
                    <div className="input-group mb-3">
                        <input
                            type="number"
                            className={`form-control ${errors.bigShutterTrackWeight ? 'is-invalid' : ''}`}
                            placeholder="Weight"
                            aria-label="weight"
                            step="0.01"
                            onWheel={(e) => e.currentTarget.blur()}
                            {...register("bigShutterTrackWeight", { valueAsNumber: true })}
                        />
                        <span className="input-group-text">192"</span>
                        {errors.bigShutterTrackWeight && (
                            <div className="invalid-feedback">
                                {errors.bigShutterTrackWeight.message as string}
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
                                id="shutterPipeSize180"
                                {...register("shutterPipeSize180")}
                            />
                            <label className="form-check-label" htmlFor="shutterPipeSize180">
                                180"
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="shutterPipeSize192"
                                {...register("shutterPipeSize192")}
                            />
                            <label className="form-check-label" htmlFor="shutterPipeSize192">
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