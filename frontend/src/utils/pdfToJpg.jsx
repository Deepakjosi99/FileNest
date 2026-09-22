import * as pdfjsLib
    from "pdfjs-dist/build/pdf.mjs";

import pdfWorkerUrl
    from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import JSZip
    from "jszip";


/*
 * =========================================
 * PDF.JS WORKER
 * =========================================
 */

pdfjsLib.GlobalWorkerOptions.workerSrc =
    pdfWorkerUrl;


/*
 * =========================================
 * DESTROY / CLEANUP PDF
 * =========================================
 *
 * Newer PDF.js versions removed
 * PDFDocumentProxy.destroy().
 *
 * The loading task now owns destroy().
 */
const destroyPdfDocument =
    async (pdf) => {

        if (!pdf) {

            return;

        }


        /*
         * Clean document resources first.
         */
        if (
            typeof pdf.cleanup ===
            "function"
        ) {

            try {

                await pdf.cleanup();

            } catch (error) {

                console.warn(
                    "PDF cleanup warning:",
                    error
                );

            }

        }


        /*
         * Current PDF.js versions.
         */
        if (
            pdf.loadingTask &&
            typeof pdf.loadingTask.destroy ===
            "function"
        ) {

            await pdf.loadingTask.destroy();

            return;

        }


        /*
         * Fallback for older
         * PDF.js versions.
         */
        if (
            typeof pdf.destroy ===
            "function"
        ) {

            await pdf.destroy();

        }

    };


/*
 * =========================================
 * LOAD PDF
 * =========================================
 */

export const loadPdfDocument =
    async (file) => {

        if (!file) {

            throw new Error(
                "Please select a PDF file."
            );

        }


        const arrayBuffer =
            await file.arrayBuffer();


        const pdfData =
            new Uint8Array(
                arrayBuffer
            );


        try {

            const loadingTask =
                pdfjsLib.getDocument({
                    data: pdfData
                });


            const pdf =
                await loadingTask.promise;


            return pdf;


        } catch (error) {

            console.error(
                "PDF.js load error:",
                error
            );


            if (
                error?.name ===
                "PasswordException"
            ) {

                throw new Error(
                    "This PDF is password protected. Please unlock it first."
                );

            }


            if (
                error?.name ===
                "InvalidPDFException"
            ) {

                throw new Error(
                    "This PDF appears to be invalid or corrupted."
                );

            }


            if (
                error?.name ===
                "MissingPDFException"
            ) {

                throw new Error(
                    "The PDF file could not be found or read."
                );

            }


            throw new Error(
                error?.message ||
                "Unable to read this PDF."
            );

        }

    };


/*
 * =========================================
 * GET PAGE COUNT
 * =========================================
 */

export const getPdfPageCount =
    async (file) => {

        const pdf =
            await loadPdfDocument(
                file
            );


        try {

            return pdf.numPages;

        } finally {

            /*
             * IMPORTANT:
             *
             * Do NOT use:
             *
             * await pdf.destroy();
             */
            await destroyPdfDocument(
                pdf
            );

        }

    };


/*
 * =========================================
 * PARSE PAGE SELECTION
 *
 * Example:
 *
 * 1,3,5-7
 *
 * becomes:
 *
 * [1, 3, 5, 6, 7]
 * =========================================
 */

export const parseJpgPageSelection =
    (
        value,
        totalPages
    ) => {

        if (
            !value ||
            !value.trim()
        ) {

            throw new Error(
                "Please enter the pages you want to convert."
            );

        }


        const result = [];

        const usedPages =
            new Set();


        const parts =
            value
                .split(",")
                .map(
                    (part) =>
                        part.trim()
                )
                .filter(Boolean);


        for (const part of parts) {


            /*
             * PAGE RANGE
             *
             * Example:
             *
             * 5-8
             */
            if (
                part.includes("-")
            ) {

                const rangeParts =
                    part
                        .split("-")
                        .map(
                            (item) =>
                                item.trim()
                        );


                if (
                    rangeParts.length !== 2
                ) {

                    throw new Error(
                        `Invalid page range: ${part}`
                    );

                }


                const start =
                    Number(
                        rangeParts[0]
                    );


                const end =
                    Number(
                        rangeParts[1]
                    );


                if (
                    !Number.isInteger(start) ||
                    !Number.isInteger(end)
                ) {

                    throw new Error(
                        `Invalid page range: ${part}`
                    );

                }


                if (
                    start < 1 ||
                    end < 1
                ) {

                    throw new Error(
                        "Page numbers must start from 1."
                    );

                }


                if (
                    start > end
                ) {

                    throw new Error(
                        `Invalid range ${part}. Start page cannot be greater than end page.`
                    );

                }


                if (
                    start > totalPages ||
                    end > totalPages
                ) {

                    throw new Error(
                        `Range ${part} is outside this PDF. This PDF has ${totalPages} pages.`
                    );

                }


                for (
                    let pageNumber = start;
                    pageNumber <= end;
                    pageNumber++
                ) {

                    if (
                        !usedPages.has(
                            pageNumber
                        )
                    ) {

                        result.push(
                            pageNumber
                        );


                        usedPages.add(
                            pageNumber
                        );

                    }

                }

            } else {


                /*
                 * SINGLE PAGE
                 */

                const pageNumber =
                    Number(part);


                if (
                    !Number.isInteger(
                        pageNumber
                    )
                ) {

                    throw new Error(
                        `Invalid page number: ${part}`
                    );

                }


                if (
                    pageNumber < 1
                ) {

                    throw new Error(
                        "Page numbers must start from 1."
                    );

                }


                if (
                    pageNumber >
                    totalPages
                ) {

                    throw new Error(
                        `Page ${pageNumber} does not exist. This PDF has ${totalPages} pages.`
                    );

                }


                if (
                    !usedPages.has(
                        pageNumber
                    )
                ) {

                    result.push(
                        pageNumber
                    );


                    usedPages.add(
                        pageNumber
                    );

                }

            }

        }


        if (
            result.length === 0
        ) {

            throw new Error(
                "Please select at least one page."
            );

        }


        return result;

    };


