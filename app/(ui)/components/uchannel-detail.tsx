import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { PipeDetailType, PipeType } from "@/types";

interface UChannelDetailProps {
  pipeType: PipeType[];
  pipeDetail: PipeDetailType[];
}

export const uChannelPipeSchema = z.object({
  uChannelType: z.string(),
  uChannelRate: z.number().min(1, "UChannel rate must be greater than 0"),
  smallUChannelWeight: z
    .number()
    .min(1, "UChannel weight must be greater than 0"),
  bigUChannelWeight: z
    .number()
    .min(1, "UChannel weight must be greater than 0"),
  uChannelPipeSize180: z.boolean(),
  uChannelPipeSize192: z.boolean(),
  uChannelExtraLength: z
    .array(z.number().min(1, "Extra track length must be greater than 0"))
    .optional(),
});

export default function UChannelDetail(props: UChannelDetailProps) {
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
    setValue("uChannelExtraLength", []);
  };

  const addExtraTrackField = () => {
    setExtraTrackCount((prev) => prev + 1);
  };

  const removeExtraTrackField = () => {
    if (extraTrackCount > 1) {
      setExtraTrackCount((prev) => prev - 1);
      const currentValues = watch("uChannelExtraLength") || [];
      setValue("uChannelExtraLength", currentValues.slice(0, -1));
    }
  };

  useEffect(() => {
    const uChannelPipeDetail = props.pipeDetail.find(
      (pd) => pd.pipeType === "UChannel",
    );
    setValue(
      "smallUChannelWeight",
      uChannelPipeDetail?.pipeSizes[0].weight || 0,
    );
    setValue("bigUChannelWeight", uChannelPipeDetail?.pipeSizes[1].weight || 0);
  }, [props.pipeDetail, setValue]);

  const uChannelType = watch("uChannelType");

  useEffect(() => {
    setValue(
      "uChannelRate",
      props.pipeType.find((pt) => pt.color === uChannelType)?.ratePerKg || 0,
    );
    setValue("uChannelPipeSize180", true);
    setValue("uChannelPipeSize192", true);
  }, [uChannelType, setValue, props.pipeType]);

  // Initialize default values when component mounts or selectedSpOrDpPipe changes
  useEffect(() => {
    setValue("uChannelType", props.pipeType[0]?.color || "");
    setValue("uChannelPipeSize180", true);
    setValue("uChannelPipeSize192", true);
    setValue("uChannelExtraLength", []);
  }, [props.pipeType, setValue]);

  return (
    <>
      <div className="row">
        <h3>UChannel</h3>
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
              {watch("uChannelType")}
            </button>
            <ul className="dropdown-menu dropdown-menu-dark">
              {props.pipeType.map((type) => (
                <li key={type.id}>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setValue("uChannelType", type.color);
                    }}
                  >
                    {type.color}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {errors.uChannelType && (
            <div className="text-danger small mt-1">
              {errors.uChannelType.message as string}
            </div>
          )}
        </div>

        <div className="col-2">
          <label className="form-label">Track Rate</label>
          <div className="input-group mb-3">
            <input
              type="number"
              className={`form-control ${errors.uChannelRate ? "is-invalid" : ""}`}
              placeholder="Rate"
              aria-label="rate"
              step="1.00"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("uChannelRate", { valueAsNumber: true })}
            />
            <span className="input-group-text">$</span>
            {errors.uChannelRate && (
              <div className="invalid-feedback">
                {errors.uChannelRate.message as string}
              </div>
            )}
          </div>
        </div>

        <div className="col-2">
          <label className="form-label">UChannel Weight (KG)</label>
          <div className="input-group mb-3">
            <input
              type="number"
              className={`form-control ${errors.smallUChannelWeight ? "is-invalid" : ""}`}
              placeholder="Weight"
              aria-label="weight"
              step="0.01"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("smallUChannelWeight", { valueAsNumber: true })}
            />
            <span className="input-group-text">180"</span>
            {errors.smallUChannelWeight && (
              <div className="invalid-feedback">
                {errors.smallUChannelWeight.message as string}
              </div>
            )}
          </div>
          <div className="input-group mb-3">
            <input
              type="number"
              className={`form-control ${errors.bigUChannelWeight ? "is-invalid" : ""}`}
              placeholder="Weight"
              aria-label="weight"
              step="0.01"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("bigUChannelWeight", { valueAsNumber: true })}
            />
            <span className="input-group-text">192"</span>
            {errors.bigUChannelWeight && (
              <div className="invalid-feedback">
                {errors.bigUChannelWeight.message as string}
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
                id="uChannelPipeSize180"
                {...register("uChannelPipeSize180")}
              />
              <label className="form-check-label" htmlFor="uChannelPipeSize180">
                180"
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="uChannelPipeSize192"
                {...register("uChannelPipeSize192")}
              />
              <label className="form-check-label" htmlFor="uChannelPipeSize192">
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
                    Extra U-Channel {index + 1}
                  </label>
                  <div className="input-group mb-3">
                    <input
                      type="number"
                      className={`form-control ${(errors.uChannelExtraLength as any)?.[index] ? "is-invalid" : ""}`}
                      placeholder="U-Channel Length"
                      aria-label="u-channel-length"
                      step="1.00"
                      onWheel={(e) => e.currentTarget.blur()}
                      {...register(`uChannelExtraLength.${index}`, {
                        valueAsNumber: true,
                      })}
                    />
                    <span className="input-group-text">Inch</span>
                    {(errors.uChannelExtraLength as any)?.[index] && (
                      <div className="invalid-feedback">
                        {
                          (errors.uChannelExtraLength as any)[index]
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
                + Add Extra U-Channel
              </button>
              {extraTrackCount > 1 && (
                <button
                  className="btn btn-danger btn-sm"
                  type="button"
                  onClick={removeExtraTrackField}
                >
                  - Remove Extra U-Channel
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
