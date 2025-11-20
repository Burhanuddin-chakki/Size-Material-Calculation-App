import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { PipeDetailType, PipeType } from "../../common/interfaces";

interface TrackTopDetailProps {
  pipeType: PipeType[];
  pipeDetail: PipeDetailType[];
}
export const trackTopPipeSchema = z.object({
  trackTopPipeType: z.string(),
  trackTopPipeRate: z.number().min(1, "Track rate must be greater than 0"),
  smallTrackTopPipeWeight: z
    .number()
    .min(1, "Track weight must be greater than 0"),
  bigTrackTopPipeWeight: z
    .number()
    .min(1, "Track weight must be greater than 0"),
  trackTopPipeSize180: z.boolean(),
  trackTopPipeSize192: z.boolean(),
  extraTrackTopPipeLength: z
    .array(z.number().min(1, "Extra track length must be greater than 0"))
    .optional(),
});
export default function TrackTopDetail(props: TrackTopDetailProps) {
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
    setValue("extraTrackTopPipeLength", []);
  };

  const addExtraTrackField = () => {
    setExtraTrackCount((prev) => prev + 1);
  };

  const removeExtraTrackField = () => {
    if (extraTrackCount > 1) {
      setExtraTrackCount((prev) => prev - 1);
      const currentValues = watch("extraTrackTopPipeLength") || [];
      setValue("extraTrackTopPipeLength", currentValues.slice(0, -1));
    }
  };

  useEffect(() => {
    const trackTopPipeDetail = props.pipeDetail.find(
      (pd) => pd.pipeType === "Track Top",
    );
    setValue(
      "smallTrackTopPipeWeight",
      trackTopPipeDetail?.pipeSizes[0].weight || 0,
    );
    setValue(
      "bigTrackTopPipeWeight",
      trackTopPipeDetail?.pipeSizes[1].weight || 0,
    );
  }, [props.pipeDetail, setValue]);

  const trackTopPipeType = watch("trackTopPipeType");

  useEffect(() => {
    setValue(
      "trackTopPipeRate",
      props.pipeType.find((pt) => pt.color === trackTopPipeType)?.ratePerKg ||
        0,
    );
    setValue("trackTopPipeSize180", true);
    setValue("trackTopPipeSize192", true);
  }, [trackTopPipeType, setValue, props.pipeType]);

  return (
    <>
      <div className="row">
        <h3>Track Top</h3>
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
              {watch("trackTopPipeType")}
            </button>
            <ul className="dropdown-menu dropdown-menu-dark">
              {props.pipeType.map((type) => (
                <li key={type.id}>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setValue("trackTopPipeType", type.color);
                    }}
                  >
                    {type.color}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {errors.trackTopPipeType && (
            <div className="text-danger small mt-1">
              {errors.trackTopPipeType.message as string}
            </div>
          )}
        </div>

        <div className="col-2">
          <label className="form-label">Track Rate</label>
          <div className="input-group mb-3">
            <input
              type="number"
              className={`form-control ${errors.trackTopPipeRate ? "is-invalid" : ""}`}
              placeholder="Rate"
              aria-label="rate"
              step="1.00"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("trackTopPipeRate", { valueAsNumber: true })}
            />
            <span className="input-group-text">$</span>
            {errors.trackTopPipeRate && (
              <div className="invalid-feedback">
                {errors.trackTopPipeRate.message as string}
              </div>
            )}
          </div>
        </div>
        <div className="col-2">
          <label className="form-label">Track Weight (KG)</label>
          <div className="input-group mb-3">
            <input
              type="number"
              className={`form-control ${errors.smallTrackTopPipeWeight ? "is-invalid" : ""}`}
              placeholder="Weight"
              aria-label="weight"
              step="0.01"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("smallTrackTopPipeWeight", { valueAsNumber: true })}
            />
            <span className="input-group-text">180"</span>
            {errors.smallTrackTopPipeWeight && (
              <div className="invalid-feedback">
                {errors.smallTrackTopPipeWeight.message as string}
              </div>
            )}
          </div>
          <div className="input-group mb-3">
            <input
              type="number"
              className={`form-control ${errors.bigTrackTopPipeWeight ? "is-invalid" : ""}`}
              placeholder="Weight"
              aria-label="weight"
              step="0.01"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("bigTrackTopPipeWeight", { valueAsNumber: true })}
            />
            <span className="input-group-text">192"</span>
            {errors.bigTrackTopPipeWeight && (
              <div className="invalid-feedback">
                {errors.bigTrackTopPipeWeight.message as string}
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
                id="trackTopPipeSize180"
                {...register("trackTopPipeSize180")}
              />
              <label className="form-check-label" htmlFor="trackTopPipeSize180">
                180"
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="trackTopPipeSize192"
                {...register("trackTopPipeSize192")}
              />
              <label className="form-check-label" htmlFor="trackTopPipeSize192">
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
                  <label className="form-label">
                    Extra Track Top {index + 1}
                  </label>
                  <div className="input-group mb-3">
                    <input
                      type="number"
                      className={`form-control ${(errors.extraTrackTopPipeLength as any)?.[index] ? "is-invalid" : ""}`}
                      placeholder="Track Top Length"
                      aria-label="track-top-length"
                      step="1.00"
                      onWheel={(e) => e.currentTarget.blur()}
                      {...register(`extraTrackTopPipeLength.${index}`, {
                        valueAsNumber: true,
                      })}
                    />
                    <span className="input-group-text">Inch</span>
                    {(errors.extraTrackTopPipeLength as any)?.[index] && (
                      <div className="invalid-feedback">
                        {
                          (errors.extraTrackTopPipeLength as any)[index]
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
                + Add Track Top
              </button>
              {extraTrackCount > 1 && (
                <button
                  className="btn btn-danger btn-sm"
                  type="button"
                  onClick={removeExtraTrackField}
                >
                  - Remove Track Top
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
