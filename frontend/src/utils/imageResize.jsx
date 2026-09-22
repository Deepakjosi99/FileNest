const loadImage = (file) => {

    return new Promise((resolve, reject) => {

        const imageUrl =
            URL.createObjectURL(file);

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
                    `Unable to read ${file.name}`
                )
            );

        };

        image.src =
            imageUrl;

    });

};


export const calculateResizeDimensions = (
    originalWidth,
    originalHeight,
    targetWidth,
    targetHeight,
    keepAspectRatio
) => {

    /*
     * Exact resize
     */
    if (!keepAspectRatio) {

        return {

            width:
                targetWidth,

            height:
                targetHeight

        };

    }


    /*
     * Keep original aspect ratio
     * and fit image inside the
     * requested width x height box.
     */

    const widthRatio =
        targetWidth /
        originalWidth;

    const heightRatio =
        targetHeight /
        originalHeight;

    const scale =
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
                    scale
                )
            ),

        height:
            Math.max(
                1,
                Math.round(
                    originalHeight *
                    scale
                )
            )

    };

};


const getQualityValue =
    (quality) => {

        switch (quality) {

            case "original":
                return 1;

            case "high":
                return 0.9;

            case "medium":
                return 0.75;

            case "low":
                return 0.55;

            default:
                return 0.9;

        }

    };


export const resizeImage = async (
    file,
    options
) => {

    const {

        width,
        height,
        keepAspectRatio = true,
        quality = "high"

    } = options;


    const image =
        await loadImage(file);


    const dimensions =
        calculateResizeDimensions(
            image.naturalWidth,
            image.naturalHeight,
            width,
            height,
            keepAspectRatio
        );


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        dimensions.width;

    canvas.height =
        dimensions.height;


    const context =
        canvas.getContext("2d");


    if (!context) {

        throw new Error(
            "Your browser could not resize the image."
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
     * PNG may contain transparency.
     *
     * Do not add white background
     * when PNG is selected.
     */
    if (
        file.type ===
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


    context.drawImage(
        image,
        0,
        0,
        dimensions.width,
        dimensions.height
    );


    const mimeType =
        file.type ===
        "image/png"
            ? "image/png"
            : "image/jpeg";


    const qualityValue =
        getQualityValue(
            quality
        );


    const blob =
        await new Promise(
            (resolve, reject) => {

                canvas.toBlob(
                    (result) => {

                        if (!result) {

                            reject(
                                new Error(
                                    `Unable to resize ${file.name}`
                                )
                            );

                            return;

                        }

                        resolve(result);

                    },

                    mimeType,

                    qualityValue
                );

            }
        );


    /*
     * Return File instead of Blob
     * so our existing PDF converter
     * continues to work normally.
     */
    return new File(
        [blob],
        file.name,
        {
            type:
                mimeType,

            lastModified:
                Date.now()
        }
    );

};
