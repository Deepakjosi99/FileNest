import { Link } from "react-router-dom";

import "../css/footer.css";


function Footer() {

    const scrollTop = () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    return (

        <footer className="footer">

            <div className="footer-container">


                {/* =====================================
                    FOOTER GRID
                ===================================== */}

                <div className="footer-grid">


                    {/* =================================
                        BRAND
                    ================================= */}

                    <div className="footer-brand-section">

                        <Link
                            to="/"
                            className="footer-brand"
                            onClick={scrollTop}
                        >

                            <img
                                src="/favicon.svg"
                                alt="FileNest"
                                className="footer-logo"
                            />


                            <div>

                                <h3>
                                    FileNest
                                </h3>

                                <span>
                                    SMART FILE TOOLS
                                </span>

                            </div>

                        </Link>


                        <p className="footer-description">

                            Free PDF and image tools
                            that work directly inside
                            your browser.

                        </p>


                        <div className="footer-trust">

                            <span>
                                ✓ Free
                            </span>

                            <span>
                                ✓ No signup
                            </span>

                            <span>
                                🔒 Private
                            </span>

                        </div>

                    </div>



                    {/* =================================
                        PDF TOOLS
                    ================================= */}

                    <div className="footer-column">

                        <h4>
                            PDF Tools
                        </h4>


                        <Link
                            to="/image-to-pdf"
                            onClick={scrollTop}
                        >
                            Image to PDF
                        </Link>


                        <Link
                            to="/merge-pdf"
                            onClick={scrollTop}
                        >
                            Merge PDF
                        </Link>


                        <Link
                            to="/split-pdf"
                            onClick={scrollTop}
                        >
                            Split PDF
                        </Link>


                        <Link
                            to="/pdf-to-jpg"
                            onClick={scrollTop}
                        >
                            PDF to JPG
                        </Link>

                    </div>



                    {/* =================================
                        IMAGE TOOLS
                    ================================= */}

                    <div className="footer-column">

                        <h4>
                            Image Tools
                        </h4>


                        <Link
                            to="/resize-image"
                            onClick={scrollTop}
                        >
                            Resize Image
                        </Link>


                        <Link
                            to="/image-to-pdf"
                            onClick={scrollTop}
                        >
                            JPG to PDF
                        </Link>


                        <Link
                            to="/image-to-pdf"
                            onClick={scrollTop}
                        >
                            PNG to PDF
                        </Link>


                        <span className="footer-coming">
                            Compress Image
                            <small>
                                Soon
                            </small>
                        </span>

                    </div>



                    {/* =================================
                        COMPANY
                    ================================= */}

                    <div className="footer-column">

                        <h4>
                            Company
                        </h4>


                        <Link
                            to="/about"
                            onClick={scrollTop}
                        >
                            About FileNest
                        </Link>


                        <Link
                            to="/privacy"
                            onClick={scrollTop}
                        >
                            Privacy Policy
                        </Link>


                        <Link
                            to="/terms"
                            onClick={scrollTop}
                        >
                            Terms of Use
                        </Link>


                        <Link
                            to="/contact"
                            onClick={scrollTop}
                        >
                            Contact
                        </Link>

                    </div>

                </div>



                {/* =====================================
                    DIVIDER
                ===================================== */}

                <div className="footer-divider"></div>



                {/* =====================================
                    BOTTOM
                ===================================== */}

                <div className="footer-bottom">


                    <p>

                        © {new Date().getFullYear()} FileNest.
                        All rights reserved.

                    </p>


                    <div className="footer-bottom-badges">

                        <span>
                            Browser based
                        </span>

                        <span className="footer-dot">
                            •
                        </span>

                        <span>
                            No signup
                        </span>

                        <span className="footer-dot">
                            •
                        </span>

                        <span>
                            Files stay local 🔒
                        </span>

                    </div>

                </div>

            </div>

        </footer>

    );

}


export default Footer;