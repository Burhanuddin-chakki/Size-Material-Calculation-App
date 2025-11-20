import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { PipeDetailType, PipeType } from "../../common/interfaces";

interface spdpDetailProps {
  pipeType: PipeType[];
  pipeDetail: PipeDetailType[];
}
export const spdpPipeSchema = z.object({
  spdpPipeType: z.string(),
  spdpPipeRate: z.number().min(1, "SPDP rate must be greater than 0"),
  smallSpdpPipeWeight: z.number().min(1, "SPDP weight must be greater than 0"),
  bigSpdpPipeWeight: z.number().min(1, "SPDP weight must be greater than 0"),
  spdpType: z.string(),
  spdpPipeSize180: z.boolean(),
  spdpPipeSize192: z.boolean(),
  extraSpdpPipeLength: z
    .array(z.number().min(1, "Extra track length must be greater than 0"))
    .optional(),
});
export default function SpdpDetail(props: spdpDetailProps) {
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
    setValue("extraSpdpPipeLength", []);
  };

  const addExtraTrackField = () => {
    setExtraTrackCount((prev) => prev + 1);
  };

  const removeExtraTrackField = () => {
    if (extraTrackCount > 1) {
      setExtraTrackCount((prev) => prev - 1);
      const currentValues = watch("extraSpdpPipeLength") || [];
      setValue("extraSpdpPipeLength", currentValues.slice(0, -1));
    }
  };

  const selectedSpOrDpPipe = (watch as any)("selectedSpOrDpPipe") as
    | "SP"
    | "DP"
    | "none"
    | undefined;
  const spdpPipeType = watch("spdpPipeType");
  const spdpType = watch("spdpType");

  // Filter pipe details based on selected SP or DP
  const pipeDetail = useMemo(() => {
    return props.pipeDetail.filter((pd) => pd.pipeType === selectedSpOrDpPipe);
  }, [selectedSpOrDpPipe]);

  // Initialize default values when component mounts or selectedSpOrDpPipe changes
  useEffect(() => {
    // if (selectedSpOrDpPipe && props.pipeType.length > 0) {
    setValue("spdpPipeType", props.pipeType[0]?.color || "");
    setValue("spdpPipeSize180", true);
    setValue("spdpPipeSize192", true);
    setValue("extraSpdpPipeLength", []);
    // }
    if (pipeDetail.length > 0) {
      setValue("spdpType", pipeDetail[0]?.pipeName || "");
    }
  }, [pipeDetail]);

  // Update weight when spdpType changes
  useEffect(() => {
    if (spdpType) {
      const spdpPipeDetail = pipeDetail.find((pd) => pd.pipeName === spdpType);
      setValue(
        "smallSpdpPipeWeight",
        spdpPipeDetail?.pipeSizes[0]?.weight || 0,
      );
      setValue("bigSpdpPipeWeight", spdpPipeDetail?.pipeSizes[1]?.weight || 0);
    }
  }, [spdpType, pipeDetail]);

  // Update rate when spdpPipeType changes
  useEffect(() => {
    if (spdpPipeType) {
      setValue(
        "spdpPipeRate",
        props.pipeType.find((pt) => pt.color === spdpPipeType)?.ratePerKg || 0,
      );
    }
  }, [spdpPipeType, props.pipeType, setValue]);

  return (
    <>
      <div className="row">
        <h3>SP/DP Pipe</h3>
      </div>
      <div className="row mt-3">
        <div className="col-2">
          <label className="form-label">Pipe Type</label>
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {watch("spdpPipeType")}
            </button>
            <ul className="dropdown-menu dropdown-menu-dark">
              {props.pipeType.map((type) => (
                <li key={type.id}>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setValue("spdpPipeType", type.color);
                    }}
                  >
                    {type.color}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {errors.spdpPipeType && (
            <div className="text-danger small mt-1">
              {errors.spdpPipeType.message as string}
            </div>
          )}
        </div>

        <div className="col-2">
          <label className="form-label">Track Rate</label>
          <div className="input-group mb-3">
            <input
              type="number"
              className={`form-control ${errors.spdpPipeRate ? "is-invalid" : ""}`}
              placeholder="Rate"
              aria-label="rate"
              step="1.00"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("spdpPipeRate", { valueAsNumber: true })}
            />
            <span className="input-group-text">$</span>
            {errors.spdpPipeRate && (
              <div className="invalid-feedback">
                {errors.spdpPipeRate.message as string}
              </div>
            )}
          </div>
        </div>
        <div className="col-2">
          <label className="form-label">SP/DP Pipe Type</label>
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {watch("spdpType")}
            </button>
            <ul className="dropdown-menu dropdown-menu-dark">
              {pipeDetail.map((type) => (
                <li key={type.id}>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setValue("spdpType", type.pipeName);
                    }}
                  >
                    {type.pipeName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {errors.spdpPipeType && (
            <div className="text-danger small mt-1">
              {errors.spdpPipeType.message as string}
            </div>
          )}
        </div>
        <div className="col-2">
          <label className="form-label">Track Weight (KG)</label>
          <div className="input-group mb-3">
            <input
              type="number"
              className={`form-control ${errors.smallSpdpPipeWeight ? "is-invalid" : ""}`}
              placeholder="Weight"
              aria-label="weight"
              step="0.01"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("smallSpdpPipeWeight", { valueAsNumber: true })}
            />
            <span className="input-group-text">180"</span>
            {errors.smallSpdpPipeWeight && (
              <div className="invalid-feedback">
                {errors.smallSpdpPipeWeight.message as string}
              </div>
            )}
          </div>
          <div className="input-group mb-3">
            <input
              type="number"
              className={`form-control ${errors.bigSpdpPipeWeight ? "is-invalid" : ""}`}
              placeholder="Weight"
              aria-label="weight"
              step="0.01"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("bigSpdpPipeWeight", { valueAsNumber: true })}
            />
            <span className="input-group-text">192"</span>
            {errors.bigSpdpPipeWeight && (
              <div className="invalid-feedback">
                {errors.bigSpdpPipeWeight.message as string}
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
                id="spdpPipeSize180"
                {...register("spdpPipeSize180")}
              />
              <label className="form-check-label" htmlFor="spdpPipeSize180">
                180"
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="spdpPipeSize192"
                {...register("spdpPipeSize192")}
              />
              <label className="form-check-label" htmlFor="spdpPipeSize192">
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
                  <label className="form-label">Extra SP/DP {index + 1}</label>
                  <div className="input-group mb-3">
                    <input
                      type="number"
                      className={`form-control ${(errors.extraSpdpPipeLength as any)?.[index] ? "is-invalid" : ""}`}
                      placeholder="SP/DP Length"
                      aria-label="spdp-length"
                      step="1.00"
                      onWheel={(e) => e.currentTarget.blur()}
                      {...register(`extraSpdpPipeLength.${index}`, {
                        valueAsNumber: true,
                      })}
                    />
                    <span className="input-group-text">Inch</span>
                    {(errors.extraSpdpPipeLength as any)?.[index] && (
                      <div className="invalid-feedback">
                        {
                          (errors.extraSpdpPipeLength as any)[index]
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
                + Add Extra SP/DP
              </button>
              {extraTrackCount > 1 && (
                <button
                  className="btn btn-danger btn-sm"
                  type="button"
                  onClick={removeExtraTrackField}
                >
                  - Remove Extra SP/DP
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
