import { EstimationData, PipeEstimation } from "@/app/common/interfaces";
import { calculateTrackTotalAmount } from "../services/track.service";

export default function FinalPipeBill({
  trackEstimationDetail,
  showExtraPipeColumn,
}: {
  trackEstimationDetail: EstimationData;
  showExtraPipeColumn: boolean;
}) {
  return (
    <>
      <div className="row mt-4">
        <h4>Final Track Pipe Bill</h4>
      </div>
      {/* Final Track Pipe Bill Table */}
      <div>
        {trackEstimationDetail && (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col" style={{ textAlign: "center" }}>
                  Material
                </th>
                <th scope="col" style={{ textAlign: "center" }}>
                  Pipe Type
                </th>
                <th scope="col" style={{ textAlign: "center" }}>
                  180 (Full)
                </th>
                <th scope="col" style={{ textAlign: "center" }}>
                  180 partial (Inches)
                </th>
                <th scope="col" style={{ textAlign: "center" }}>
                  192 (full)
                </th>
                <th scope="col" style={{ textAlign: "center" }}>
                  192 partial(Inches)
                </th>
                {showExtraPipeColumn && (
                  <>
                    <th scope="col" style={{ textAlign: "center" }}>
                      Extra Pipe Size(Inches)
                    </th>
                    <th scope="col" style={{ textAlign: "center" }}>
                      Extra Pipe(full)
                    </th>
                    <th scope="col" style={{ textAlign: "center" }}>
                      Extra Pipe Partial(Inches)
                    </th>
                  </>
                )}
                <th scope="col" style={{ textAlign: "center" }}>
                  Total Inches
                </th>
                <th scope="col" style={{ textAlign: "center" }}>
                  Total weight (kg)
                </th>
                <th scope="col" style={{ textAlign: "center" }}>
                  Rate/Kg
                </th>
                <th scope="col" style={{ textAlign: "center" }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {trackEstimationDetail &&
                (
                  Object.entries(trackEstimationDetail) as [
                    keyof EstimationData,
                    PipeEstimation,
                  ][]
                ).map(([key, estimation]) => (
                  <tr key={`${key}`}>
                    <th>{key}</th>
                    <td>{estimation.pipeType}</td>
                    <td>{estimation.fullSmallPipeCount}</td>
                    <td>{estimation.partialSmallPipeInches}</td>
                    <td>{estimation.fullLargePipeCount}</td>
                    <td>{estimation.partialLargePipeInches}</td>
                    {showExtraPipeColumn && (
                      <>
                        <td>{estimation.extraPipeSize?.join(", ") || 0}</td>
                        <td>{estimation.fullExtraPipeCount}</td>
                        <td>{estimation.partialExtraPipeInches}</td>
                      </>
                    )}
                    <td>{estimation.totalInches}</td>
                    <td>{estimation.totalWeight}</td>
                    <td>{estimation.pipeRate}</td>
                    <td>{estimation.totalAmount}</td>
                  </tr>
                ))}
              <tr>
                <th
                  colSpan={!showExtraPipeColumn ? 9 : 12}
                  style={{ textAlign: "center" }}
                >
                  Total
                </th>
                <th>{calculateTrackTotalAmount(trackEstimationDetail)}</th>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
