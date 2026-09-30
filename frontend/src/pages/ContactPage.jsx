import "../css/legal-page.css";
import "../css/contact-page.css";


function ContactPage() {

    /*
     * IMPORTANT:
     * Replace this with the email address
     * you want FileNest users to contact.
     */
    const contactEmail =
        "filenest.tools@gmail.com";


    const openEmail =
        () => {

            const subject =
                encodeURIComponent(
                    "FileNest Support"
                );


            window.location.href =
                `mailto:${contactEmail}?subject=${subject}`;

        };


    return (

        <main className="legal-page">

            <div className="legal-container">


                {/* =================================
                    HEADER
                ================================= */}

                <div className="legal-header">

                    <span className="legal-label">
                        CONTACT
                    </span>

                    <h1>
                        Contact FileNest
                    </h1>

                    <p>
                        Questions, feedback or tool suggestions?
                        We would like to hear from you.
                    </p>

                </div>


                {/* =================================
                    INTRO
                ================================= */}

                <section className="legal-section">

                    <h2>
                        How can we help?
                    </h2>

                    <p>
                        You can contact FileNest for questions
                        about the website, report a problem,
                        suggest a new file tool or share feedback.
                    </p>

                </section>


                {/* =================================
                    CONTACT CARD
                ================================= */}

                <div className="contact-card">

                    <div className="contact-icon">

                        ✉

                    </div>


                    <div className="contact-details">

                        <span className="contact-small-label">
                            EMAIL SUPPORT
                        </span>

                        <h2>
                            Get in touch
                        </h2>

                        <p>
                            Send us an email and include as much
                            information as possible about your
                            question or issue.
                        </p>


                        <button
                            type="button"
                            className="contact-button"
                            onClick={openEmail}
                        >

                            Email FileNest

                            <span>
                                →
                            </span>

                        </button>

                    </div>

                </div>


                {/* =================================
                    WHAT TO CONTACT ABOUT
                ================================= */}

                <section className="legal-section">

                    <h2>
                        You can contact us about
                    </h2>


                    <div className="contact-topic-grid">

                        <div className="contact-topic">

                            <strong>
                                Tool problems
                            </strong>

                            <p>
                                Tell us if a PDF or image tool
                                is not working as expected.
                            </p>

                        </div>


                        <div className="contact-topic">

                            <strong>
                                Feature requests
                            </strong>

                            <p>
                                Suggest a converter or file tool
                                you would like FileNest to add.
                            </p>

                        </div>


                        <div className="contact-topic">

                            <strong>
                                Privacy questions
                            </strong>

                            <p>
                                Ask questions about how FileNest
                                processes supported files.
                            </p>

                        </div>


                        <div className="contact-topic">

                            <strong>
                                General feedback
                            </strong>

                            <p>
                                Share ideas that could make
                                FileNest more useful or easier
                                to use.
                            </p>

                        </div>

                    </div>

                </section>


                {/* =================================
                    REPORTING ISSUES
                ================================= */}

                <section className="legal-section">

                    <h2>
                        Reporting a technical problem
                    </h2>

                    <p>
                        If a FileNest tool is not working,
                        providing the following information
                        may help us understand the problem:
                    </p>

                    <ul>

                        <li>
                            The FileNest tool you were using.
                        </li>

                        <li>
                            Your browser and device type.
                        </li>

                        <li>
                            The error message you received,
                            if any.
                        </li>

                        <li>
                            A short description of what happened.
                        </li>

                    </ul>

                    <p>
                        Please do not send private or sensitive
                        files unless they are specifically
                        required and you are comfortable
                        sharing them.
                    </p>

                </section>


                {/* =================================
                    PRIVACY
                ================================= */}

                <section className="legal-section">

                    <h2>
                        Contact privacy
                    </h2>

                    <p>
                        Information you voluntarily provide
                        when contacting FileNest will be used
                        to respond to your inquiry and address
                        the issue you reported.
                    </p>

                    <p>
                        Please avoid including passwords,
                        payment information or other sensitive
                        personal information in support messages.
                    </p>

                </section>


                {/* =================================
                    RESPONSE
                ================================= */}

                <section className="legal-section">

                    <h2>
                        Response times
                    </h2>

                    <p>
                        FileNest is currently a growing project,
                        so response times may vary.
                    </p>

                    <p>
                        We will try to review genuine support
                        requests, bug reports and feedback as
                        reasonably possible.
                    </p>

                </section>


            </div>

        </main>

    );

}


export default ContactPage;