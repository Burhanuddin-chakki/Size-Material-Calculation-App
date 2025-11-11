"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
    const pathname = usePathname();
    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white" style={{ width: "300px", height: "100%" }}>
            {/* Brand/Logo */}
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <svg className="bi me-2" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                </svg>
                <span className="fs-4">Nice Enterprises</span>
            </a>
            <hr className="text-white-50" />

            {/* Navigation Menu */}
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link 
                        href="/" 
                        className={`nav-link d-flex gap-2 text-decoration-none text-white ${
                            pathname === "/" ? "active" : ""
                        }`} 
                    >
                        <Image src="/window.svg" alt="window" width={30} height={30} />
                        <span className="position-relative" style={{fontSize: "1.2rem", fontWeight: "450" }}>
                            Create Estimation
                        </span>
                    </Link>
                </li>
                
            </ul>

        </div>
    )
}