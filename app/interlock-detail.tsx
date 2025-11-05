import { useState } from "react";
import { useFormContext } from "react-hook-form";

interface InterLockDetailProps {
    allInterLockTypes: string[];
}

export default function InterLockDetail(props: InterLockDetailProps ) {
    const { register, formState: { errors }, setValue, watch } = useFormContext();
    const [showExtraTrack, setShowExtraTrack] = useState(false);

    const ExtraTrackButtonLabel = showExtraTrack ? "Hide Extra Track" : "Show Extra Track";

    const showExtraTrackField = () => {
        setShowExtraTrack(!showExtraTrack);
        setValue("interLockExtraLength", 0);
    }

    return (
        <>
            <div className="row">
                <h3>InterLock</h3>
            </div>
            <div className="row mt-3">
                <div className="col-3">
                    <label className="form-label">Track Type</label>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {watch("interLockType")}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark">
                            {
                                props.allInterLockTypes.map((type) => (
                                    <li key={type}><a className="dropdown-item" href="#" onClick={(e) => {
                                        e.preventDefault();
                                        setValue("interLockType", type);
                                    }}>{type}</a></li>
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

                <div className="col-3">
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