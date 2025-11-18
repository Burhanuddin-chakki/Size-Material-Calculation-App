'use client';

import { fetchWindows } from "@/app/api/window";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CreateEstimationPage() {

    const [windowTypes, setWindowTypes] = useState<any[]>([]);

    useEffect(() => {
        const getWindows = async () => {
            const windows = await fetchWindows();
            setWindowTypes(windows);
        };
        getWindows();
    }, []);

    return (
        <div className="container-fluid px-4 py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-1" style={{ color: "#2c3e50" }}>Select Window Type</h2>
            </div>
            <div className="row g-4">
                {windowTypes && windowTypes.map((type: any, index: number) => (
                    <div key={type.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <Link href={`/${type.id}`} style={{ textDecoration: "none" }}>
                            <div className="card h-100 border-0 shadow-sm position-relative overflow-hidden" 
                                 style={{ 
                                     transition: "all 0.3s ease",
                                     cursor: "pointer"
                                 }}
                                 onMouseEnter={(e) => {
                                     e.currentTarget.style.transform = "translateY(-8px)";
                                     e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                                 }}
                                 onMouseLeave={(e) => {
                                     e.currentTarget.style.transform = "translateY(0)";
                                     e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.12)";
                                 }}>
                                <div className="position-relative" style={{ height: "280px", overflow: "hidden" }}>
                                    <Image 
                                        src={type.imageURL}
                                        width={500} 
                                        height={500} 
                                        className="card-img-top" 
                                        alt={type.windowType}
                                        priority={index < 4}
                                        quality={85}
                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        placeholder="blur"
                                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                                        style={{ 
                                            width: "100%", 
                                            height: "100%", 
                                            objectFit: "cover",
                                            transition: "transform 0.3s ease"
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                        loading={index < 4 ? undefined : "lazy"}
                                    />
                                    <div className="position-absolute top-0 start-0 w-100 h-100" 
                                         style={{
                                             background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)"
                                         }}>
                                    </div>
                                </div>
                                <div className="card-body px-3 py-3">
                                    <h5 className="card-title text-center mb-0 fw-semibold" style={{ color: "#2c3e50" }}>
                                        {type.windowType}
                                    </h5>
                                </div>
                                <div className="position-absolute top-0 end-0 m-3">
                                    <span className="badge bg-primary" style={{ fontSize: "0.7rem" }}>New</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}