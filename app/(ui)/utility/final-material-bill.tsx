import { MaterialEstimation } from "@/app/common/interfaces";
import { calculateMaterialTotalAmount } from "../services/material.service";

export default function FinalMaterialBill({
  materialEstimationDetail,
}: {
  materialEstimationDetail: MaterialEstimation[];
}) {
  return (
    <>
      <div className="row mt-4">
        <h4>Final Material Bill</h4>
      </div>
      <div className="row">
        {materialEstimationDetail && (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col" style={{ textAlign: "center", width: "4%" }}>
                  #
                </th>
                <th scope="col" style={{ textAlign: "center" }}>
                  Material (Type)
                </th>
                <th scope="col" style={{ textAlign: "center" }}>
                  Quantity
                </th>
                <th scope="col" style={{ textAlign: "center" }}>
                  Rate
                </th>
                <th scope="col" style={{ textAlign: "center" }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {materialEstimationDetail &&
                materialEstimationDetail.map((material, index) => (
                  // estimation.cuttingEstimation.map((item, idx) => (
                  <tr key={`${index}`}>
                    <th style={{ textAlign: "center", width: "4%" }}>
                      {index}
                    </th>
                    <th>
                      {material.materialName}{" "}
                      {material.type ? `(${material.type})` : ""}
                    </th>
                    <td>{material.quantity}</td>
                    <td>
                      {material.rate} /{material.unit}
                    </td>
                    <td>{material.totalPrice}</td>
                  </tr>
                ))}
              <tr>
                <th colSpan={4} style={{ textAlign: "center" }}>
                  Total
                </th>
                <th>
                  {calculateMaterialTotalAmount(materialEstimationDetail)}
                </th>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
