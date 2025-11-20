import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { PipeDetailType, PipeType } from "../../common/interfaces";

interface HandleDetailProps {
  pipeType: PipeType[];
  pipeDetail: PipeDetailType[];
}
export const handlePipeSchema = z.object({
  handlePipeType: z.string(),
  handlePipeRate: z.number().min(1, "Handle rate must be greater than 0"),
  smallHandlePipeWeight: z
    .number()
    .min(1, "Handle weight must be greater than 0"),
  bigHandlePipeWeight: z
    .number()
    .min(1, "Handle weight must be greater than 0"),
  handlePipeSize180: z.boolean(),
  handlePipeSize192: z.boolean(),
  extraHandlePipeLength: z
    .array(z.number().min(1, "Extra track length must be greater than 0"))
    .optional(),
});
export default function HandleDetail(props: HandleDetailProps) {
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
    setValue("extraHandlePipeLength", []);
  };

  const addExtraTrackField = () => {
    setExtraTrackCount((prev) => prev + 1);
  };

  const removeExtraTrackField = () => {
    if (extraTrackCount > 1) {
      setExtraTrackCount((prev) => prev - 1);
      const currentValues = watch("extraHandlePipeLength") || [];
      setValue("extraHandlePipeLength", currentValues.slice(0, -1));
    }
  };

  useEffect(() => {
    const handlePipeDetail = props.pipeDetail.find(
      (pd) => pd.pipeType === "Handle",
    );
    setValue("smallHandlePipeWeight", handlePipeDetail?.pipeSizes[0].weight || 0);
    setValue("bigHandlePipeWeight", handlePipeDetail?.pipeSizes[1].weight || 0);
  }, [props.pipeDetail, setValue]);

  const handlePipeType = watch("handlePipeType");

  useEffect(() => {
    setValue(
      "handlePipeRate",
      props.pipeType.find((pt) => pt.color === handlePipeType)
        ?.ratePerKg || 0,
    );
    setValue("handlePipeSize180", true);
    setValue("handlePipeSize192", true);
  }, [handlePipeType, setValue, props.pipeType]);

  return (
    <>
      <div className="row">
        <h3>Handle</h3>
      </div>
      <div className="row mt-3">
        <div className="col-2">
          <label className="form-label">Handle Type</label>
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {watch("handlePipeType")}
            </button>
            <ul className="dropdown-menu dropdown-menu-dark">
              {props.pipeType.map((type) => (
                <li key={type.id}>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setValue("handlePipeType", type.color);
                    }}
                  >
                    {type.color}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {errors.handlePipeType && (
            <div className="text-danger small mt-1">
              {errors.handlePipeType.message as string}
            </div>
          )}
        </div>

        <div className="col-2">
          <label className="form-label">Track Rate</label>
          <div className="input-group mb-3">
            <input
              type="number"
              className={`form-control ${errors.handlePipeRate ? "is-invalid" : ""}`}
              placeholder="Rate"
              aria-label="rate"
              step="1.00"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("handlePipeRate", { valueAsNumber: true })}
            />
            <span className="input-group-text">$</span>
            {errors.handlePipeRate && (
              <div className="invalid-feedback">
                {errors.handlePipeRate.message as string}
              </div>
            )}
          </div>
        </div>
        <div className="col-2">
          <label className="form-label">Track Weight (KG)</label>
          <div className="input-group mb-3">
            <input
              type="number"
              className={`form-control ${errors.smallHandlePipeWeight ? "is-invalid" : ""}`}
              placeholder="Weight"
              aria-label="weight"
              step="0.01"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("smallHandlePipeWeight", { valueAsNumber: true })}
            />
            <span className="input-group-text">180"</span>
            {errors.smallHandlePipeWeight && (
              <div className="invalid-feedback">
                {errors.smallHandlePipeWeight.message as string}
              </div>
            )}
          </div>
          <div className="input-group mb-3">
            <input
              type="number"
              className={`form-control ${errors.bigHandlePipeWeight ? "is-invalid" : ""}`}
              placeholder="Weight"
              aria-label="weight"
              step="0.01"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("bigHandlePipeWeight", { valueAsNumber: true })}
            />
            <span className="input-group-text">192"</span>
            {errors.bigHandlePipeWeight && (
              <div className="invalid-feedback">
                {errors.bigHandlePipeWeight.message as string}
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
                id="handlePipeSize180"
                {...register("handlePipeSize180")}
              />
              <label className="form-check-label" htmlFor="handlePipeSize180">
                180"
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="handlePipeSize192"
                {...register("handlePipeSize192")}
              />
              <label className="form-check-label" htmlFor="handlePipeSize192">
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
                  <label className="form-label">Extra Handle {index + 1}</label>
                  <div className="input-group mb-3">
                    <input
                      type="number"
                      className={`form-control ${(errors.extraHandlePipeLength as any)?.[index] ? "is-invalid" : ""}`}
                      placeholder="Handle Length"
                      aria-label="handle-length"
                      step="1.00"
                      onWheel={(e) => e.currentTarget.blur()}
                      {...register(`extraHandlePipeLength.${index}`, {
                        valueAsNumber: true,
                      })}
                    />
                    <span className="input-group-text">Inch</span>
                    {(errors.extraHandlePipeLength as any)?.[index] && (
                      <div className="invalid-feedback">
                        {
                          (errors.extraHandlePipeLength as any)[index]
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
                + Add Extra Handle
              </button>
              {extraTrackCount > 1 && (
                <button
                  className="btn btn-danger btn-sm"
                  type="button"
                  onClick={removeExtraTrackField}
                >
                  - Remove Extra Handle
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
