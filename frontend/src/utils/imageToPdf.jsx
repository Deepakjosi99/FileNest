import { PDFDocument } from "pdf-lib";

export const convertImagesToPdf = async (
    files,
    options = {}
) => {

    if (!files || files.length === 0) {
        throw new Error(
            "Please select at least one image."
        );
    }

    const {
        pageSize = "A4",
        orientation = "auto",
        margin = "medium"
    } = options;

    const pdfDoc = await PDFDocument.create();

    /*
     * Margin values are PDF points.
     */
    const marginValues = {
        none: 0,
        small: 15,
        medium: 30,
        large: 50
    };

    const marginValue =
        marginValues[margin] ?? 30;

    /*
     * Standard PDF page sizes.
     */
    const pageSizes = {

        A4: {
            width: 595.28,
            height: 841.89
        },

        LETTER: {
            width: 612,
            height: 792
        }

    };

    for (const file of files) {

        const imageBytes =
            await file.arrayBuffer();

        let image;

        /*
         * Embed image according to type.
         */
        if (file.type === "image/jpeg") {

            image =
                await pdfDoc.embedJpg(
                    imageBytes
                );

        } else if (
            file.type === "image/png"
        ) {

            image =
                await pdfDoc.embedPng(
                    imageBytes
                );

        } else {

            throw new Error(
                `${file.name} is not supported.`
            );

        }

        const originalWidth =
            image.width;

        const originalHeight =
            image.height;

        /*
         * Get selected page size.
         */
        const selectedPage =
            pageSizes[pageSize] ||
            pageSizes.A4;

        let pageWidth =
            selectedPage.width;

        let pageHeight =
            selectedPage.height;

        /*
         * ORIENTATION
         */

        if (orientation === "portrait") {

            pageWidth =
                Math.min(
                    selectedPage.width,
                    selectedPage.height
                );

            pageHeight =
                Math.max(
                    selectedPage.width,
                    selectedPage.height
                );

        } else if (
            orientation === "landscape"
        ) {

            pageWidth =
                Math.max(
                    selectedPage.width,
                    selectedPage.height
                );

            pageHeight =
                Math.min(
                    selectedPage.width,
                    selectedPage.height
                );

        } else {

            /*
             * AUTO
             *
             * Portrait image:
             * portrait PDF page.
             *
             * Landscape image:
             * landscape PDF page.
             */

            const imageIsLandscape =
                originalWidth >
                originalHeight;

            if (imageIsLandscape) {

                pageWidth =
                    Math.max(
                        selectedPage.width,
                        selectedPage.height
                    );

                pageHeight =
                    Math.min(
                        selectedPage.width,
                        selectedPage.height
                    );

            } else {

                pageWidth =
                    Math.min(
                        selectedPage.width,
                        selectedPage.height
                    );

                pageHeight =
                    Math.max(
                        selectedPage.width,
                        selectedPage.height
                    );

            }

        }

        /*
         * Available area after margin.
         */
        const availableWidth =
            pageWidth -
            marginValue * 2;

        const availableHeight =
            pageHeight -
            marginValue * 2;

        /*
         * Resize image while maintaining
         * original aspect ratio.
         */
        const scale =
            Math.min(
                availableWidth /
                    originalWidth,

                availableHeight /
                    originalHeight
            );

        const imageWidth =
            originalWidth * scale;

        const imageHeight =
            originalHeight * scale;

        /*
         * Create PDF page.
         */
        const page =
            pdfDoc.addPage([
                pageWidth,
                pageHeight
            ]);

        /*
         * Center image.
         */
        const x =
            (
                pageWidth -
                imageWidth
            ) / 2;

        const y =
            (
                pageHeight -
                imageHeight
            ) / 2;

        page.drawImage(
            image,
            {
                x,
                y,
                width: imageWidth,
                height: imageHeight
            }
        );

    }

    /*
     * Generate final PDF bytes.
     */
    return await pdfDoc.save();

};