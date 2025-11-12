import { fetchWindows } from "@/app/api/window";
import Image from "next/image";
import Link from "next/link";

export default async function CreateEstimationPage() {

    // async function getWindowTypes(): Promise<WindowType[]> {
    //     return await getWindows();
    // }

    const windowTypes = await fetchWindows();

    return (
        <div className="container-fluid px-3">
            <div className="row g-4">
                {windowTypes && windowTypes.map((type: any) => (
                    <div key={type.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <Link href={`/${type.id}`} style={{ textDecoration: "none", color: "black" }}>
                            <div className="card h-100" style={{ maxWidth: "100%" }}>
                                <Image 
                                    src={type.imageURL}
                                    width={500} 
                                    height={500} 
                                    className="card-img-top" 
                                    alt={type.windowType}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
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