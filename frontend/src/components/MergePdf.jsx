import {
    useRef,
    useState
} from "react";

import "../css/merge-pdf.css";

import {
    mergePdfFiles
} from "../utils/mergePdf";


function MergePdf() {

    /*
     * =========================
     * STATE
     * =========================
     */

    const [
        pdfFiles,
        setPdfFiles
    ] = useState([]);


    const [
        isDraggingOver,
        setIsDraggingOver
    ] = useState(false);


    const [
        isMerging,
        setIsMerging
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    /*
     * Stores the index of
     * the PDF being dragged.
     */
    const draggedIndex =
        useRef(null);


    /*
     * =========================
     * FORMAT FILE SIZE
     * =========================
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
     * =========================
     * ADD PDF FILES
     * =========================
     */

    const addPdfFiles =
        (files) => {

            const selectedFiles =
                Array.from(files);


            /*
             * Only allow PDF files.
             */
            const validPdfFiles =
                selectedFiles.filter(
                    (file) => {

                        return (
                            file.type ===
                                "application/pdf" ||

                            file.name
                                .toLowerCase()
                                .endsWith(
                                    ".pdf"
                                )
                        );

                    }
                );


            /*
             * User selected something
             * other than PDF.
             */
            if (
                validPdfFiles.length !==
                selectedFiles.length
            ) {

                setError(
                    "Only PDF files are supported."
                );

            } else {

                setError("");

            }


            /*
             * Create internal objects
             * for our UI.
             */
            const newFiles =
                validPdfFiles.map(
                    (file) => {

                        return {

                            id:
                                crypto.randomUUID(),

                            file

                        };

                    }
                );


            /*
             * Add newly selected PDFs
             * to existing PDFs.
             */
            setPdfFiles(
                (currentFiles) => [

                    ...currentFiles,

                    ...newFiles

                ]
            );

        };


    /*
     * =========================
     * FILE INPUT
     * =========================
     */

    const handleFileChange =
        (event) => {

            addPdfFiles(
                event.target.files
            );


            /*
             * Allows selecting
             * the same file again.
             */
            event.target.value =
                "";

        };


    /*
     * =========================
     * DROP PDF FILES
     * =========================
     */

    const handleDrop =
        (event) => {

            event.preventDefault();

            setIsDraggingOver(
                false
            );


            addPdfFiles(
                event.dataTransfer.files
            );

        };


    const handleDragOver =
        (event) => {

            event.preventDefault();

            setIsDraggingOver(
                true
            );

        };


    const handleDragLeave =
        () => {

            setIsDraggingOver(
                false
            );

        };


    /*
     * =========================
     * REMOVE ONE PDF
     * =========================
     */

    const removeFile =
        (id) => {

            setPdfFiles(
                (currentFiles) => {

                    return currentFiles.filter(
                        (pdf) =>
                            pdf.id !== id
                    );

                }
            );

        };


    /*
     * =========================
     * CLEAR ALL PDF FILES
     * =========================
     */

    const clearAll =
        () => {

            setPdfFiles([]);

            setError("");

        };


    /*
     * =========================
     * DESKTOP DRAG REORDERING
     * =========================
     */

    const handleDragStart =
        (index) => {

            draggedIndex.current =
                index;

        };


    const handleDragEnter =
        (targetIndex) => {

            const sourceIndex =
                draggedIndex.current;


            if (
                sourceIndex === null ||
                sourceIndex ===
                    targetIndex
            ) {

                return;

            }


            setPdfFiles(
                (currentFiles) => {

                    const updatedFiles =
                        [
                            ...currentFiles
                        ];


                    const [
                        movedFile
                    ] =
                        updatedFiles.splice(
                            sourceIndex,
                            1
                        );


                    updatedFiles.splice(
                        targetIndex,
                        0,
                        movedFile
                    );


                    return updatedFiles;

                }
            );


            draggedIndex.current =
                targetIndex;

        };


    const handleDragEnd =
        () => {

            draggedIndex.current =
                null;

        };


    /*
     * =========================
     * MOBILE / TABLET REORDER
     * =========================
     *
     * Touch devices do not
     * reliably support HTML5
     * drag and drop.
     *
     * These buttons provide an
     * accessible alternative.
     */

    const moveFileUp =
        (index) => {

            if (index <= 0) {

                return;

            }


            setPdfFiles(
                (currentFiles) => {

                    const updatedFiles =
                        [
                            ...currentFiles
                        ];


                    /*
                     * Swap with previous item.
                     */
                    [
                        updatedFiles[index - 1],
                        updatedFiles[index]
                    ] = [
                        updatedFiles[index],
                        updatedFiles[index - 1]
                    ];


                    return updatedFiles;

                }
            );

        };


    const moveFileDown =
        (index) => {

            setPdfFiles(
                (currentFiles) => {

                    /*
                     * Already last PDF.
                     */
                    if (
                        index >=
                        currentFiles.length - 1
                    ) {

                        return currentFiles;

                    }


                    const updatedFiles =
                        [
                            ...currentFiles
                        ];


                    /*
                     * Swap with next item.
                     */
                    [
                        updatedFiles[index],
                        updatedFiles[index + 1]
                    ] = [
                        updatedFiles[index + 1],
                        updatedFiles[index]
                    ];


                    return updatedFiles;

                }
            );

        };


    /*
     * =========================
     * MERGE PDFs
     * =========================
     */

    const handleMerge =
        async () => {

            if (
                pdfFiles.length < 2
            ) {

                setError(
                    "Please select at least two PDF files to merge."
                );

                return;

            }


            try {

                setIsMerging(true);

                setError("");


                /*
                 * Extract original File objects
                 * in the current selected order.
                 */
                const files =
                    pdfFiles.map(
                        (item) =>
                            item.file
                    );


                /*
                 * Merge using pdf-lib utility.
                 */
                const mergedBytes =
                    await mergePdfFiles(
                        files
                    );


                /*
                 * Create downloadable PDF.
                 */
                const blob =
                    new Blob(
                        [mergedBytes],
                        {
                            type:
                                "application/pdf"
                        }
                    );


                const downloadUrl =
                    URL.createObjectURL(
                        blob
                    );


                const anchor =
                    document.createElement(
                        "a"
                    );


                anchor.href =
                    downloadUrl;


                anchor.download =
                    "FileNest-Merged.pdf";


                document.body.appendChild(
                    anchor
                );


                anchor.click();


                anchor.remove();


                /*
                 * Clean temporary URL.
                 */
                URL.revokeObjectURL(
                    downloadUrl
                );


            } catch (error) {

                console.error(
                    error
                );


                setError(
                    error.message ||
                    "Unable to merge PDF files."
                );


            } finally {

                setIsMerging(
                    false
                );

            }

        };


    return (

        <div className="merge-pdf-card">


            {/* =========================
                HEADER
            ========================= */}

            <div className="merge-pdf-header">

                <span className="merge-tool-label">

                    MERGE PDF

                </span>


                <h1>

                    Merge PDF Files

                </h1>


                <p>

                    Combine multiple PDFs
                    into one document.

                </p>

            </div>



            {/* =========================
                UPLOAD AREA
            ========================= */}

            <label

                className={
                    isDraggingOver

                        ? "merge-upload-area merge-upload-active"

                        : "merge-upload-area"
                }

                onDrop={
                    handleDrop
                }

                onDragOver={
                    handleDragOver
                }

                onDragLeave={
                    handleDragLeave
                }

            >

                <div className="merge-upload-icon">

                    +

                </div>


                <h3>

                    Select or drop PDFs

                </h3>


                <p>

                    Select two or more PDF files

                </p>


                <span className="merge-select-button">

                    Select PDFs

                </span>


                <input

                    type="file"

                    accept="application/pdf,.pdf"

                    multiple

                    onChange={
                        handleFileChange
                    }

                />

            </label>



            {/* =========================
                SELECTED FILES
            ========================= */}

            {
                pdfFiles.length >
                    0 && (

                    <div className="merge-files-section">


                        {/* HEADER */}

                        <div className="merge-files-header">

                            <div>

                                <strong>

                                    Your PDFs

                                </strong>


                                <p>

                                    Drag on desktop
                                    or use arrows on
                                    mobile/tablet to
                                    change merge order

                                </p>

                            </div>


                            <button

                                type="button"

                                className="merge-clear-button"

                                onClick={
                                    clearAll
                                }

                            >

                                Clear all

                            </button>

                        </div>



                        {/* PDF LIST */}

                        <div className="merge-file-list">

                            {
                                pdfFiles.map(
                                    (
                                        pdf,
                                        index
                                    ) => (

                                        <div

                                            key={
                                                pdf.id
                                            }

                                            className="merge-file-card"

                                            draggable

                                            onDragStart={() =>
                                                handleDragStart(
                                                    index
                                                )
                                            }

                                            onDragEnter={() =>
                                                handleDragEnter(
                                                    index
                                                )
                                            }

                                            onDragEnd={
                                                handleDragEnd
                                            }

                                            onDragOver={(
                                                event
                                            ) =>
                                                event.preventDefault()
                                            }

                                        >


                                            {/* ORDER */}

                                            <div className="merge-order">

                                                {
                                                    index + 1
                                                }

                                            </div>



                                            {/* PDF ICON */}

                                            <div className="merge-pdf-icon">

                                                PDF

                                            </div>



                                            {/* FILE INFORMATION */}

                                            <div className="merge-file-info">

                                                <strong
                                                    title={
                                                        pdf.file.name
                                                    }
                                                >

                                                    {
                                                        pdf.file
                                                            .name
                                                    }

                                                </strong>


                                                <span>

                                                    {
                                                        formatFileSize(
                                                            pdf.file
                                                                .size
                                                        )
                                                    }

                                                </span>

                                            </div>



                                            {/* DESKTOP DRAG HANDLE */}

                                            <div
                                                className="merge-drag-handle"
                                                title="Drag to reorder"
                                            >

                                                ☰

                                            </div>



                                            {/* MOBILE / TABLET
                                                REORDER BUTTONS */}

                                            <div className="merge-touch-actions">


                                                {/* MOVE UP */}

                                                <button

                                                    type="button"

                                                    className="merge-move-button"

                                                    onClick={() =>
                                                        moveFileUp(
                                                            index
                                                        )
                                                    }

                                                    disabled={
                                                        index === 0
                                                    }

                                                    title="Move PDF up"

                                                    aria-label={
                                                        `Move ${pdf.file.name} up`
                                                    }

                                                >

                                                    ↑

                                                </button>



                                                {/* MOVE DOWN */}

                                                <button

                                                    type="button"

                                                    className="merge-move-button"

                                                    onClick={() =>
                                                        moveFileDown(
                                                            index
                                                        )
                                                    }

                                                    disabled={
                                                        index ===
                                                        pdfFiles.length -
                                                            1
                                                    }

                                                    title="Move PDF down"

                                                    aria-label={
                                                        `Move ${pdf.file.name} down`
                                                    }

                                                >

                                                    ↓

                                                </button>

                                            </div>



                                            {/* REMOVE */}

                                            <button

                                                type="button"

                                                className="merge-remove-button"

                                                onClick={() =>
                                                    removeFile(
                                                        pdf.id
                                                    )
                                                }

                                                title="Remove PDF"

                                                aria-label={
                                                    `Remove ${pdf.file.name}`
                                                }

                                            >

                                                ×

                                            </button>

                                        </div>

                                    )
                                )
                            }

                        </div>



                        {/* =========================
                            ADD MORE PDFs
                        ========================= */}

                        <label className="merge-add-more">

                            + Add More PDFs


                            <input

                                type="file"

                                accept="application/pdf,.pdf"

                                multiple

                                onChange={
                                    handleFileChange
                                }

                            />

                        </label>

                    </div>

                )
            }



            {/* =========================
                ERROR
            ========================= */}

            {
                error && (

                    <div
                        className="merge-error"
                        role="alert"
                    >

                        {error}

                    </div>

                )
            }



            {/* =========================
                MERGE BUTTON
            ========================= */}

            <button

                type="button"

                className="merge-main-button"

                onClick={
                    handleMerge
                }

                disabled={
                    isMerging ||
                    pdfFiles.length < 2
                }

            >

                {
                    isMerging

                        ? "Merging PDFs..."

                        : pdfFiles.length <
                            2

                            ? "Select at least 2 PDFs"

                            : `Merge ${
                                  pdfFiles.length
                              } PDFs`
                }

            </button>



            {/* =========================
                PRIVACY
            ========================= */}

            <div className="merge-privacy">

                🔒 PDFs are merged inside
                your browser. Your files
                are not uploaded to our
                server.

            </div>

        </div>

    );

}


export default MergePdf;