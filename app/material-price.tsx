import { useFormContext } from "react-hook-form";
import { MaterialItemType } from "./window-estimation";

interface MaterialPriceProps {
    materialList: MaterialItemType[];
}

export default function MaterialPrice({ materialList }: MaterialPriceProps) {

    const { register, formState: { errors } } = useFormContext();

    return (
        <>
            <div className="row">
                <h3>Material Price</h3>
            </div>
            
            <table className="table table-borderless table-hover mt-3">
                <tbody>
                    {Array.from({ length: Math.ceil(materialList.length / 4) }, (_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array.from({ length: 4 }, (_, cellIndex) => {
                                const itemIndex = rowIndex * 4 + cellIndex;
                                const item = materialList[itemIndex];
                                
                                return (
                                    <td key={cellIndex}>
                                        {item ? (
                                            <>
                                                <label htmlFor={item.field} className="col-form-label">
                                                    {item.label}
                                                </label>
                                                <div className="input-group">
                                                    <input
                                                        type="number"
                                                        className={`form-control ${errors[item.field] ? 'is-invalid' : ''}`}
                                                        id={item.field}
                                                        placeholder={`${item.label} Rate`}
                                                        aria-label={item.field}
                                                        step="1.00"
                                                        onWheel={(e) => e.currentTarget.blur()}
                                                        {...register(item.field, { valueAsNumber: true })}
                                                    />
                                                    <span className="input-group-text">$</span>
                                                </div>
                                                {errors[item.field] && (
                                                    <div className="text-danger small mt-1">
                                                        {errors[item.field]?.message as string}
                                                    </div>
                                                )}
                                            </>
                                        ) : null}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

        </>
    );


}