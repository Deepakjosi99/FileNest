
import "../css/hero.css";
function Hero() {

    const scrollToConverter = () => {

        const converter =
            document.getElementById(
                "image-to-pdf"
            );

        if (converter) {

            converter.scrollIntoView({
                behavior: "smooth"
            });

        }

    };


    const scrollToTools = () => {

        const tools =
            document.getElementById(
                "tools"
            );

        if (tools) {

            tools.scrollIntoView({
                behavior: "smooth"
            });

        }

    };


    return (

        <section className="hero">


            {/* DECORATIVE BACKGROUND */}

            <div className="hero-decoration hero-decoration-one"></div>

            <div className="hero-decoration hero-decoration-two"></div>


            <div className="hero-container">


                {/* LEFT SIDE */}

                <div className="hero-content">


                    <div className="hero-badge">

                        <span className="hero-badge-dot"></span>

                        Free browser-based file tools

                    </div>


                    <h1 className="hero-title">

                        Work with files.

                        <span>
                            Fast. Private. Free.
                        </span>

                    </h1>


                    <p className="hero-description">

                        Convert, resize and manage your
                        PDF and image files directly
                        inside your browser.

                        No uploads. No waiting.
                        No unnecessary signup.

                    </p>


                    {/* BUTTONS */}

                    <div className="hero-actions">


                        <button
                            type="button"
                            className="hero-primary-button"
                            onClick={
                                scrollToConverter
                            }
                        >

                            Start Converting

                            <span>
                                →
                            </span>

                        </button>


                        <button
                            type="button"
                            className="hero-secondary-button"
                            onClick={
                                scrollToTools
                            }
                        >

                            Explore Tools

                        </button>

                    </div>


                    {/* FEATURES */}

                    <div className="hero-features">


                        <div className="hero-feature">

                            <span className="hero-check">
                                ✓
                            </span>

                            <span>
                                No file uploads
                            </span>

                        </div>


                        <div className="hero-feature">

                            <span className="hero-check">
                                ✓
                            </span>

                            <span>
                                No signup
                            </span>

                        </div>


                        <div className="hero-feature">

                            <span className="hero-check">
                                ✓
                            </span>

                            <span>
                                100% free
                            </span>

                        </div>

                    </div>

                </div>



                {/* RIGHT VISUAL */}

                <div className="hero-visual">


                    <div className="hero-tool-window">


                        {/* WINDOW HEADER */}

                        <div className="tool-window-header">


                            <div className="window-dots">

                                <span></span>
                                <span></span>
                                <span></span>

                            </div>


                            <span className="window-title">

                                FileNest

                            </span>

                        </div>



                        {/* TOOL CONTENT */}

                        <div className="tool-window-content">


                            <div className="hero-file-card hero-file-one">

                                <div className="hero-file-icon">

                                    JPG

                                </div>

                                <div>

                                    <strong>
                                        photo.jpg
                                    </strong>

                                    <span>
                                        1920 × 1080 px
                                    </span>

                                </div>

                                <div className="file-success">

                                    ✓

                                </div>

                            </div>



                            <div className="conversion-line">

                                <div className="conversion-line-bar">

                                    <span></span>

                                </div>


                                <div className="conversion-text">

                                    Converting securely
                                    in your browser...

                                </div>

                            </div>



                            <div className="hero-file-card result-file">

                                <div className="hero-file-icon pdf-result-icon">

                                    PDF

                                </div>

                                <div>

                                    <strong>
                                        document.pdf
                                    </strong>

                                    <span>
                                        Ready to download
                                    </span>

                                </div>

                                <div className="file-success">

                                    ✓

                                </div>

                            </div>


                            <button
                                type="button"
                                className="hero-download-demo"
                                onClick={
                                    scrollToConverter
                                }
                            >

                                Create your PDF

                                <span>
                                    →
                                </span>

                            </button>

                        </div>

                    </div>



                    {/* FLOATING TOOL CARD */}

                    <div className="floating-tool-card resize-floating-card">

                        <div className="floating-icon">

                            ↔

                        </div>

                        <div>

                            <strong>
                                Image Resize
                            </strong>

                            <span>
                                Custom pixel size
                            </span>

                        </div>

                    </div>



                    <div className="floating-tool-card privacy-floating-card">

                        <div className="floating-icon security-icon">

                            ✓

                        </div>

                        <div>

                            <strong>
                                Private
                            </strong>

                            <span>
                                Files stay local
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}


export default Hero;