const SUPPORTED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp"
];


const getOutputMimeType = (
    originalType,
    outputFormat
) => {

    if (
        !outputFormat ||
        outputFormat === "original"
    ) {
        return originalType;
    }


    if (outputFormat === "jpg") {
        return "image/jpeg";
    }


    if (outputFormat === "png") {
        return "image/png";
    }


    if (outputFormat === "webp") {
        return "image/webp";
    }


    return originalType;
};


const getExtension = (mimeType) => {

    switch (mimeType) {

        case "image/jpeg":
            return "jpg";

        case "image/png":
            return "png";

        case "image/webp":
            return "webp";

        default:
            return "jpg";
    }

};


const createFileName = (
    originalName,
    mimeType
) => {

    const extension =
        getExtension(
            mimeType
        );


    const lastDotIndex =
        originalName.lastIndexOf(".");


    const baseName =
        lastDotIndex > 0
            ? originalName.substring(
                  0,
                  lastDotIndex
              )
            : originalName;


    return `${baseName}-compressed.${extension}`;
};


const calculateDimensions = (
    width,
    height,
    maxWidth,
    maxHeight
) => {

    let newWidth =
        width;

    let newHeight =
        height;


    if (
        maxWidth &&
        newWidth > maxWidth
    ) {

        const ratio =
            maxWidth /
            newWidth;


        newWidth =
            maxWidth;

        newHeight =
            Math.round(
                newHeight *
                    ratio
            );

    }


    if (
        maxHeight &&
        newHeight > maxHeight
    ) {

        const ratio =
            maxHeight /
            newHeight;


        newHeight =
            maxHeight;

        newWidth =
            Math.round(
                newWidth *
                    ratio
            );

    }


    return {
        width:
            Math.max(
                1,
                Math.round(
                    newWidth
                )
            ),

        height:
            Math.max(
                1,
                Math.round(
                    newHeight
                )
            )
    };

};


const loadImage = (
    file
) => {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const image =
                new Image();


            const objectUrl =
                URL.createObjectURL(
                    file
                );


            image.onload =
                () => {

                    resolve({
                        image,
                        objectUrl
                    });

                };


            image.onerror =
                () => {

                    URL.revokeObjectURL(
                        objectUrl
                    );


                    reject(
                        new Error(
                            "Unable to load the selected image."
                        )
                    );

                };


            image.src =
                objectUrl;

        }
    );

};


const canvasToBlob = (
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
                                "Unable to compress the image."
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


export const compressImage =
    async (
        file,
        options = {}
    ) => {

        if (!file) {

            throw new Error(
                "Please select an image."
            );

        }


        if (
            !SUPPORTED_TYPES.includes(
                file.type
            )
        ) {

            throw new Error(
                "Only JPG, PNG and WebP images are supported."
            );

        }


        const {
            quality = 0.8,

            outputFormat =
                "original",

            maxWidth = null,

            maxHeight = null
        } = options;


        const safeQuality =
            Math.min(
                1,
                Math.max(
                    0.1,
                    Number(
                        quality
                    )
                )
            );


        const {
            image,
            objectUrl
        } =
            await loadImage(
                file
            );


        try {

            const dimensions =
                calculateDimensions(
                    image.naturalWidth,
                    image.naturalHeight,
                    maxWidth
                        ? Number(
                              maxWidth
                          )
                        : null,
                    maxHeight
                        ? Number(
                              maxHeight
                          )
                        : null
                );


            const outputMimeType =
                getOutputMimeType(
                    file.type,
                    outputFormat
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
                canvas.getContext(
                    "2d"
                );


            if (!context) {

                throw new Error(
                    "Your browser could not process this image."
                );

            }


            /*
             * JPEG does not support transparency.
             *
             * Use a white background when
             * converting PNG/WebP transparency
             * to JPEG.
             */
            if (
                outputMimeType ===
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


            let compressedBlob =
                await canvasToBlob(
                    canvas,
                    outputMimeType,
                    safeQuality
                );


            /*
             * PNG browsers usually ignore
             * the quality value.
             *
             * If keeping the original format
             * produces a larger file and the
             * dimensions were not reduced,
             * keep the original file instead.
             */
            const dimensionsChanged =
                dimensions.width !==
                    image.naturalWidth ||
                dimensions.height !==
                    image.naturalHeight;


            const sameFormat =
                outputMimeType ===
                file.type;


            if (
                sameFormat &&
                !dimensionsChanged &&
                compressedBlob.size >=
                    file.size
            ) {

                compressedBlob =
                    file;

            }


            const originalSize =
                file.size;


            const compressedSize =
                compressedBlob.size;


            const savedBytes =
                Math.max(
                    0,
                    originalSize -
                        compressedSize
                );


            const savingsPercent =
                originalSize > 0
                    ? Number(
                          (
                              (
                                  savedBytes /
                                  originalSize
                              ) *
                              100
                          ).toFixed(
                              1
                          )
                      )
                    : 0;


            return {

                blob:
                    compressedBlob,

                fileName:
                    createFileName(
                        file.name,
                        outputMimeType
                    ),

                originalSize,

                compressedSize,

                savedBytes,

                savingsPercent,

                originalWidth:
                    image.naturalWidth,

                originalHeight:
                    image.naturalHeight,

                width:
                    dimensions.width,

                height:
                    dimensions.height,

                mimeType:
                    compressedBlob.type ||
                    outputMimeType

            };


        } finally {

            URL.revokeObjectURL(
                objectUrl
            );

        }

    };