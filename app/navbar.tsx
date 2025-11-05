import Image from "next/image";


export default function Navbar() {
    return (
        <div>
            <nav className="navbar bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand">
                        <Image src="/aluminium-window.png" alt="Logo" width={30} height={24} className="d-inline-block align-text-top" />
                        &nbsp;&nbsp;Size & Material Calculation App
                    </a>
                </div>
            </nav>
        </div>

    );
}

