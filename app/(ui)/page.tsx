import { fetchWindows } from "@/app/api/window";
import Image from "next/image";
import Link from "next/link";

export default async function CreateEstimationPage() {

    // async function getWindowTypes(): Promise<WindowType[]> {
    //     return await getWindows();
    // }

    const windowTypes = await fetchWindows();

    return (
        <div className="container">
            <div className="row">
                {windowTypes && windowTypes.map((type: any) => (
                    <div key={type.id} className="col-3 mb-5">
                        <Link href={`/${type.id}`} style={{ textDecoration: "none", color: "black" }}>
                            <div className="card" style={{ width: "18rem" }}>
                                <Image src='/2-track-window.webp' width={500} height={500} className="card-img-top" alt={type.windowType} />
                                <div className="card-body">
                                    <p className="card-text text-center"><strong>{type.windowType}</strong></p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}