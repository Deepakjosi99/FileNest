import "../css/legal-page.css";


function AboutPage() {

    return (

        <main className="legal-page">

            <div className="legal-container">


                {/* =================================
                    HEADER
                ================================= */}

                <div className="legal-header">

                    <span className="legal-label">
                        ABOUT
                    </span>

                    <h1>
                        About FileNest
                    </h1>

                    <p>
                        Simple, private and free file tools
                        for everyday use.
                    </p>

                </div>


                {/* =================================
                    INTRODUCTION
                ================================= */}

                <section className="legal-section">

                    <h2>
                        What is FileNest?
                    </h2>

                    <p>
                        FileNest is a browser-based collection
                        of PDF and image tools designed to make
                        common file tasks simple and accessible.
                    </p>

                    <p>
                        Our goal is to provide useful tools that
                        are easy to understand, quick to use and
                        available without unnecessary signups.
                    </p>

                </section>


                {/* =================================
                    CURRENT TOOLS
                ================================= */}

                <section className="legal-section">

                    <h2>
                        What can you do with FileNest?
                    </h2>

                    <p>
                        FileNest currently provides tools for:
                    </p>

                    <ul>

                        <li>
                            Converting JPG and PNG images to PDF.
                        </li>

                        <li>
                            Converting PDF pages to JPG images.
                        </li>

                        <li>
                            Resizing JPG and PNG images.
                        </li>

                        <li>
                            Merging multiple PDF files.
                        </li>

                        <li>
                            Splitting PDFs and extracting pages.
                        </li>

                    </ul>

                    <p>
                        More file conversion and optimization
                        tools may be added over time.
                    </p>

                </section>


                {/* =================================
                    PRIVACY APPROACH
                ================================= */}

                <section className="legal-section">

                    <h2>
                        Privacy-focused processing
                    </h2>

                    <p>
                        FileNest is designed so that supported
                        file-processing tasks can run directly
                        inside your browser.
                    </p>

                    <div className="legal-highlight">

                        <strong>
                            Your files stay on your device
                        </strong>

                        <p>
                            Current supported tools process
                            selected PDF and image files locally
                            in your browser instead of requiring
                            those files to be uploaded to a
                            FileNest application server.
                        </p>

                    </div>

                </section>


                {/* =================================
                    WHY FILENEST
                ================================= */}

                <section className="legal-section">

                    <h2>
                        Why FileNest?
                    </h2>

                    <p>
                        FileNest is built around a few simple
                        principles:
                    </p>

                    <ul>

                        <li>
                            Keep file tools easy to use.
                        </li>

                        <li>
                            Avoid unnecessary account creation.
                        </li>

                        <li>
                            Provide useful free functionality.
                        </li>

                        <li>
                            Keep supported file processing private
                            whenever browser technology allows it.
                        </li>

                        <li>
                            Build a clean experience that works
                            across desktop, tablet and mobile
                            devices.
                        </li>

                    </ul>

                </section>


                {/* =================================
                    FREE TOOLS
                ================================= */}

                <section className="legal-section">

                    <h2>
                        Free to use
                    </h2>

                    <p>
                        The currently available FileNest tools
                        can be used without creating an account.
                    </p>

                    <p>
                        FileNest may introduce additional features,
                        optional services or advertising in the
                        future to help support continued development
                        and operation of the website.
                    </p>

                </section>


                {/* =================================
                    DEVELOPMENT
                ================================= */}

                <section className="legal-section">

                    <h2>
                        Built for everyday file tasks
                    </h2>

                    <p>
                        FileNest is being developed as a practical
                        utility for people who need quick help with
                        PDFs and images without installing additional
                        software.
                    </p>

                    <p>
                        We continue to improve existing tools and
                        plan to add more useful file utilities over
                        time.
                    </p>

                </section>


                {/* =================================
                    FEEDBACK
                ================================= */}

                <section className="legal-section">

                    <h2>
                        Feedback and suggestions
                    </h2>

                    <p>
                        Suggestions can help us understand which
                        tools and improvements would be most useful
                        to FileNest users.
                    </p>

                    <p>
                        If you have feedback, find an issue or want
                        to suggest a new tool, you can reach us
                        through the Contact page.
                    </p>

                </section>


                {/* =================================
                    CONTACT
                ================================= */}

                <section className="legal-section">

                    <h2>
                        Contact FileNest
                    </h2>

                    <p>
                        For questions, feedback or other inquiries,
                        please use the FileNest Contact page.
                    </p>

                </section>


            </div>

        </main>

    );

}


export default AboutPage;