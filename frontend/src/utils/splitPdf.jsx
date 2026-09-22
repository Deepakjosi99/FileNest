import {
    PDFDocument
} from "pdf-lib";

import JSZip
    from "jszip";


/*
 * =========================================
 * LOAD PDF / PAGE COUNT
 * =========================================
 */

export const getPdfPageCount =
    async (file) => {

        const bytes =
            await file.arrayBuffer();

        const pdf =
            await PDFDocument.load(
                bytes
            );

        return pdf.getPageCount();

    };


/*
 * =========================================
 * PARSE PAGE SELECTION
 *
 * Example:
 *
 * 1,3,5-8
 *
 * becomes:
 *
 * [1, 3, 5, 6, 7, 8]
 * =========================================
 */

export const parsePageSelection =
    (
        value,
        totalPages
    ) => {

        if (
            !value ||
            !value.trim()
        ) {

            throw new Error(
                "Please enter the pages you want to extract."
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
             * RANGE
             *
             * Example:
             * 5-8
             */
            if (
                part.includes("-")
            ) {

                const rangeParts =
                    part.split("-");


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
                    end < 1 ||
                    start > totalPages ||
                    end > totalPages
                ) {

                    throw new Error(
                        `Page range ${part} is outside this PDF. It has ${totalPages} pages.`
                    );

                }


                if (start > end) {

                    throw new Error(
                        `Invalid range ${part}. Start page cannot be greater than end page.`
                    );

                }


                for (
                    let page = start;
                    page <= end;
                    page++
                ) {

                    if (
                        !usedPages.has(page)
                    ) {

                        result.push(page);

                        usedPages.add(page);

                    }

                }

            } else {

                /*
                 * SINGLE PAGE
                 */
                const page =
                    Number(part);


                if (
                    !Number.isInteger(page)
                ) {

                    throw new Error(
                        `Invalid page number: ${part}`
                    );

                }


                if (
                    page < 1 ||
                    page > totalPages
                ) {

                    throw new Error(
                        `Page ${page} does not exist. This PDF has ${totalPages} pages.`
                    );

                }


                if (
                    !usedPages.has(page)
                ) {

                    result.push(page);

                    usedPages.add(page);

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
 * PARSE RANGE GROUPS
 *
 * Example:
 *
 * 1-3 / 4-7 / 8-10
 *
 * becomes:
 *
 * [
 *   [1,2,3],
 *   [4,5,6,7],
 *   [8,9,10]
 * ]
 * =========================================
 */

export const parseRangeGroups =
    (
        value,
        totalPages
    ) => {

        if (
            !value ||
            !value.trim()
        ) {

            throw new Error(
                "Please enter PDF ranges."
            );

        }


        const groups =
            value
                .split("/")
                .map(
                    (group) =>
                        group.trim()
                )
                .filter(Boolean);


        if (
            groups.length === 0
        ) {

            throw new Error(
                "Please enter at least one range."
            );

        }


        return groups.map(
            (group) => {

                return parsePageSelection(
                    group,
                    totalPages
                );

            }
        );

    };


/*
 * =========================================
 * EXTRACT SELECTED PAGES
 * =========================================
 */

export const extractPdfPages =
    async (
        file,
        pageNumbers
    ) => {

        const bytes =
            await file.arrayBuffer();


        const sourcePdf =
            await PDFDocument.load(
                bytes
            );


        const outputPdf =
            await PDFDocument.create();


        /*
         * pdf-lib uses zero-based indexes.
         */
        const indexes =
            pageNumbers.map(
                (page) =>
                    page - 1
            );


        const copiedPages =
            await outputPdf.copyPages(
                sourcePdf,
                indexes
            );


        copiedPages.forEach(
            (page) => {

                outputPdf.addPage(
                    page
                );

            }
        );


        return await outputPdf.save();

    };


/*
 * =========================================
 * SPLIT EVERY PAGE
 * =========================================
 */

export const splitEveryPdfPage =
    async (file) => {

        const bytes =
            await file.arrayBuffer();


        const sourcePdf =
            await PDFDocument.load(
                bytes
            );


        const pageCount =
            sourcePdf.getPageCount();


        const zip =
            new JSZip();


        for (
            let index = 0;
            index < pageCount;
            index++
        ) {

            const pagePdf =
                await PDFDocument.create();


            const [
                copiedPage
            ] =
                await pagePdf.copyPages(
                    sourcePdf,
                    [index]
                );


            pagePdf.addPage(
                copiedPage
            );


            const pageBytes =
                await pagePdf.save();


            zip.file(
                `page-${index + 1}.pdf`,
                pageBytes
            );

        }


        return await zip.generateAsync({
            type: "blob"
        });

    };


/*
 * =========================================
 * SPLIT PDF BY RANGES
 * =========================================
 */

export const splitPdfByRanges =
    async (
        file,
        rangeGroups
    ) => {

        const bytes =
            await file.arrayBuffer();


        const sourcePdf =
            await PDFDocument.load(
                bytes
            );


        const zip =
            new JSZip();


        for (
            let index = 0;
            index < rangeGroups.length;
            index++
        ) {

            const pages =
                rangeGroups[index];


            const outputPdf =
                await PDFDocument.create();


            const pageIndexes =
                pages.map(
                    (page) =>
                        page - 1
                );


            const copiedPages =
                await outputPdf.copyPages(
                    sourcePdf,
                    pageIndexes
                );


            copiedPages.forEach(
                (page) => {

                    outputPdf.addPage(
                        page
                    );

                }
            );


            const outputBytes =
                await outputPdf.save();


            const firstPage =
                pages[0];

            const lastPage =
                pages[
                    pages.length - 1
                ];


            const fileName =
                firstPage === lastPage

                    ? `page-${firstPage}.pdf`

                    : `pages-${firstPage}-${lastPage}.pdf`;


            zip.file(
                fileName,
                outputBytes
            );

        }


        return await zip.generateAsync({
            type: "blob"
        });

    };