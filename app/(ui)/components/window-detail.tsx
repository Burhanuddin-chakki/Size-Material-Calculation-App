import { useFormContext } from "react-hook-form";
import { z } from "zod";

export const windowInputSchema = z.object({
  height: z.number().min(1, "Height must be at least 1 inch"),
  width: z.number().min(1, "Width must be at least 1 inch"),
  numberOfDoors: z
    .number()
    .min(2, "Minimum 2 doors required")
    .max(4, "Maximum 4 doors allowed"),
  isContainMacharJali: z.boolean(),
  isContainGrillJali: z.boolean(),
  selectedSpOrDpPipe: z.enum(["SP", "DP", "none"]).optional(),
});

interface WindowDetailProps {
  onEstimateMaterial?: () => void;
}

export default function WindowDetail({
  onEstimateMaterial,
}: WindowDetailProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const selectedSpOrDpPipe = watch("selectedSpOrDpPipe");

  const handlePipeTypeClick = (type: "SP" | "DP") => {
    // If clicking the same type, deselect it (set to "none")
    if (selectedSpOrDpPipe === type) {
      setValue("selectedSpOrDpPipe", "none");
    } else {
      setValue("selectedSpOrDpPipe", type);
    }
  };

  return (
    <>
      <div className="row">
        <h3>Window Details</h3>
      </div>
      <div className="col-12 col-md-6 col-lg-3 mb-3">
        {/* <label className="form-label">Window Size</label> */}
        <div className="row g-2">
          <div className="col-6">
            <label className="form-label">Height</label>
            <div className="input-group">
              <input
                type="number"
                className={`form-control ${errors.height ? "is-invalid" : ""}`}
                placeholder="Height"
                aria-label="height"
                step="1.00"
                onWheel={(e) => e.currentTarget.blur()}
                {...register("height", { valueAsNumber: true })}
              />
              <span className="input-group-text">Inch</span>
              {errors.height && (
                <div className="invalid-feedback">
                  {errors.height?.message as string}
                </div>
              )}
            </div>
          </div>
          <div className="col-6">
            <label className="form-label">Width</label>
            <div className="input-group">
              <input
                type="number"
                className={`form-control ${errors.width ? "is-invalid" : ""}`}
                placeholder="Width"
                aria-label="width"
                step="1.00"
                onWheel={(e) => e.currentTarget.blur()}
                {...register("width", { valueAsNumber: true })}
              />
              <span className="input-group-text">Inch</span>
              {errors.width && (
                <div className="invalid-feedback">
                  {errors.width?.message as string}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4 col-lg-2 mb-3">
        <label className="form-label">No. of Partition</label>
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {watch("numberOfDoors")}
          </button>
          <ul className="dropdown-menu dropdown-menu-dark">
            {[2, 3, 4].map((num) => (
              <li key={num}>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setValue("numberOfDoors", num);
                  }}
                >
                  {num}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {errors.numberOfDoors && (
          <div className="text-danger small mt-1">
            {errors.numberOfDoors.message as string}
          </div>
        )}
      </div>

      <div className="col-12 col-md-2 col-lg-1 mb-2 d-flex align-items-end">
        <div className="d-flex flex-column" style={{ marginBottom: "0.8rem" }}>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="isContainMacharJali"
              {...register("isContainMacharJali")}
            />
            <label className="form-check-label" htmlFor="isContainMacharJali">
              Machar Jali
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="isContainGrillJali"
              {...register("isContainGrillJali")}
            />
            <label className="form-check-label" htmlFor="isContainGrillJali">
              Grill Jali
            </label>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-2 col-lg-1 mb-2 d-flex align-items-end">
        <div className="d-flex flex-column" style={{ marginBottom: "0.8rem" }}>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="spPipe"
              checked={selectedSpOrDpPipe === "SP"}
              onChange={() => handlePipeTypeClick("SP")}
            />
            <label className="form-check-label" htmlFor="spPipe">
              SP Pipe
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="dpPipe"
              checked={selectedSpOrDpPipe === "DP"}
              onChange={() => handlePipeTypeClick("DP")}
            />
            <label className="form-check-label" htmlFor="dpPipe">
              DP Pipe
            </label>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4 col-lg-3 mb-3 d-flex align-items-end">
        <button
          className="btn btn-success w-100"
          onClick={onEstimateMaterial}
          type="button"
          style={{ marginBottom: "0.8rem" }}
        >
          Estimate Material
        </button>
      </div>
    </>
  );
}
