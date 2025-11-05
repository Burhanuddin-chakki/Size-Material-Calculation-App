import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";



export const windowInputSchema = z.object({
    height: z.number().min(1, "Height must be at least 1 inch"),
    width: z.number().min(1, "Width must be at least 1 inch"),
    numberOfDoors: z.number().min(2, "Minimum 2 doors required").max(4, "Maximum 4 doors allowed"),
    isContainMacharJali: z.boolean(),
})

export default function WindowDetail() {
    const { register, formState: { errors }, setValue, watch } = useFormContext();


    useEffect(() => {
        setValue("numberOfDoors", 2);
        setValue("isContainMacharJali", false);
    }, []);

    return (
        <>
            <div className="col-3">
                <label className="form-label">Window Size</label>
                <div className="row">
                    <div className="col-6">
                        <div className="input-group mb-3">
                            <input
                                type="number"
                                className={`form-control ${errors.height ? 'is-invalid' : ''}`}
                                placeholder="height"
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
                        <div className="input-group mb-3">
                            <input
                                type="number"
                                className={`form-control ${errors.width ? 'is-invalid' : ''}`}
                                placeholder="width"
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

            <div className="col-2">
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
                        {
                            [2, 3, 4].map((num) => (
                                <li key={num}><a className="dropdown-item" href="#" onClick={(e) => {
                                    e.preventDefault();
                                    setValue("numberOfDoors", num);
                                }}>{num}</a></li>
                            ))
                        }
                    </ul>
                </div>
                {errors.numberOfDoors && (
                    <div className="text-danger small mt-1">
                        {errors.numberOfDoors.message}
                    </div>
                )}
            </div>

            <div className="col-2" style={{ marginTop: "2rem" }}>
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="macharJaliRadio"
                        {...register("isContainMacharJali")}
                    />
                    <label className="form-check-label" htmlFor="macharJaliRadio">Machar Jali</label>
                </div>
                {errors.isContainMacharJali && (
                    <div className="text-danger small mt-1">
                        {errors.isContainMacharJali.message}
                    </div>
                )}
            </div>
            <div className="col-2" style={{ marginTop: "2rem" }}>
                <button
                    className="btn btn-success"
                    type="button"
                >
                    Estimate Material
                </button>
            </div>
        </>
    );
}
