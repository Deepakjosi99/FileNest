import {
    PDFDocument
} from "pdf-lib";


export const mergePdfFiles =
    async (files) => {

        if (
            !files ||
            files.length < 2
        ) {

            throw new Error(
                "Please select at least two PDF files."
            );

        }


        /*
         * Create final PDF
         */
        const mergedPdf =
            await PDFDocument.create();


        /*
         * Read every uploaded PDF
         */
        for (const file of files) {

            const fileBytes =
                await file.arrayBuffer();


            /*
             * Load uploaded PDF
             */
            const sourcePdf =
                await PDFDocument.load(
                    fileBytes
                );


            /*
             * Copy all pages
             */
            const copiedPages =
                await mergedPdf.copyPages(
                    sourcePdf,
                    sourcePdf.getPageIndices()
                );


            /*
             * Add copied pages
             * to final PDF
             */
            copiedPages.forEach(
                (page) => {

                    mergedPdf.addPage(
                        page
                    );

                }
            );

        }


        /*
         * Generate merged PDF
         */
        return await mergedPdf.save();

    };