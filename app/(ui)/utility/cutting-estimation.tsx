import { EstimationData, PipeEstimation } from "@/app/common/interfaces";

export default function CuttingEstimation({ trackEstimationDetail }: { trackEstimationDetail: EstimationData }) {
    return <>
        <div className="row">
                <h3>Cutting Estimation</h3>
            </div>
            {/* Cutting Estimation Table */}
            <div className="row mt-4">
                {trackEstimationDetail && <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col" style={{ textAlign: 'center' }}>Track Type</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Pipe Type</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Size (Inches)</th>
                            <th scope="col" style={{ textAlign: 'center' }}>Cuts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            trackEstimationDetail &&
                            (Object.entries(trackEstimationDetail) as [keyof EstimationData, PipeEstimation][]).map(([key, estimation]) =>
                                estimation.cuttingEstimation.map((item, idx) => (
                                    <tr key={`${key}-${idx}`}>
                                        {idx === 0 && (
                                            <>
                                                <th scope="row" rowSpan={estimation.cuttingEstimation.length} style={{ height: '100px', padding: 0 }}><div className="merge-cell" >{key}</div></th>
                                                <td rowSpan={estimation.cuttingEstimation.length} style={{ height: '100px', padding: 0 }}><div className="merge-cell">{estimation.pipeType}</div></td>
                                            </>
                                        )}
                                        <td>{`${item.pipeLength} Inches ->`}</td>
                                        <td>{item.pipeCuts.join(', ')}</td>
                                    </tr>
                                ))
                            )
                        }
                    </tbody>
                </table>}
            </div>
    </>
}