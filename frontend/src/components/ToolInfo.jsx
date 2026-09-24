import { useLocation } from "react-router-dom";

import "../css/tool-info.css";


const toolContent = {

    "/image-to-pdf": {

        title:
            "Free Image to PDF Converter",

        intro:
            "Convert JPG and PNG images into a single PDF directly in your browser. FileNest lets you arrange images, choose PDF settings and optionally resize images before creating your PDF.",

        steps: [
            "Select or drag your JPG or PNG images.",
            "Arrange the images in the order you want.",
            "Choose page size, orientation and margins.",
            "Optionally resize your images.",
            "Click Convert to create and download your PDF."
        ],

        benefits: [
            "Supports JPG and PNG images",
            "Combine multiple images into one PDF",
            "Choose A4 or Letter page size",
            "Portrait, landscape and automatic orientation",
            "Optional image resizing",
            "Files stay inside your browser"
        ],

        faqs: [
            {
                question:
                    "Is the Image to PDF converter free?",

                answer:
                    "Yes. FileNest lets you convert JPG and PNG images to PDF for free."
            },

            {
                question:
                    "Are my images uploaded to a server?",

                answer:
                    "No. The conversion is performed locally inside your browser, so your selected images are not uploaded to our server."
            },

            {
                question:
                    "Can I convert multiple images into one PDF?",

                answer:
                    "Yes. You can select multiple JPG or PNG files, arrange their order and combine them into a single PDF."
            },

            {
                question:
                    "Can I resize images before creating the PDF?",

                answer:
                    "Yes. You can optionally set custom width and height values and keep the original aspect ratio."
            }
        ]
    },


    "/pdf-to-jpg": {

        title:
            "Free PDF to JPG Converter",

        intro:
            "Convert PDF pages into JPG images directly in your browser. Choose the pages you need and select the image quality before downloading your results.",

        steps: [
            "Select or drop your PDF file.",
            "Choose all pages or specific pages.",
            "Select your preferred JPG quality.",
            "Start the conversion.",
            "Download the JPG image or ZIP file."
        ],

        benefits: [
            "Convert PDF pages to JPG",
            "Choose specific PDF pages",
            "Multiple image quality options",
            "ZIP download for multiple pages",
            "No account required",
            "Browser-based processing"
        ],

        faqs: [
            {
                question:
                    "Can I convert every page of a PDF to JPG?",

                answer:
                    "Yes. You can convert all PDF pages or select only the pages you need."
            },

            {
                question:
                    "What happens when my PDF has multiple pages?",

                answer:
                    "When multiple pages are converted, FileNest can package the generated JPG images into a ZIP file for easier downloading."
            },

            {
                question:
                    "Can I choose JPG quality?",

                answer:
                    "Yes. FileNest provides quality options so you can choose the output that works best for you."
            },

            {
                question:
                    "Is my PDF uploaded?",

                answer:
                    "The conversion runs in your browser, so your PDF does not need to be uploaded to our server."
            }
        ]
    },


    "/resize-image": {

        title:
            "Free Online Image Resizer",

        intro:
            "Resize JPG and PNG images online by setting custom width and height values. Keep the original aspect ratio and choose the output quality before downloading your resized image.",

        steps: [
            "Choose your JPG or PNG image.",
            "Enter the required width or height.",
            "Keep aspect ratio enabled if needed.",
            "Choose your output quality.",
            "Resize and download the image."
        ],

        benefits: [
            "Resize JPG and PNG files",
            "Custom width and height",
            "Keep image aspect ratio",
            "Multiple quality settings",
            "Preview resized dimensions",
            "Local browser processing"
        ],

        faqs: [
            {
                question:
                    "Can I resize JPG and PNG images?",

                answer:
                    "Yes. FileNest supports both JPG and PNG images for resizing."
            },

            {
                question:
                    "Will resizing change the aspect ratio?",

                answer:
                    "You can keep the aspect ratio enabled so FileNest automatically maintains the image proportions."
            },

            {
                question:
                    "Can I reduce image dimensions?",

                answer:
                    "Yes. Enter smaller width or height values to create a smaller-dimension image."
            },

            {
                question:
                    "Are images stored by FileNest?",

                answer:
                    "No. Image processing happens locally in your browser."
            }
        ]
    },


    "/merge-pdf": {

        title:
            "Free Online PDF Merger",

        intro:
            "Combine multiple PDF files into one PDF using FileNest. Add your PDFs, arrange them in the order you want and create a single merged document.",

        steps: [
            "Select two or more PDF files.",
            "Arrange the PDFs in your preferred order.",
            "Remove any file you do not want.",
            "Click Merge PDF.",
            "Download your combined PDF."
        ],

        benefits: [
            "Combine multiple PDF files",
            "Reorder PDFs before merging",
            "Remove files before processing",
            "No account required",
            "Simple browser-based workflow",
            "Files remain on your device"
        ],

        faqs: [
            {
                question:
                    "How many PDFs can I merge?",

                answer:
                    "You can select multiple PDF files and combine them into one document, subject to the available memory and processing capabilities of your browser and device."
            },

            {
                question:
                    "Can I change the PDF order?",

                answer:
                    "Yes. Arrange your PDF files before merging so the final document follows the order you choose."
            },

            {
                question:
                    "Does FileNest upload my PDFs?",

                answer:
                    "No. The merging process takes place locally inside your browser."
            },

            {
                question:
                    "Do I need an account?",

                answer:
                    "No account is required to use the PDF merger."
            }
        ]
    },


    "/split-pdf": {

        title:
            "Free Online PDF Splitter",

        intro:
            "Split a PDF into separate pages or extract only the pages you need. FileNest supports individual page selection, page ranges and splitting every page.",

        steps: [
            "Select your PDF file.",
            "Choose the split method.",
            "Enter individual pages or page ranges when needed.",
            "Start the split process.",
            "Download the resulting PDF or ZIP file."
        ],

        benefits: [
            "Extract selected PDF pages",
            "Split every page separately",
            "Create PDFs from page ranges",
            "ZIP download for multiple files",
            "No account required",
            "Local browser processing"
        ],

        faqs: [
            {
                question:
                    "Can I extract only certain PDF pages?",

                answer:
                    "Yes. You can select individual pages or ranges such as 1, 3, 5-8."
            },

            {
                question:
                    "Can I split every PDF page?",

                answer:
                    "Yes. FileNest can split every page and package the resulting files into a ZIP download."
            },

            {
                question:
                    "Can I create several PDF ranges?",

                answer:
                    "Yes. You can define separate page ranges and create multiple PDF files from the original document."
            },

            {
                question:
                    "Is the PDF uploaded to FileNest?",

                answer:
                    "No. PDF processing takes place locally in your browser."
            }
        ]
    }

};


