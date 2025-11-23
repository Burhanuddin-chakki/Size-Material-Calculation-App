import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { PipeDetailType, PipeType } from "@/types";

interface LongBearingDetailProps {
  pipeType: PipeType[];
  pipeDetail: PipeDetailType[];
}
export const longBearingPipeSchema = z.object({
  longBearingPipeType: z.string(),
  longBearingPipeRate: z
    .number()
    .min(1, "Long Bearing rate must be greater than 0"),
  smallLongBearingPipeWeight: z
    .number()
    .min(1, "Long Bearing weight must be greater than 0"),
  bigLongBearingPipeWeight: z
    .number()
    .min(1, "Long Bearing weight must be greater than 0"),
  longBearingPipeSize180: z.boolean(),
  longBearingPipeSize192: z.boolean(),
  extraLongBearingPipeLength: z
    .array(z.number().min(1, "Extra track length must be greater than 0"))
    .optional(),
});
export default function LongBearingDetail(props: LongBearingDetailProps) {
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
    setValue("extraLongBearingPipeLength", []);
  };

  const addExtraTrackField = () => {
    setExtraTrackCount((prev) => prev + 1);
  };

  const removeExtraTrackField = () => {
    if (extraTrackCount > 1) {
      setExtraTrackCount((prev) => prev - 1);
      const currentValues = watch("extraLongBearingPipeLength") || [];
      setValue("extraLongBearingPipeLength", currentValues.slice(0, -1));
    }
  };

  useEffect(() => {
    const longBearingPipeDetail = props.pipeDetail.find(
      (pd) => pd.pipeType === "Long Bearing",
    );
    setValue(
      "smallLongBearingPipeWeight",
      longBearingPipeDetail?.pipeSizes[0].weight || 0,
    );
    setValue(
      "bigLongBearingPipeWeight",
      longBearingPipeDetail?.pipeSizes[1].weight || 0,
    );
  }, [props.pipeDetail, setValue]);

  const longBearingPipeType = watch("longBearingPipeType");

  useEffect(() => {
    setValue(
      "longBearingPipeRate",
      props.pipeType.find((pt) => pt.color === longBearingPipeType)
        ?.ratePerKg || 0,
    );
    setValue("longBearingPipeSize180", true);
    setValue("longBearingPipeSize192", true);
  }, [longBearingPipeType, setValue, props.pipeType]);

  return (
    <>
      <div className="row">
        <h3>Long Bearing</h3>
      </div>
      <div className="row mt-3">
        <div className="col-2">
          <label className="form-label">Long Bearing Type</label>
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {watch("longBearingPipeType")}
            </button>
            <ul className="dropdown-menu dropdown-menu-dark">
              {props.pipeType.map((type) => (
                <li key={type.id}>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setValue("longBearingPipeType", type.color);
                    }}
                  >
                    {type.color}
                  </a>
                </li>
              ))}
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
              className={`form-control ${errors.longBearingPipeRate ? "is-invalid" : ""}`}
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
              className={`form-control ${errors.smallLongBearingPipeWeight ? "is-invalid" : ""}`}
              placeholder="Weight"
              aria-label="weight"
              step="0.01"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("smallLongBearingPipeWeight", {
                valueAsNumber: true,
              })}
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
              className={`form-control ${errors.bigLongBearingPipeWeight ? "is-invalid" : ""}`}
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
              <label
                className="form-check-label"
                htmlFor="longBearingPipeSize180"
              >
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
              <label
                className="form-check-label"
                htmlFor="longBearingPipeSize192"
              >
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
                    Extra Long-Bearing {index + 1}
                  </label>
                  <div className="input-group mb-3">
                    <input
                      type="number"
                      className={`form-control ${(errors.extraLongBearingPipeLength as any)?.[index] ? "is-invalid" : ""}`}
                      placeholder="Long-Bearing Length"
                      aria-label="long-bearing-length"
                      step="1.00"
                      onWheel={(e) => e.currentTarget.blur()}
                      {...register(`extraLongBearingPipeLength.${index}`, {
                        valueAsNumber: true,
                      })}
                    />
                    <span className="input-group-text">Inch</span>
                    {(errors.extraLongBearingPipeLength as any)?.[index] && (
                      <div className="invalid-feedback">
                        {
                          (errors.extraLongBearingPipeLength as any)[index]
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
                + Add Long-Bearing
              </button>
              {extraTrackCount > 1 && (
                <button
                  className="btn btn-danger btn-sm"
                  type="button"
                  onClick={removeExtraTrackField}
                >
                  - Remove Long-Bearing
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
