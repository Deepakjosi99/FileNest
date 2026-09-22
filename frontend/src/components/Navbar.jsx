import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import "../css/navbar.css";


function Navbar() {

    const navigate =
        useNavigate();

    const location =
        useLocation();


    const [
        openMenu,
        setOpenMenu
    ] = useState(null);


    const [
        mobileOpen,
        setMobileOpen
    ] = useState(false);


    const navbarRef =
        useRef(null);


    /*
     * =========================================
     * CLOSE MENUS
     * =========================================
     */

    const closeMenus = () => {

        setOpenMenu(null);

        setMobileOpen(false);

    };


    /*
     * =========================================
     * NAVIGATION
     * =========================================
     */

    const goTo = (path) => {

        navigate(path);

        closeMenus();

    };


    /*
     * =========================================
     * LOGO CLICK
     * =========================================
     */

    const handleLogoClick = () => {

        closeMenus();


        if (
            location.pathname === "/"
        ) {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            return;

        }


        navigate("/");

    };


    /*
     * =========================================
     * DROPDOWN TOGGLE
     * =========================================
     */

    const toggleMenu = (menu) => {

        setOpenMenu(
            openMenu === menu
                ? null
                : menu
        );

    };


    /*
     * =========================================
     * ACTIVE ROUTE
     * =========================================
     */

    const isActive = (path) => {

        return (
            location.pathname === path
        );

    };


    /*
     * =========================================
     * OUTSIDE CLICK
     * =========================================
     */

    useEffect(() => {

        const handleOutsideClick =
            (event) => {

                if (
                    navbarRef.current &&
                    !navbarRef.current.contains(
                        event.target
                    )
                ) {

                    setOpenMenu(null);

                }

            };


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);


    /*
     * =========================================
     * ROUTE CHANGE
     * =========================================
     */

    useEffect(() => {

        setOpenMenu(null);

        setMobileOpen(false);


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }, [location.pathname]);


    return (

        <header
            className="navbar"
            ref={navbarRef}
        >

            <div className="navbar-container">


                {/* =====================================
                    BRAND
                ===================================== */}

                <button
                    type="button"
                    className="navbar-brand"
                    onClick={
                        handleLogoClick
                    }
                    title="Go to FileNest home"
                >

                    <div className="brand-logo">

                        F

                    </div>


                    <div className="brand-text">

                        <span className="brand-name">

                            FileNest

                        </span>


                        <span className="brand-tagline">

                            SMART FILE TOOLS

                        </span>

                    </div>

                </button>



                {/* =====================================
                    DESKTOP NAVIGATION
                ===================================== */}

                <nav className="navbar-links">


                    {/* =================================
                        TOOLS
                    ================================= */}

                    <button

                        type="button"

                        className={
                            openMenu === "tools"
                                ? "nav-menu-button nav-menu-active"
                                : "nav-menu-button"
                        }

                        onClick={() =>
                            toggleMenu(
                                "tools"
                            )
                        }

                    >

                        Tools


                        <span
                            className={
                                openMenu === "tools"
                                    ? "nav-arrow nav-arrow-open"
                                    : "nav-arrow"
                            }
                        >

                            ▾

                        </span>

                    </button>



                    {
                        openMenu === "tools" && (

                            <div className="navbar-dropdown tools-dropdown">


                                <div className="dropdown-heading">

                                    <span>
                                        Popular Tools
                                    </span>

                                    <small>
                                        Fast & private
                                    </small>

                                </div>



                                {/* IMAGE TO PDF */}

                                <button

                                    type="button"

                                    className={
                                        isActive(
                                            "/image-to-pdf"
                                        )
                                            ? "dropdown-tool active-dropdown-tool"
                                            : "dropdown-tool"
                                    }

                                    onClick={() =>
                                        goTo(
                                            "/image-to-pdf"
                                        )
                                    }

                                >

                                    <div className="dropdown-icon pdf-icon">

                                        PDF

                                    </div>


                                    <div className="dropdown-tool-text">

                                        <strong>
                                            Image to PDF
                                        </strong>

                                        <span>
                                            JPG & PNG → PDF
                                        </span>

                                    </div>


                                    <span className="live-badge">

                                        LIVE

                                    </span>

                                </button>



                                {/* RESIZE IMAGE */}

                                <button

                                    type="button"

                                    className={
                                        isActive(
                                            "/resize-image"
                                        )
                                            ? "dropdown-tool active-dropdown-tool"
                                            : "dropdown-tool"
                                    }

                                    onClick={() =>
                                        goTo(
                                            "/resize-image"
                                        )
                                    }

                                >

                                    <div className="dropdown-icon image-icon">

                                        ↔

                                    </div>


                                    <div className="dropdown-tool-text">

                                        <strong>
                                            Resize Image
                                        </strong>

                                        <span>
                                            Width & height in pixels
                                        </span>

                                    </div>


                                    <span className="live-badge">

                                        LIVE

                                    </span>

                                </button>



                                {/* MERGE PDF */}

                                <button

                                    type="button"

                                    className={
                                        isActive(
                                            "/merge-pdf"
                                        )
                                            ? "dropdown-tool active-dropdown-tool"
                                            : "dropdown-tool"
                                    }

                                    onClick={() =>
                                        goTo(
                                            "/merge-pdf"
                                        )
                                    }

                                >

                                    <div className="dropdown-icon pdf-icon">

                                        M

                                    </div>


                                    <div className="dropdown-tool-text">

                                        <strong>
                                            Merge PDF
                                        </strong>

                                        <span>
                                            Combine PDF files
                                        </span>

                                    </div>


                                    <span className="live-badge">

                                        LIVE

                                    </span>

                                </button>



                                {/* SPLIT PDF */}

                                <button

                                    type="button"

                                    className={
                                        isActive(
                                            "/split-pdf"
                                        )
                                            ? "dropdown-tool active-dropdown-tool"
                                            : "dropdown-tool"
                                    }

                                    onClick={() =>
                                        goTo(
                                            "/split-pdf"
                                        )
                                    }

                                >

                                    <div className="dropdown-icon pdf-icon">

                                        S

                                    </div>


                                    <div className="dropdown-tool-text">

                                        <strong>
                                            Split PDF
                                        </strong>

                                        <span>
                                            Extract or split pages
                                        </span>

                                    </div>


                                    <span className="live-badge">

                                        LIVE

                                    </span>

                                </button>



                                {/* PDF TO JPG */}

                                <button

                                    type="button"

                                    className={
                                        isActive(
                                            "/pdf-to-jpg"
                                        )
                                            ? "dropdown-tool active-dropdown-tool"
                                            : "dropdown-tool"
                                    }

                                    onClick={() =>
                                        goTo(
                                            "/pdf-to-jpg"
                                        )
                                    }

                                >

                                    <div className="dropdown-icon pdf-icon">

                                        JPG

                                    </div>


                                    <div className="dropdown-tool-text">

                                        <strong>
                                            PDF to JPG
                                        </strong>

                                        <span>
                                            PDF pages to images
                                        </span>

                                    </div>


                                    <span className="live-badge">

                                        LIVE

                                    </span>

                                </button>

                            </div>

                        )
                    }



                    {/* =================================
                        PDF TOOLS
                    ================================= */}

                    <button

                        type="button"

                        className={
                            openMenu === "pdf"
                                ? "nav-menu-button nav-menu-active"
                                : "nav-menu-button"
                        }

                        onClick={() =>
                            toggleMenu(
                                "pdf"
                            )
                        }

                    >

                        PDF Tools


                        <span
                            className={
                                openMenu === "pdf"
                                    ? "nav-arrow nav-arrow-open"
                                    : "nav-arrow"
                            }
                        >

                            ▾

                        </span>

                    </button>



                    {
                        openMenu === "pdf" && (

                            <div className="navbar-dropdown pdf-dropdown">


                                <div className="dropdown-heading">

                                    <span>
                                        PDF Tools
                                    </span>

                                    <small>
                                        Work with PDFs
                                    </small>

                                </div>



                                {/* IMAGE TO PDF */}

                                <button

                                    type="button"

                                    className={
                                        isActive(
                                            "/image-to-pdf"
                                        )
                                            ? "dropdown-tool active-dropdown-tool"
                                            : "dropdown-tool"
                                    }

                                    onClick={() =>
                                        goTo(
                                            "/image-to-pdf"
                                        )
                                    }

                                >

                                    <div className="dropdown-icon pdf-icon">

                                        PDF

                                    </div>


                                    <div className="dropdown-tool-text">

                                        <strong>
                                            Image to PDF
                                        </strong>

                                        <span>
                                            JPG & PNG → PDF
                                        </span>

                                    </div>


                                    <span className="live-badge">

                                        LIVE

                                    </span>

                                </button>



                                {/* MERGE PDF */}

                                <button

                                    type="button"

                                    className={
                                        isActive(
                                            "/merge-pdf"
                                        )
                                            ? "dropdown-tool active-dropdown-tool"
                                            : "dropdown-tool"
                                    }

                                    onClick={() =>
                                        goTo(
                                            "/merge-pdf"
                                        )
                                    }

                                >

                                    <div className="dropdown-icon pdf-icon">

                                        M

                                    </div>


                                    <div className="dropdown-tool-text">

                                        <strong>
                                            Merge PDF
                                        </strong>

                                        <span>
                                            Combine PDF files
                                        </span>

                                    </div>


                                    <span className="live-badge">

                                        LIVE

                                    </span>

                                </button>



                                {/* SPLIT PDF */}

                                <button

                                    type="button"

                                    className={
                                        isActive(
                                            "/split-pdf"
                                        )
                                            ? "dropdown-tool active-dropdown-tool"
                                            : "dropdown-tool"
                                    }

                                    onClick={() =>
                                        goTo(
                                            "/split-pdf"
                                        )
                                    }

                                >

                                    <div className="dropdown-icon pdf-icon">

                                        S

                                    </div>


                                    <div className="dropdown-tool-text">

                                        <strong>
                                            Split PDF
                                        </strong>

                                        <span>
                                            Extract or split pages
                                        </span>

                                    </div>


                                    <span className="live-badge">

                                        LIVE

                                    </span>

                                </button>



                                {/* COMPRESS PDF */}

                                <div className="dropdown-tool disabled-tool">

                                    <div className="dropdown-icon pdf-icon">

                                        ↓

                                    </div>


                                    <div className="dropdown-tool-text">

                                        <strong>
                                            Compress PDF
                                        </strong>

                                        <span>
                                            Reduce PDF size
                                        </span>

                                    </div>


                                    <span className="soon-badge">

                                        SOON

                                    </span>

                                </div>



                                {/* PDF TO JPG */}

                                <button

                                    type="button"

                                    className={
                                        isActive(
                                            "/pdf-to-jpg"
                                        )
                                            ? "dropdown-tool active-dropdown-tool"
                                            : "dropdown-tool"
                                    }

                                    onClick={() =>
                                        goTo(
                                            "/pdf-to-jpg"
                                        )
                                    }

                                >

                                    <div className="dropdown-icon pdf-icon">

                                        JPG

                                    </div>


                                    <div className="dropdown-tool-text">

                                        <strong>
                                            PDF to JPG
                                        </strong>

                                        <span>
                                            PDF pages to images
                                        </span>

                                    </div>


                                    <span className="live-badge">

                                        LIVE

                                    </span>

                                </button>

                            </div>

                        )
                    }



                    {/* =================================
                        IMAGE TOOLS
                    ================================= */}

                    <button

                        type="button"

                        className={
                            openMenu === "image"
                                ? "nav-menu-button nav-menu-active"
                                : "nav-menu-button"
                        }

                        onClick={() =>
                            toggleMenu(
                                "image"
                            )
                        }

                    >

                        Image Tools


                        <span
                            className={
                                openMenu === "image"
                                    ? "nav-arrow nav-arrow-open"
                                    : "nav-arrow"
                            }
                        >

                            ▾

                        </span>

                    </button>



                    {
                        openMenu === "image" && (

                            <div className="navbar-dropdown image-dropdown">


                                <div className="dropdown-heading">

                                    <span>
                                        Image Tools
                                    </span>

                                    <small>
                                        Resize & convert
                                    </small>

                                </div>



                                {/* RESIZE IMAGE */}

                                <button

                                    type="button"

                                    className={
                                        isActive(
                                            "/resize-image"
                                        )
                                            ? "dropdown-tool active-dropdown-tool"
                                            : "dropdown-tool"
                                    }

                                    onClick={() =>
                                        goTo(
                                            "/resize-image"
                                        )
                                    }

                                >

                                    <div className="dropdown-icon image-icon">

                                        ↔

                                    </div>


                                    <div className="dropdown-tool-text">

                                        <strong>
                                            Resize Image
                                        </strong>

                                        <span>
                                            Width & height in pixels
                                        </span>

                                    </div>


                                    <span className="live-badge">

                                        LIVE

                                    </span>

                                </button>



                                {/* JPG TO PDF */}

                                <button

                                    type="button"

                                    className={
                                        isActive(
                                            "/image-to-pdf"
                                        )
                                            ? "dropdown-tool active-dropdown-tool"
                                            : "dropdown-tool"
                                    }

                                    onClick={() =>
                                        goTo(
                                            "/image-to-pdf"
                                        )
                                    }

                                >

                                    <div className="dropdown-icon image-icon">

                                        JPG

                                    </div>


                                    <div className="dropdown-tool-text">

                                        <strong>
                                            JPG to PDF
                                        </strong>

                                        <span>
                                            Convert JPG images
                                        </span>

                                    </div>


                                    <span className="live-badge">

                                        LIVE

                                    </span>

                                </button>



                                {/* PNG TO PDF */}

                                <button

                                    type="button"

                                    className={
                                        isActive(
                                            "/image-to-pdf"
                                        )
                                            ? "dropdown-tool active-dropdown-tool"
                                            : "dropdown-tool"
                                    }

                                    onClick={() =>
                                        goTo(
                                            "/image-to-pdf"
                                        )
                                    }

                                >

                                    <div className="dropdown-icon image-icon">

                                        PNG

                                    </div>


                                    <div className="dropdown-tool-text">

                                        <strong>
                                            PNG to PDF
                                        </strong>

                                        <span>
                                            Convert PNG images
                                        </span>

                                    </div>


                                    <span className="live-badge">

                                        LIVE

                                    </span>

                                </button>



                                {/* COMPRESS IMAGE */}

                                <div className="dropdown-tool disabled-tool">

                                    <div className="dropdown-icon image-icon">

                                        ↓

                                    </div>


                                    <div className="dropdown-tool-text">

                                        <strong>
                                            Compress Image
                                        </strong>

                                        <span>
                                            Reduce image size
                                        </span>

                                    </div>


                                    <span className="soon-badge">

                                        SOON

                                    </span>

                                </div>

                            </div>

                        )
                    }



                    {/* =================================
                        PRIVACY
                    ================================= */}

                    <button

                        type="button"

                        className="nav-normal-link"

                        onClick={() =>
                            goTo("/")
                        }

                    >

                        Privacy

                    </button>

                </nav>



                {/* =====================================
                    RIGHT SIDE
                ===================================== */}

                <div className="navbar-actions">


                    <div className="free-badge">

                        <span className="free-dot"></span>

                        Free

                    </div>



                    <button

                        type="button"

                        className="start-button"

                        onClick={() =>
                            goTo(
                                "/image-to-pdf"
                            )
                        }

                    >

                        Start Converting

                        <span>

                            →

                        </span>

                    </button>



                    {/* MOBILE MENU */}

                    <button

                        type="button"

                        className="mobile-menu-button"

                        onClick={() =>
                            setMobileOpen(
                                !mobileOpen
                            )
                        }

                        aria-label="Open navigation menu"

                    >

                        {
                            mobileOpen
                                ? "✕"
                                : "☰"
                        }

                    </button>

                </div>

            </div>



            {/* =====================================
                MOBILE NAVIGATION
            ===================================== */}

            {
                mobileOpen && (

                    <div className="mobile-navigation">


                        {/* IMAGE TO PDF */}

                        <button

                            type="button"

                            onClick={() =>
                                goTo(
                                    "/image-to-pdf"
                                )
                            }

                        >

                            Image to PDF


                            <span className="live-badge">

                                LIVE

                            </span>

                        </button>



                        {/* RESIZE IMAGE */}

                        <button

                            type="button"

                            onClick={() =>
                                goTo(
                                    "/resize-image"
                                )
                            }

                        >

                            Resize Image


                            <span className="live-badge">

                                LIVE

                            </span>

                        </button>



                        {/* MERGE PDF */}

                        <button

                            type="button"

                            onClick={() =>
                                goTo(
                                    "/merge-pdf"
                                )
                            }

                        >

                            Merge PDF


                            <span className="live-badge">

                                LIVE

                            </span>

                        </button>



                        {/* SPLIT PDF */}

                        <button

                            type="button"

                            onClick={() =>
                                goTo(
                                    "/split-pdf"
                                )
                            }

                        >

                            Split PDF


                            <span className="live-badge">

                                LIVE

                            </span>

                        </button>



                        {/* PDF TO JPG */}

                        <button

                            type="button"

                            onClick={() =>
                                goTo(
                                    "/pdf-to-jpg"
                                )
                            }

                        >

                            PDF to JPG


                            <span className="live-badge">

                                LIVE

                            </span>

                        </button>



                        {/* COMPRESS PDF */}

                        <div className="mobile-coming">

                            Compress PDF

                            <span>

                                Soon

                            </span>

                        </div>



                        {/* COMPRESS IMAGE */}

                        <div className="mobile-coming">

                            Compress Image

                            <span>

                                Soon

                            </span>

                        </div>



                        {/* HOME */}

                        <button

                            type="button"

                            onClick={
                                handleLogoClick
                            }

                        >

                            Home

                        </button>

                    </div>

                )
            }

        </header>

    );

}


export default Navbar;