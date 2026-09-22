/*
 * =========================================
 * LOAD IMAGE
 * =========================================
 */

const loadImage =
    (file) => {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                const imageUrl =
                    URL.createObjectURL(
                        file
                    );


                const image =
                    new Image();


                image.onload = () => {

                    URL.revokeObjectURL(
                        imageUrl
                    );

                    resolve(image);

                };


                image.onerror = () => {

                    URL.revokeObjectURL(
                        imageUrl
                    );

                    reject(
                        new Error(
                            "Unable to read this image."
                        )
                    );

                };


                image.src =
                    imageUrl;

            }
        );

    };


/*
 * =========================================
 * IMAGE DIMENSIONS
 * =========================================
 */

export const getImageDimensions =
    async (file) => {

        const image =
            await loadImage(
                file
            );


        return {

            width:
                image.naturalWidth,

            height:
                image.naturalHeight

        };

    };


/*
 * =========================================
 * CALCULATE RESIZED DIMENSIONS
 * =========================================
 */

export const calculateResizeDimensions =
    (
        originalWidth,
        originalHeight,
        targetWidth,
        targetHeight,
        keepAspectRatio
    ) => {

        const width =
            Number(
                targetWidth
            );


        const height =
            Number(
                targetHeight
            );


        if (
            !Number.isFinite(width) ||
            !Number.isFinite(height) ||
            width <= 0 ||
            height <= 0
        ) {

            throw new Error(
                "Width and height must be greater than 0."
            );

        }


        if (
            width > 10000 ||
            height > 10000
        ) {

            throw new Error(
                "Maximum supported dimension is 10,000 pixels."
            );

        }


        /*
         * If aspect ratio is disabled,
         * use the exact dimensions.
         */
        if (
            !keepAspectRatio
        ) {

            return {

                width:
                    Math.round(
                        width
                    ),

                height:
                    Math.round(
                        height
                    )

            };

        }


        /*
         * Keep aspect ratio.
         *
         * Fit the image inside the
         * requested width × height.
         */
        const widthRatio =
            width /
            originalWidth;


        const heightRatio =
            height /
            originalHeight;


        const ratio =
            Math.min(
                widthRatio,
                heightRatio
            );


        return {

            width:
                Math.max(
                    1,
                    Math.round(
                        originalWidth *
                        ratio
                    )
                ),

            height:
                Math.max(
                    1,
                    Math.round(
                        originalHeight *
                        ratio
                    )
                )

        };

    };


/*
 * =========================================
 * QUALITY
 * =========================================
 */

const getQualityValue =
    (quality) => {

        switch (
            quality
        ) {

            case "medium":

                return 0.75;


            case "low":

                return 0.55;


            case "high":

            default:

                return 0.9;

        }

    };


/*
 * =========================================
 * OUTPUT MIME TYPE
 * =========================================
 */

const getOutputType =
    (file) => {

        if (
            file.type ===
            "image/png"
        ) {

            return "image/png";

        }


        return "image/jpeg";

    };


/*
 * =========================================
 * CANVAS → BLOB
 * =========================================
 */

const canvasToBlob =
    (
        canvas,
        mimeType,
        quality
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
                                    "Unable to create the resized image."
                                )
                            );

                            return;

                        }


                        resolve(
                            blob
                        );

                    },

                    mimeType,

                    quality

                );

            }
        );

    };


/*
 * =========================================
 * RESIZE IMAGE
 * =========================================
 */

export const resizeStandaloneImage =
    async (
        file,
        options
    ) => {

        if (!file) {

            throw new Error(
                "Please select an image first."
            );

        }


        const {
            width,
            height,
            keepAspectRatio = true,
            quality = "high"
        } = options;


        const image =
            await loadImage(
                file
            );


        const originalWidth =
            image.naturalWidth;


        const originalHeight =
            image.naturalHeight;


        const newDimensions =
            calculateResizeDimensions(

                originalWidth,

                originalHeight,

                width,

                height,

                keepAspectRatio

            );


        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            newDimensions.width;


        canvas.height =
            newDimensions.height;


        const context =
            canvas.getContext(
                "2d"
            );


        if (!context) {

            throw new Error(
                "Your browser could not resize this image."
            );

        }


        /*
         * Better resizing quality.
         */
        context.imageSmoothingEnabled =
            true;


        context.imageSmoothingQuality =
            "high";


        /*
         * JPG cannot contain transparency.
         *
         * Fill white first.
         */
        const outputType =
            getOutputType(
                file
            );


        if (
            outputType ===
            "image/jpeg"
        ) {

            context.fillStyle =
                "#ffffff";


            context.fillRect(

                0,

                0,

                canvas.width,

                canvas.height

            );

        }


        /*
         * Draw resized image.
         */
        context.drawImage(

            image,

            0,

            0,

            newDimensions.width,

            newDimensions.height

        );


        const blob =
            await canvasToBlob(

                canvas,

                outputType,

                getQualityValue(
                    quality
                )

            );


        /*
         * Release canvas memory.
         */
        canvas.width = 1;

        canvas.height = 1;


        return {

            blob,

            width:
                newDimensions.width,

            height:
                newDimensions.height,

            mimeType:
                outputType

        };

    };


/*
 * =========================================
 * DOWNLOAD FILE NAME
 * =========================================
 */

export const createResizedFileName =
    (
        originalName,
        mimeType
    ) => {

        const nameWithoutExtension =
            originalName.replace(
                /\.[^/.]+$/,
                ""
            );


        const extension =
            mimeType ===
            "image/png"
                ? "png"
                : "jpg";


        return `${nameWithoutExtension}-resized.${extension}`;

    };