function ToolInfo() {

    const location =
        useLocation();


    const content =
        toolContent[
            location.pathname
        ];


    if (!content) {

        return null;

    }


    return (

        <section className="tool-info">

            <div className="tool-info-container">


                {/* INTRODUCTION */}

                <div className="tool-info-intro">

                    <span className="tool-info-label">
                        ABOUT THIS TOOL
                    </span>

                    <h2>
                        {content.title}
                    </h2>

                    <p>
                        {content.intro}
                    </p>

                </div>


                {/* HOW TO USE */}

                <div className="tool-info-section">

                    <h2>
                        How to use this tool
                    </h2>

                    <div className="tool-step-grid">

                        {
                            content.steps.map(
                                (
                                    step,
                                    index
                                ) => (

                                    <div
                                        className="tool-step-card"
                                        key={step}
                                    >

                                        <span className="step-number">
                                            {index + 1}
                                        </span>

                                        <p>
                                            {step}
                                        </p>

                                    </div>

                                )
                            )
                        }

                    </div>

                </div>


                {/* BENEFITS */}

                <div className="tool-info-section">

                    <h2>
                        Why use FileNest?
                    </h2>

                    <div className="tool-benefits-grid">

                        {
                            content.benefits.map(
                                (benefit) => (

                                    <div
                                        className="tool-benefit"
                                        key={benefit}
                                    >

                                        <span>
                                            ✓
                                        </span>

                                        <p>
                                            {benefit}
                                        </p>

                                    </div>

                                )
                            )
                        }

                    </div>

                </div>


                {/* FAQ */}

                <div className="tool-info-section">

                    <h2>
                        Frequently Asked Questions
                    </h2>

                    <div className="tool-faq-list">

                        {
                            content.faqs.map(
                                (faq) => (

                                    <details
                                        className="tool-faq"
                                        key={
                                            faq.question
                                        }
                                    >

                                        <summary>
                                            {
                                                faq.question
                                            }
                                        </summary>

                                        <p>
                                            {
                                                faq.answer
                                            }
                                        </p>

                                    </details>

                                )
                            )
                        }

                    </div>

                </div>


                {/* PRIVACY */}

                <div className="tool-privacy-box">

                    <div className="tool-privacy-icon">
                        🔒
                    </div>

                    <div>

                        <h3>
                            Private browser processing
                        </h3>

                        <p>
                            FileNest is designed to process
                            supported files directly in your
                            browser. Your files do not need to
                            be uploaded to our server for these
                            tools to work.
                        </p>

                    </div>

                </div>

            </div>

        </section>

    );

}


export default ToolInfo;