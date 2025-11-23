import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { PipeDetailType, PipeType } from "@/types";

interface TrackDetailProps {
  pipeType: PipeType[];
  pipeDetail: PipeDetailType[];
}
export const trackPipeSchema = z.object({
  trackPipeType: z.string(),
  trackPipeRate: z.number().min(1, "Track rate must be greater than 0"),
  smallTrackPipeWeight: z
    .number()
    .min(1, "Track weight must be greater than 0"),
  bigTrackPipeWeight: z.number().min(1, "Track weight must be greater than 0"),
  trackPipeSize180: z.boolean(),
  trackPipeSize192: z.boolean(),
  extraTrackPipeLength: z
    .array(z.number().min(1, "Extra track length must be greater than 0"))
    .optional(),
});
export default function TrackDetail(props: TrackDetailProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const [showExtraTrack, setShowExtraTrack] = useState(false);
  const [extraTrackCount, setExtraTrackCount] = useState(1);

  const ExtraTrackButtonLabel = showExtraTrack
    ? "Hide Extra Track"
    : "Show Extra Track";

  const showExtraTrackField = () => {
    setShowExtraTrack(!showExtraTrack);
    setValue("extraTrackPipeLength", []);
  };

  const addExtraTrackField = () => {
    setExtraTrackCount((prev) => prev + 1);
  };

  const removeExtraTrackField = () => {
    if (extraTrackCount > 1) {
      setExtraTrackCount((prev) => prev - 1);
      const currentValues = watch("extraTrackPipeLength") || [];
      setValue("extraTrackPipeLength", currentValues.slice(0, -1));
    }
  };

  useEffect(() => {
    const trackPipeDetail = props.pipeDetail.find(
      (pd) => pd.pipeType === "Track",
    );
    setValue("smallTrackPipeWeight", trackPipeDetail?.pipeSizes[0].weight || 0);
    setValue("bigTrackPipeWeight", trackPipeDetail?.pipeSizes[1].weight || 0);
  }, [props.pipeDetail, setValue]);

  const trackPipeType = watch("trackPipeType");

  useEffect(() => {
    setValue(
      "trackPipeRate",
      props.pipeType.find((pt) => pt.color === trackPipeType)?.ratePerKg || 0,
    );
    setValue("trackPipeSize180", true);
    setValue("trackPipeSize192", true);
  }, [trackPipeType, setValue, props.pipeType]);

  return (
    <>
      <div className="row">
        <h3>Track</h3>
      </div>
      <div className="row mt-3">
        <div className="col-2">
          <label className="form-label">Track Type</label>
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {watch("trackPipeType")}
            </button>
            <ul className="dropdown-menu dropdown-menu-dark">
              {props.pipeType.map((type) => (
                <li key={type.id}>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setValue("trackPipeType", type.color);
                    }}
                  >
                    {type.color}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {errors.trackPipeType && (
            <div className="text-danger small mt-1">
              {errors.trackPipeType.message as string}
            </div>
          )}
        </div>

        <div className="col-2">
          <label className="form-label">Track Rate</label>
          <div className="input-group mb-3">
            <input
              type="number"
              className={`form-control ${errors.trackPipeRate ? "is-invalid" : ""}`}
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
        <div className="col-2">
          <label className="form-label">Track Weight (KG)</label>
          <div className="input-group mb-3">
            <input
              type="number"
              className={`form-control ${errors.smallTrackPipeWeight ? "is-invalid" : ""}`}
              placeholder="Weight"
              aria-label="weight"
              step="0.01"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("smallTrackPipeWeight", { valueAsNumber: true })}
            />
            <span className="input-group-text">180"</span>
            {errors.smallTrackPipeWeight && (
              <div className="invalid-feedback">
                {errors.smallTrackPipeWeight.message as string}
              </div>
            )}
          </div>
          <div className="input-group mb-3">
            <input
              type="number"
              className={`form-control ${errors.bigTrackPipeWeight ? "is-invalid" : ""}`}
              placeholder="Weight"
              aria-label="weight"
              step="0.01"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("bigTrackPipeWeight", { valueAsNumber: true })}
            />
            <span className="input-group-text">192"</span>
            {errors.bigTrackPipeWeight && (
              <div className="invalid-feedback">
                {errors.bigTrackPipeWeight.message as string}
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
                id="trackPipeSize180"
                {...register("trackPipeSize180")}
              />
              <label className="form-check-label" htmlFor="trackPipeSize180">
                180"
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="trackPipeSize192"
                {...register("trackPipeSize192")}
              />
              <label className="form-check-label" htmlFor="trackPipeSize192">
                192"
              </label>
            </div>
          </div>
        </div>

        <div className="col-auto" style={{ marginTop: "2rem" }}>
          <button
            className="btn btn-primary"
            type="button"
            onClick={showExtraTrackField}
          >
            {ExtraTrackButtonLabel}
          </button>
        </div>
        {showExtraTrack && (
          <>
            <div className="row">
              {Array.from({ length: extraTrackCount }).map((_, index) => (
                <div className="col-2" key={index}>
                  <label className="form-label">Extra Track {index + 1}</label>
                  <div className="input-group mb-3">
                    <input
                      type="number"
                      className={`form-control ${(errors.extraTrackPipeLength as any)?.[index] ? "is-invalid" : ""}`}
                      placeholder="Track Length"
                      aria-label="track-length"
                      step="1.00"
                      onWheel={(e) => e.currentTarget.blur()}
                      {...register(`extraTrackPipeLength.${index}`, {
                        valueAsNumber: true,
                      })}
                    />
                    <span className="input-group-text">Inch</span>
                    {(errors.extraTrackPipeLength as any)?.[index] && (
                      <div className="invalid-feedback">
                        {
                          (errors.extraTrackPipeLength as any)[index]
                            ?.message as string
                        }
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="col-12 mt-2">
              <button
                className="btn btn-success btn-sm me-2"
                type="button"
                onClick={addExtraTrackField}
              >
                + Add Extra Track
              </button>
              {extraTrackCount > 1 && (
                <button
                  className="btn btn-danger btn-sm"
                  type="button"
                  onClick={removeExtraTrackField}
                >
                  - Remove Extra Track
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