/*
 * =========================================
 * JPG QUALITY
 * =========================================
 */

const getRenderSettings =
    (quality) => {

        switch (quality) {


            case "standard":

                return {

                    scale: 1.5,

                    jpegQuality: 0.82

                };


            case "very-high":

                return {

                    scale: 3,

                    jpegQuality: 0.95

                };


            case "high":

            default:

                return {

                    scale: 2,

                    jpegQuality: 0.90

                };

        }

    };


/*
 * =========================================
 * CANVAS → JPG
 * =========================================
 */

const canvasToJpg =
    (
        canvas,
        jpegQuality
    ) => {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                canvas.toBlob(

                    (blob) => {

                        if (!blob) {

                            reject(
                                new Error(
                                    "Unable to create JPG image."
                                )
                            );

                            return;

                        }


                        resolve(
                            blob
                        );

                    },

                    "image/jpeg",

                    jpegQuality

                );

            }
        );

    };


/*
 * =========================================
 * RENDER ONE PDF PAGE
 * =========================================
 */

const renderPageToJpg =
    async (
        pdf,
        pageNumber,
        quality
    ) => {

        const settings =
            getRenderSettings(
                quality
            );


        const page =
            await pdf.getPage(
                pageNumber
            );


        try {

            const viewport =
                page.getViewport({

                    scale:
                        settings.scale

                });


            const canvas =
                document.createElement(
                    "canvas"
                );


            const context =
                canvas.getContext(
                    "2d",
                    {
                        alpha: false
                    }
                );


            if (!context) {

                throw new Error(
                    "Your browser could not create the JPG image."
                );

            }


            canvas.width =
                Math.ceil(
                    viewport.width
                );


            canvas.height =
                Math.ceil(
                    viewport.height
                );


            /*
             * JPG doesn't support
             * transparency.
             */
            context.fillStyle =
                "#ffffff";


            context.fillRect(

                0,

                0,

                canvas.width,

                canvas.height

            );


            const renderTask =
                page.render({

                    canvasContext:
                        context,

                    viewport:
                        viewport

                });


            await renderTask.promise;


            const jpgBlob =
                await canvasToJpg(

                    canvas,

                    settings.jpegQuality

                );


            /*
             * Release canvas memory.
             */
            canvas.width = 1;

            canvas.height = 1;


            return jpgBlob;


        } finally {

            /*
             * Release page-specific
             * resources.
             */
            if (
                typeof page.cleanup ===
                "function"
            ) {

                page.cleanup();

            }

        }

    };


/*
 * =========================================
 * CONVERT PDF → JPG
 * =========================================
 */

export const convertPdfToJpg =
    async (
        file,
        pageNumbers,
        quality = "high",
        onProgress
    ) => {

        if (
            !pageNumbers ||
            pageNumbers.length === 0
        ) {

            throw new Error(
                "No PDF pages were selected."
            );

        }


        const pdf =
            await loadPdfDocument(
                file
            );


        try {

            const images = [];


            for (
                let index = 0;
                index < pageNumbers.length;
                index++
            ) {

                const pageNumber =
                    pageNumbers[
                        index
                    ];


                if (
                    pageNumber < 1 ||
                    pageNumber >
                    pdf.numPages
                ) {

                    throw new Error(
                        `Page ${pageNumber} does not exist.`
                    );

                }


                const blob =
                    await renderPageToJpg(

                        pdf,

                        pageNumber,

                        quality

                    );


                images.push({

                    pageNumber,

                    blob

                });


                /*
                 * UPDATE PROGRESS
                 */
                if (
                    typeof onProgress ===
                    "function"
                ) {

                    onProgress({

                        current:
                            index + 1,

                        total:
                            pageNumbers.length

                    });

                }

            }


            return images;


        } finally {

            /*
             * IMPORTANT:
             *
             * New PDF.js:
             *
             * pdf.loadingTask.destroy()
             *
             * not:
             *
             * pdf.destroy()
             */
            await destroyPdfDocument(
                pdf
            );

        }

    };


/*
 * =========================================
 * CREATE ZIP
 * =========================================
 */

export const createJpgZip =
    async (
        images
    ) => {

        if (
            !images ||
            images.length === 0
        ) {

            throw new Error(
                "No JPG images were created."
            );

        }


        const zip =
            new JSZip();


        /*
         * Makes filename ordering:
         *
         * page-01.jpg
         * page-02.jpg
         * ...
         * page-10.jpg
         */
        const numberWidth =
            Math.max(

                2,

                String(
                    Math.max(
                        ...images.map(
                            (image) =>
                                image.pageNumber
                        )
                    )
                ).length

            );


        images.forEach(
            (image) => {

                const pageNumber =
                    String(
                        image.pageNumber
                    ).padStart(
                        numberWidth,
                        "0"
                    );


                zip.file(

                    `page-${pageNumber}.jpg`,

                    image.blob

                );

            }
        );


        return await zip.generateAsync({

            type: "blob",

            compression:
                "DEFLATE",

            compressionOptions: {

                level: 6

            }

        });

    };