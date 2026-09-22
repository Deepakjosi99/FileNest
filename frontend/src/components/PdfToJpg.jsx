import {
    useState
} from "react";

import "../css/pdf-to-jpg.css";

import {
    convertPdfToJpg,
    createJpgZip,
    getPdfPageCount,
    parseJpgPageSelection
} from "../utils/pdfToJpg";


function PdfToJpg() {

    const [
        pdfFile,
        setPdfFile
    ] = useState(null);


    const [
        pageCount,
        setPageCount
    ] = useState(0);


    const [
        convertMode,
        setConvertMode
    ] = useState("all");


    const [
        pageSelection,
        setPageSelection
    ] = useState("");


    const [
        quality,
        setQuality
    ] = useState("high");


    const [
        isDraggingOver,
        setIsDraggingOver
    ] = useState(false);


    const [
        isConverting,
        setIsConverting
    ] = useState(false);


    const [
        progress,
        setProgress
    ] = useState({
        current: 0,
        total: 0
    });


    const [
        error,
        setError
    ] = useState("");


    /*
     * =========================================
     * FILE SIZE
     * =========================================
     */

    const formatFileSize =
        (bytes) => {

            if (
                bytes < 1024
            ) {

                return `${bytes} B`;

            }


            if (
                bytes <
                1024 * 1024
            ) {

                return `${(
                    bytes / 1024
                ).toFixed(1)} KB`;

            }


            return `${(
                bytes /
                1024 /
                1024
            ).toFixed(2)} MB`;

        };


    /*
     * =========================================
     * LOAD PDF
     * =========================================
     */

    const loadPdf =
        async (file) => {

            if (!file) {

                return;

            }


            const isPdf =
                file.type ===
                    "application/pdf" ||

                file.name
                    .toLowerCase()
                    .endsWith(".pdf");


            if (!isPdf) {

                setError(
                    "Please select a PDF file."
                );

                return;

            }


            try {

                setError("");


                const count =
                    await getPdfPageCount(
                        file
                    );


                setPdfFile(
                    file
                );


                setPageCount(
                    count
                );


                setPageSelection("");


            } catch (error) {

                console.error(
                    error
                );


                setError(
                    "Unable to read this PDF."
                );

            }

        };


    /*
     * =========================================
     * FILE INPUT
     * =========================================
     */

    const handleFileChange =
        async (event) => {

            const file =
                event.target
                    .files?.[0];


            await loadPdf(
                file
            );


            event.target.value =
                "";

        };


    /*
     * =========================================
     * DROP
     * =========================================
     */

    const handleDrop =
        async (event) => {

            event.preventDefault();

            setIsDraggingOver(
                false
            );


            const file =
                event.dataTransfer
                    .files?.[0];


            await loadPdf(
                file
            );

        };


    /*
     * =========================================
     * REMOVE
     * =========================================
     */

    const removePdf = () => {

        setPdfFile(null);

        setPageCount(0);

        setPageSelection("");

        setError("");

        setProgress({
            current: 0,
            total: 0
        });

    };


    /*
     * =========================================
     * DOWNLOAD
     * =========================================
     */

    const downloadBlob =
        (
            blob,
            fileName
        ) => {

            const url =
                URL.createObjectURL(
                    blob
                );


            const anchor =
                document.createElement(
                    "a"
                );


            anchor.href =
                url;


            anchor.download =
                fileName;


            document.body.appendChild(
                anchor
            );


            anchor.click();

            anchor.remove();


            URL.revokeObjectURL(
                url
            );

        };


    /*
     * =========================================
     * CONVERT
     * =========================================
     */

    const handleConvert =
        async () => {

            if (!pdfFile) {

                setError(
                    "Please select a PDF first."
                );

                return;

            }


            try {

                setError("");

                setIsConverting(
                    true
                );


                let pages;


                /*
                 * ALL PAGES
                 */
                if (
                    convertMode === "all"
                ) {

                    pages =
                        Array.from(
                            {
                                length:
                                    pageCount
                            },
                            (
                                _,
                                index
                            ) =>
                                index + 1
                        );

                } else {

                    /*
                     * SELECTED PAGES
                     */
                    pages =
                        parseJpgPageSelection(
                            pageSelection,
                            pageCount
                        );

                }


                setProgress({
                    current: 0,
                    total:
                        pages.length
                });


                const images =
                    await convertPdfToJpg(
                        pdfFile,
                        pages,
                        quality,
                        ({
                            current,
                            total
                        }) => {

                            setProgress({
                                current,
                                total
                            });

                        }
                    );


                /*
                 * ONE PAGE:
                 * download JPG directly.
                 */
                if (
                    images.length === 1
                ) {

                    downloadBlob(
                        images[0].blob,
                        `FileNest-page-${images[0].pageNumber}.jpg`
                    );

                } else {

                    /*
                     * MULTIPLE PAGES:
                     * ZIP download.
                     */
                    const zipBlob =
                        await createJpgZip(
                            images
                        );


                    downloadBlob(
                        zipBlob,
                        "FileNest-PDF-to-JPG.zip"
                    );

                }


            } catch (error) {

                console.error(
                    error
                );


                setError(
                    error.message ||
                    "Unable to convert PDF to JPG."
                );


            } finally {

                setIsConverting(
                    false
                );

            }

        };


    return (

        <div className="pdf-jpg-card">


            {/* HEADER */}

            <div className="pdf-jpg-header">

                <span className="pdf-jpg-label">

                    PDF → JPG

                </span>


                <h1>

                    Convert PDF to JPG

                </h1>


                <p>

                    Turn PDF pages into
                    high-quality JPG images.

                </p>

            </div>



            {/* UPLOAD */}

            {
                !pdfFile
                    ? (

                        <label

                            className={
                                isDraggingOver

                                    ? "pdf-jpg-upload pdf-jpg-upload-active"

                                    : "pdf-jpg-upload"
                            }

                            onDrop={
                                handleDrop
                            }

                            onDragOver={(
                                event
                            ) => {

                                event.preventDefault();

                                setIsDraggingOver(
                                    true
                                );

                            }}

                            onDragLeave={() =>
                                setIsDraggingOver(
                                    false
                                )
                            }

                        >

                            <div className="pdf-jpg-upload-icon">

                                +

                            </div>


                            <h3>

                                Select or drop a PDF

                            </h3>


                            <p>

                                Convert PDF pages
                                into JPG images

                            </p>


                            <span className="pdf-jpg-select-button">

                                Select PDF

                            </span>


                            <input

                                type="file"

                                accept="application/pdf,.pdf"

                                onChange={
                                    handleFileChange
                                }

                            />

                        </label>

                    )
                    : (

                        <div className="pdf-jpg-selected">

                            <div className="pdf-jpg-file-icon">

                                PDF

                            </div>


                            <div className="pdf-jpg-file-info">

                                <strong>

                                    {
                                        pdfFile.name
                                    }

                                </strong>


                                <span>

                                    {
                                        formatFileSize(
                                            pdfFile.size
                                        )
                                    }

                                    {" • "}

                                    {
                                        pageCount
                                    }

                                    {
                                        pageCount === 1
                                            ? " page"
                                            : " pages"
                                    }

                                </span>

                            </div>


                            <button
                                type="button"
                                className="pdf-jpg-remove"
                                onClick={
                                    removePdf
                                }
                                aria-label="Remove PDF"
                            >

                                ×

                            </button>

                        </div>

                    )
            }



            {/* SETTINGS */}

            <div className="pdf-jpg-settings">


                <div className="pdf-jpg-settings-header">

                    <h3>

                        Conversion Settings

                    </h3>


                    <p>

                        Choose pages and output quality.

                    </p>

                </div>



                {/* PAGE MODE */}

                <div className="pdf-jpg-setting-group">

                    <label>

                        Pages

                    </label>


                    <div className="pdf-jpg-option-buttons">


                        <button
                            type="button"

                            className={
                                convertMode === "all"

                                    ? "pdf-jpg-option pdf-jpg-option-active"

                                    : "pdf-jpg-option"
                            }

                            onClick={() =>
                                setConvertMode(
                                    "all"
                                )
                            }
                        >

                            All Pages

                        </button>



                        <button
                            type="button"

                            className={
                                convertMode ===
                                "selected"

                                    ? "pdf-jpg-option pdf-jpg-option-active"

                                    : "pdf-jpg-option"
                            }

                            onClick={() =>
                                setConvertMode(
                                    "selected"
                                )
                            }
                        >

                            Select Pages

                        </button>

                    </div>

                </div>



                {
                    convertMode ===
                        "selected" && (

                        <div className="pdf-jpg-page-input">

                            <label>

                                Pages to convert

                            </label>


                            <input

                                type="text"

                                placeholder="Example: 1,3,5-8"

                                value={
                                    pageSelection
                                }

                                disabled={
                                    !pdfFile
                                }

                                onChange={(
                                    event
                                ) =>
                                    setPageSelection(
                                        event.target
                                            .value
                                    )
                                }

                            />


                            <p>

                                {
                                    pdfFile

                                        ? `This PDF has ${pageCount} pages.`

                                        : "Upload a PDF first."
                                }

                            </p>

                        </div>

                    )
                }



                {/* QUALITY */}

                <div className="pdf-jpg-setting-group">

                    <label>

                        JPG Quality

                    </label>


                    <div className="pdf-jpg-quality-grid">


                        <button
                            type="button"

                            className={
                                quality ===
                                "standard"

                                    ? "pdf-jpg-quality pdf-jpg-quality-active"

                                    : "pdf-jpg-quality"
                            }

                            onClick={() =>
                                setQuality(
                                    "standard"
                                )
                            }
                        >

                            <strong>
                                Standard
                            </strong>

                            <span>
                                Smaller file
                            </span>

                        </button>



                        <button
                            type="button"

                            className={
                                quality ===
                                "high"

                                    ? "pdf-jpg-quality pdf-jpg-quality-active"

                                    : "pdf-jpg-quality"
                            }

                            onClick={() =>
                                setQuality(
                                    "high"
                                )
                            }
                        >

                            <strong>
                                High
                            </strong>

                            <span>
                                Recommended
                            </span>

                        </button>



                        <button
                            type="button"

                            className={
                                quality ===
                                "very-high"

                                    ? "pdf-jpg-quality pdf-jpg-quality-active"

                                    : "pdf-jpg-quality"
                            }

                            onClick={() =>
                                setQuality(
                                    "very-high"
                                )
                            }
                        >

                            <strong>
                                Very High
                            </strong>

                            <span>
                                Larger image
                            </span>

                        </button>

                    </div>

                </div>

            </div>



            {/* PROGRESS */}

            {
                isConverting &&
                progress.total > 0 && (

                    <div className="pdf-jpg-progress">

                        <div className="pdf-jpg-progress-top">

                            <span>
                                Converting pages
                            </span>


                            <strong>

                                {
                                    progress.current
                                }

                                {" / "}

                                {
                                    progress.total
                                }

                            </strong>

                        </div>


                        <div className="pdf-jpg-progress-track">

                            <div
                                className="pdf-jpg-progress-bar"

                                style={{
                                    width:
                                        `${
                                            (
                                                progress.current /
                                                progress.total
                                            ) *
                                            100
                                        }%`
                                }}
                            />

                        </div>

                    </div>

                )
            }



            {/* ERROR */}

            {
                error && (

                    <div
                        className="pdf-jpg-error"
                        role="alert"
                    >

                        {error}

                    </div>

                )
            }



            {/* BUTTON */}

            <button
                type="button"

                className="pdf-jpg-main-button"

                onClick={
                    handleConvert
                }

                disabled={
                    !pdfFile ||
                    isConverting
                }
            >

                {
                    isConverting

                        ? `Converting ${
                              progress.current
                          } of ${
                              progress.total
                          }...`

                        : "Convert PDF to JPG"
                }

            </button>



            {/* PRIVACY */}

            <div className="pdf-jpg-privacy">

                🔒 Your PDF is converted
                directly inside your browser.
                Nothing is uploaded to our server.

            </div>

        </div>

    );

}


export default PdfToJpg;