import { useNavigate } from "react-router-dom";

import "../css/footer.css";


function Footer() {

    const navigate = useNavigate();


    const goTo = (path) => {

        navigate(path);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    return (

        <footer className="footer">

            <div className="footer-container">


                <div className="footer-top">


                    <div className="footer-brand">

                        <div className="footer-logo">

                            <img
                                src="/favicon.svg"
                                alt="FileNest logo"
                            />

                        </div>


                        <div>

                            <h3>
                                FileNest
                            </h3>

                            <p>
                                Free PDF and image tools
                                that work directly in your browser.
                            </p>

                        </div>

                    </div>


                    <div className="footer-links">

                        <button
                            onClick={() =>
                                goTo("/")
                            }
                        >
                            Home
                        </button>


                        <button
                            onClick={() =>
                                goTo("/image-to-pdf")
                            }
                        >
                            Image to PDF
                        </button>


                        <button
                            onClick={() =>
                                goTo("/pdf-to-jpg")
                            }
                        >
                            PDF to JPG
                        </button>


                        <button
                            onClick={() =>
                                goTo("/merge-pdf")
                            }
                        >
                            Merge PDF
                        </button>


                        <button
                            onClick={() =>
                                goTo("/split-pdf")
                            }
                        >
                            Split PDF
                        </button>


                        <button
                            onClick={() =>
                                goTo("/resize-image")
                            }
                        >
                            Resize Image
                        </button>

                    </div>

                </div>


                <div className="footer-divider"></div>


                <div className="footer-bottom">

                    <p>
                        © {new Date().getFullYear()} FileNest.
                        All rights reserved.
                    </p>


                    <p className="footer-privacy-text">
                        Files are processed locally in your browser.
                    </p>

                </div>

            </div>

        </footer>

    );

}


export default Footer;