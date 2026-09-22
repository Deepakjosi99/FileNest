import {
    useNavigate
} from "react-router-dom";

import "../css/popular-tool.css";


function PopularTools() {

    const navigate =
        useNavigate();


    const tools = [

        {
            id: 1,

            icon: "IMG",

            title: "Image to PDF",

            description:
                "Convert JPG and PNG images into one PDF.",

            status: "live",

            category: "PDF",

            path: "/image-to-pdf"
        },


        {
            id: 2,

            icon: "↔",

            title: "Resize Image",

            description:
                "Change image width and height in pixels.",

            status: "live",

            category: "Image",

            path: "/resize-image"
        },


        {
            id: 3,

            icon: "↓",

            title: "Compress PDF",

            description:
                "Reduce PDF file size while keeping quality.",

            status: "soon",

            category: "PDF"
        },


        {
            id: 4,

            icon: "M",

            title: "Merge PDF",

            description:
                "Combine multiple PDF files into one document.",

            status: "live",

            category: "PDF",

            path: "/merge-pdf"
        },


        {
            id: 5,

            icon: "S",

            title: "Split PDF",

            description:
                "Extract pages or split a PDF into separate files.",

            status: "live",

            category: "PDF",

            path: "/split-pdf"
        },


        {
            id: 6,

            icon: "JPG",

            title: "PDF to JPG",

            description:
                "Convert PDF pages into high-quality JPG images.",

            status: "live",

            category: "PDF",

            path: "/pdf-to-jpg"
        }

    ];


    /*
     * =========================================
     * TOOL CLICK
     * =========================================
     */

    const handleToolClick =
        (tool) => {

            if (
                tool.status !== "live"
            ) {

                return;

            }


            if (tool.path) {

                navigate(
                    tool.path
                );


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        };


    return (

        <section
            className="popular-tools"
            id="tools"
        >

            <div className="popular-tools-container">


                {/* HEADER */}

                <div className="popular-tools-header">

                    <div className="section-label">

                        FILE TOOLS

                    </div>


                    <h2>

                        Everything you need,

                        <span>

                            {" "}
                            in one place.

                        </span>

                    </h2>


                    <p>

                        Simple tools for PDFs
                        and images that work
                        directly inside your
                        browser.

                    </p>

                </div>



                {/* TOOLS GRID */}

                <div className="tools-grid">

                    {
                        tools.map(
                            (tool) => {

                                const isLive =
                                    tool.status ===
                                    "live";


                                return (

                                    <article

                                        key={
                                            tool.id
                                        }

                                        className={
                                            isLive

                                                ? "tool-card tool-card-live"

                                                : "tool-card tool-card-soon"
                                        }

                                        onClick={() =>
                                            handleToolClick(
                                                tool
                                            )
                                        }

                                        tabIndex={
                                            isLive
                                                ? 0
                                                : -1
                                        }

                                        role={
                                            isLive
                                                ? "button"
                                                : undefined
                                        }

                                        aria-label={
                                            isLive
                                                ? `Open ${tool.title}`
                                                : undefined
                                        }

                                        onKeyDown={(
                                            event
                                        ) => {

                                            if (
                                                isLive &&
                                                (
                                                    event.key ===
                                                        "Enter" ||

                                                    event.key ===
                                                        " "
                                                )
                                            ) {

                                                event.preventDefault();


                                                handleToolClick(
                                                    tool
                                                );

                                            }

                                        }}

                                    >


                                        {/* TOP */}

                                        <div className="tool-card-top">


                                            <div

                                                className={
                                                    tool.category ===
                                                    "Image"

                                                        ? "tool-card-icon image-tool-icon"

                                                        : "tool-card-icon pdf-tool-icon"
                                                }

                                            >

                                                {
                                                    tool.icon
                                                }

                                            </div>



                                            {
                                                isLive
                                                    ? (

                                                        <span className="tool-status-live">

                                                            LIVE

                                                        </span>

                                                    )
                                                    : (

                                                        <span className="tool-status-soon">

                                                            COMING SOON

                                                        </span>

                                                    )
                                            }

                                        </div>



                                        {/* CONTENT */}

                                        <div className="tool-card-content">

                                            <h3>

                                                {
                                                    tool.title
                                                }

                                            </h3>


                                            <p>

                                                {
                                                    tool.description
                                                }

                                            </p>

                                        </div>



                                        {/* FOOTER */}

                                        <div className="tool-card-footer">


                                            <span className="tool-category">

                                                {
                                                    tool.category
                                                }

                                                {" "}
                                                Tool

                                            </span>



                                            {
                                                isLive && (

                                                    <span className="tool-arrow">

                                                        →

                                                    </span>

                                                )
                                            }

                                        </div>

                                    </article>

                                );

                            }
                        )
                    }

                </div>



                {/* BOTTOM MESSAGE */}

                <div className="tools-bottom-message">

                    <div className="tools-bottom-icon">

                        +

                    </div>


                    <div>

                        <strong>

                            More tools are coming.

                        </strong>


                        <span>

                            We are building PDF,
                            image and document
                            tools step by step.

                        </span>

                    </div>

                </div>

            </div>

        </section>

    );

}


export default PopularTools;
