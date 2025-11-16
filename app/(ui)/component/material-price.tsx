import { useFormContext } from "react-hook-form";
import { MaterialType } from "../../common/interfaces";
import { useEffect, useState } from "react";
import { z } from "zod";

interface MaterialPriceProps {
    materialList: MaterialType[];
}



export default function MaterialPrice({ materialList }: MaterialPriceProps) {

    const { register, formState: { errors }, setValue, watch } = useFormContext();
    const [materialWithType, setMaterialWithType] = useState<MaterialType[]>([]);
    const [materialWithoutType, setMaterialWithoutType] = useState<MaterialType[]>([]);

    useEffect(() => {
        const materialWithType: MaterialType[] = []
        const materialWithoutType: MaterialType[] = [];
        materialList.forEach((item) => {
            if (item.type && item.type.length > 0) {
                materialWithType.push(item);
                setValue(`${item.field}_type`, item.type[0].name);
                setValue(`${item.field}_rate`, item.type[0].rate);
            } else {
                materialWithoutType.push(item);
                setValue(item.field, item.rate);
            }
        });
        console.log("MaterialWithoutType:", materialWithoutType);
        setMaterialWithType(materialWithType);
        setMaterialWithoutType(materialWithoutType);
    }, []);

    // useEffect(() => {
    //     materialList.forEach((item) => {
    //         setValue(item.field, item.rate);
    //     });
    // }, []);

    return (
        <>
            <div className="row">
                <h3>Material Price</h3>
            </div>
            <div className="row g-3">
                {materialWithType.map((item) => (
                    <div key={item.field} className="col-12 col-md-6 col-lg-4">
                        <div className="row g-2">
                            <div className="col-6">
                                <label className="form-label">{item.label} Type</label>
                                <div className="dropdown w-100">
                                    <button className="btn btn-secondary dropdown-toggle w-100" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {watch(`${item.field}_type`)}
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-dark">
                                        {
                                            item.type?.map((type) => (
                                                <li key={type.field}><a className="dropdown-item" href="#" onClick={(e) => {
                                                    e.preventDefault();
                                                    setValue(`${item.field}_type`, type.name);
                                                    setValue(`${item.field}_rate`, type.rate);
                                                }}>{type.name}</a></li>
                                            ))
                                        }
                                    </ul>
                                </div>
                                {errors[`${item.field}_type`] && (
                                    <div className="text-danger small mt-1">
                                        {errors[`${item.field}_type`]?.message as string}
                                    </div>
                                )}
                            </div>
                            <div className="col-6">
                                <label htmlFor={item.field} className="form-label">
                                    Rate
                                </label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className={`form-control ${errors[`${item.field}_rate`] ? 'is-invalid' : ''}`}
                                        id={`${item.field}_rate`}
                                        placeholder={`${item.label} Rate`}
                                        aria-label={`${item.field}_rate`}
                                        step="0.01"
                                        onWheel={(e) => e.currentTarget.blur()}
                                        {...register(`${item.field}_rate`, { valueAsNumber: true })}
                                    />
                                    <span className="input-group-text">/{item.unit}</span>
                                </div>
                                {errors[`${item.field}_rate`] && (
                                    <div className="text-danger small mt-1">
                                        {errors[`${item.field}_rate`]?.message as string}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-3 mt-3">
                {materialWithoutType.map((item) => (
                    <div key={item.field} className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <label htmlFor={item.field} className="form-label">
                            {item.label}
                        </label>
                        <div className="input-group">
                            <input
                                type="number"
                                className={`form-control ${errors[item.field] ? 'is-invalid' : ''}`}
                                id={item.field}
                                placeholder={`${item.label} Rate`}
                                aria-label={item.field}
                                step="0.01"
                                onWheel={(e) => e.currentTarget.blur()}
                                {...register(item.field, { valueAsNumber: true })}
                            />
                            <span className="input-group-text">/{item.unit}</span>
                        </div>
                        {errors[item.field] && (
                            <div className="text-danger small mt-1">
                                {errors[item.field]?.message as string}
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </>
    );


}