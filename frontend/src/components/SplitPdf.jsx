import {
    useState
} from "react";

import "../css/split-pdf.css";

import {
    extractPdfPages,
    getPdfPageCount,
    parsePageSelection,
    parseRangeGroups,
    splitEveryPdfPage,
    splitPdfByRanges
} from "../utils/splitPdf";


function SplitPdf() {

    const [
        pdfFile,
        setPdfFile
    ] = useState(null);


    const [
        pageCount,
        setPageCount
    ] = useState(0);


    const [
        mode,
        setMode
    ] = useState("extract");


    const [
        pageSelection,
        setPageSelection
    ] = useState("");


    const [
        rangeSelection,
        setRangeSelection
    ] = useState("");


    const [
        isDraggingOver,
        setIsDraggingOver
    ] = useState(false);


    const [
        isProcessing,
        setIsProcessing
    ] = useState(false);


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

            if (bytes < 1024) {

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

                const totalPages =
                    await getPdfPageCount(
                        file
                    );


                setPdfFile(file);

                setPageCount(
                    totalPages
                );


                setPageSelection("");

                setRangeSelection("");


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
     * REMOVE PDF
     * =========================================
     */

    const removePdf = () => {

        setPdfFile(null);

        setPageCount(0);

        setPageSelection("");

        setRangeSelection("");

        setError("");

    };


    /*
     * =========================================
     * DOWNLOAD
     * =========================================
     */

    const downloadFile =
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
     * PROCESS
     * =========================================
     */

    const handleSplit =
        async () => {

            if (!pdfFile) {

                setError(
                    "Please select a PDF first."
                );

                return;

            }


            try {

                setIsProcessing(
                    true
                );

                setError("");


                /*
                 * EXTRACT PAGES
                 */
                if (
                    mode === "extract"
                ) {

                    const pages =
                        parsePageSelection(
                            pageSelection,
                            pageCount
                        );


                    const bytes =
                        await extractPdfPages(
                            pdfFile,
                            pages
                        );


                    const blob =
                        new Blob(
                            [bytes],
                            {
                                type:
                                    "application/pdf"
                            }
                        );


                    downloadFile(
                        blob,
                        "FileNest-Extracted-Pages.pdf"
                    );

                }


                /*
                 * SPLIT EVERY PAGE
                 */
                if (
                    mode ===
                    "every-page"
                ) {

                    const zipBlob =
                        await splitEveryPdfPage(
                            pdfFile
                        );


                    downloadFile(
                        zipBlob,
                        "FileNest-Split-Pages.zip"
                    );

                }


                /*
                 * SPLIT BY RANGES
                 */
                if (
                    mode === "ranges"
                ) {

                    const ranges =
                        parseRangeGroups(
                            rangeSelection,
                            pageCount
                        );


                    const zipBlob =
                        await splitPdfByRanges(
                            pdfFile,
                            ranges
                        );


                    downloadFile(
                        zipBlob,
                        "FileNest-Split-Ranges.zip"
                    );

                }


            } catch (error) {

                console.error(
                    error
                );


                setError(
                    error.message ||
                    "Unable to split PDF."
                );


            } finally {

                setIsProcessing(
                    false
                );

            }

        };


    /*
     * =========================================
     * BUTTON TEXT
     * =========================================
     */

    const getButtonText = () => {

        if (isProcessing) {

            return "Processing PDF...";

        }


        if (!pdfFile) {

            return "Select a PDF to Continue";

        }


        if (
            mode === "extract"
        ) {

            return "Extract Selected Pages";

        }


        if (
            mode ===
            "every-page"
        ) {

            return `Split All ${pageCount} Pages`;

        }


        return "Split PDF by Ranges";

    };


    return (

        <div className="split-pdf-card">


            {/* HEADER */}

            <div className="split-pdf-header">

                <span className="split-tool-label">

                    SPLIT PDF

                </span>


                <h1>

                    Split PDF Files

                </h1>


                <p>

                    Extract pages or divide
                    your PDF into separate files.

                </p>

            </div>



            {/* UPLOAD */}

            {
                !pdfFile
                    ? (

                        <label

                            className={
                                isDraggingOver

                                    ? "split-upload-area split-upload-active"

                                    : "split-upload-area"
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

                            <div className="split-upload-icon">

                                +

                            </div>


                            <h3>

                                Select or drop a PDF

                            </h3>


                            <p>

                                Choose the PDF you want
                                to split

                            </p>


                            <span className="split-select-button">

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

                        <div className="split-selected-file">

                            <div className="split-pdf-icon">

                                PDF

                            </div>


                            <div className="split-file-info">

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
                                className="split-remove-file"
                                onClick={
                                    removePdf
                                }
                                title="Remove PDF"
                            >

                                ×

                            </button>

                        </div>

                    )
            }



            {/* SPLIT OPTIONS */}

            <div className="split-options">


                <div className="split-options-header">

                    <h3>
                        How do you want to split?
                    </h3>

                    <p>
                        Choose one splitting method.
                    </p>

                </div>



                <div className="split-mode-grid">


                    {/* EXTRACT */}

                    <button
                        type="button"

                        className={
                            mode === "extract"
                                ? "split-mode-card split-mode-active"
                                : "split-mode-card"
                        }

                        onClick={() =>
                            setMode(
                                "extract"
                            )
                        }
                    >

                        <div className="split-mode-icon">
                            1,3
                        </div>

                        <div>

                            <strong>
                                Extract Pages
                            </strong>

                            <span>
                                Choose specific pages
                            </span>

                        </div>

                    </button>



                    {/* EVERY PAGE */}

                    <button
                        type="button"

                        className={
                            mode ===
                            "every-page"

                                ? "split-mode-card split-mode-active"

                                : "split-mode-card"
                        }

                        onClick={() =>
                            setMode(
                                "every-page"
                            )
                        }
                    >

                        <div className="split-mode-icon">
                            ✂
                        </div>

                        <div>

                            <strong>
                                Every Page
                            </strong>

                            <span>
                                One PDF per page
                            </span>

                        </div>

                    </button>



                    {/* RANGES */}

                    <button
                        type="button"

                        className={
                            mode === "ranges"
                                ? "split-mode-card split-mode-active"
                                : "split-mode-card"
                        }

                        onClick={() =>
                            setMode(
                                "ranges"
                            )
                        }
                    >

                        <div className="split-mode-icon">
                            1-3
                        </div>

                        <div>

                            <strong>
                                Page Ranges
                            </strong>

                            <span>
                                Create PDFs by ranges
                            </span>

                        </div>

                    </button>

                </div>



                {/* EXTRACT INPUT */}

                {
                    mode === "extract" && (

                        <div className="split-input-section">

                            <label>
                                Pages to extract
                            </label>


                            <input
                                type="text"

                                value={
                                    pageSelection
                                }

                                onChange={(
                                    event
                                ) =>
                                    setPageSelection(
                                        event.target
                                            .value
                                    )
                                }

                                placeholder="Example: 1,3,5-8"

                                disabled={
                                    !pdfFile
                                }
                            />


                            <p>

                                Enter individual pages
                                and ranges separated by
                                commas.

                                {
                                    pdfFile &&
                                    ` This PDF has ${pageCount} pages.`
                                }

                            </p>

                        </div>

                    )
                }



                {/* EVERY PAGE INFO */}

                {
                    mode ===
                        "every-page" && (

                        <div className="split-info-box">

                            {
                                pdfFile

                                    ? `This will create ${pageCount} individual PDF file${
                                        pageCount === 1
                                            ? ""
                                            : "s"
                                    } and download them as one ZIP.`

                                    : "Upload a PDF and each page will be saved as an individual PDF inside a ZIP file."
                            }

                        </div>

                    )
                }



                {/* RANGE INPUT */}

                {
                    mode === "ranges" && (

                        <div className="split-input-section">

                            <label>
                                PDF ranges
                            </label>


                            <input
                                type="text"

                                value={
                                    rangeSelection
                                }

                                onChange={(
                                    event
                                ) =>
                                    setRangeSelection(
                                        event.target
                                            .value
                                    )
                                }

                                placeholder="Example: 1-3 / 4-7 / 8-10"

                                disabled={
                                    !pdfFile
                                }
                            />


                            <p>

                                Separate each new PDF
                                range using /.

                                {
                                    pdfFile &&
                                    ` This PDF has ${pageCount} pages.`
                                }

                            </p>

                        </div>

                    )
                }

            </div>



            {/* ERROR */}

            {
                error && (

                    <div
                        className="split-error"
                        role="alert"
                    >

                        {error}

                    </div>

                )
            }



            {/* MAIN BUTTON */}

            <button
                type="button"

                className="split-main-button"

                onClick={
                    handleSplit
                }

                disabled={
                    !pdfFile ||
                    isProcessing
                }
            >

                {
                    getButtonText()
                }

            </button>



            {/* PRIVACY */}

            <div className="split-privacy">

                🔒 Your PDF is processed
                entirely inside your browser.
                Nothing is uploaded to our server.

            </div>

        </div>

    );

}


export default SplitPdf;