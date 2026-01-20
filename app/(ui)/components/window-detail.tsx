import { AllWindowInputDetails, WindowInputDetails } from "@/types";
import { useFormContext, useFieldArray } from "react-hook-form";
import { z } from "zod";

// Single window schema
const singleWindowSchema: z.ZodType<WindowInputDetails> = z.object({
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

// Array of windows schema
export const windowInputSchema: z.ZodType<AllWindowInputDetails> = z.object({
  windows: z.array(singleWindowSchema).min(1, "At least one window is required"),
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
    control,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "windows",
  });

  const addWindow = () => {
    append({
      height: 0,
      width: 0,
      numberOfDoors: 2,
      isContainMacharJali: false,
      isContainGrillJali: false,
      selectedSpOrDpPipe: "none",
    });
  };

  const removeWindow = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handlePipeTypeClick = (index: number, type: "SP" | "DP") => {
    const currentValue = watch(`windows.${index}.selectedSpOrDpPipe`);
    // If clicking the same type, deselect it (set to "none")
    if (currentValue === type) {
      setValue(`windows.${index}.selectedSpOrDpPipe`, "none");
    } else {
      setValue(`windows.${index}.selectedSpOrDpPipe`, type);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h3>Window Details</h3>
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={addWindow}
          >
            + Add Window
          </button>
        </div>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="border rounded p-3 mb-3 bg-light">
          <div className="row">
            <div className="col-12 d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Window {index + 1}</h5>
              {fields.length > 1 && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeWindow(index)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label">Height</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className={`form-control ${errors.windows?.[index]?.height ? "is-invalid" : ""}`}
                      placeholder="Height"
                      aria-label="height"
                      step="0.1"
                      onWheel={(e) => e.currentTarget.blur()}
                      {...register(`windows.${index}.height`, { valueAsNumber: true })}
                    />
                    <span className="input-group-text">Inch</span>
                    {errors.windows?.[index]?.height && (
                      <div className="invalid-feedback">
                        {errors.windows[index]?.height?.message as string}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label">Width</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className={`form-control ${errors.windows?.[index]?.width ? "is-invalid" : ""}`}
                      placeholder="Width"
                      aria-label="width"
                      step="0.1"
                      onWheel={(e) => e.currentTarget.blur()}
                      {...register(`windows.${index}.width`, { valueAsNumber: true })}
                    />
                    <span className="input-group-text">Inch</span>
                    {errors.windows?.[index]?.width && (
                      <div className="invalid-feedback">
                        {errors.windows[index]?.width?.message as string}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4 col-lg-2 mb-2">
              <label className="form-label">No. of Partition</label>
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {watch(`windows.${index}.numberOfDoors`)}
                </button>
                <ul className="dropdown-menu dropdown-menu-dark">
                  {[2, 3, 4].map((num) => (
                    <li key={num}>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setValue(`windows.${index}.numberOfDoors`, num);
                        }}
                      >
                        {num}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              {errors.windows?.[index]?.numberOfDoors && (
                <div className="text-danger small mt-1">
                  {errors.windows[index]?.numberOfDoors?.message as string}
                </div>
              )}
            </div>

            <div className="col-12 col-md-2 col-lg-2 mb-2 d-flex align-items-end" style={{ paddingBottom: "0.8rem" , paddingLeft: "5rem" }}>
              <div className="d-flex flex-column" style={{ marginBottom: "0.8rem" }}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`isContainMacharJali-${index}`}
                    {...register(`windows.${index}.isContainMacharJali`)}
                  />
                  <label className="form-check-label" htmlFor={`isContainMacharJali-${index}`}>
                    Machar Jali
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`isContainGrillJali-${index}`}
                    {...register(`windows.${index}.isContainGrillJali`)}
                  />
                  <label className="form-check-label" htmlFor={`isContainGrillJali-${index}`}>
                    Grill Jali
                  </label>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-2 col-lg-2 mb-2 d-flex align-items-end" style={{ paddingBottom: "0.8rem" , paddingLeft: "1rem" }}>
              <div className="d-flex flex-column" style={{ marginBottom: "0.8rem" }}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`spPipe-${index}`}
                    checked={watch(`windows.${index}.selectedSpOrDpPipe`) === "SP"}
                    onChange={() => handlePipeTypeClick(index, "SP")}
                  />
                  <label className="form-check-label" htmlFor={`spPipe-${index}`}>
                    SP Pipe
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`dpPipe-${index}`}
                    checked={watch(`windows.${index}.selectedSpOrDpPipe`) === "DP"}
                    onChange={() => handlePipeTypeClick(index, "DP")}
                  />
                  <label className="form-check-label" htmlFor={`dpPipe-${index}`}>
                    DP Pipe
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="row d-flex justify-content-center">
        <div className="col-12 col-md-4 col-lg-3 mb-3 ">
                <button
                  className="btn btn-success w-100"
                  onClick={onEstimateMaterial}
                  type="button"
                  style={{ marginBottom: "0.8rem" }}
                >
                  Estimate Material
                </button>
              </div>

      </div>
      
    </>
  );
}
