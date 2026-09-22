import {
    useEffect,
    useMemo,
    useState
} from "react";

import "../css/resize-image.css";

import {
    calculateResizeDimensions,
    createResizedFileName,
    getImageDimensions,
    resizeStandaloneImage
} from "../utils/standaloneImageResize";


function ResizeImage() {

    const [
        imageFile,
        setImageFile
    ] = useState(null);


    const [
        originalDimensions,
        setOriginalDimensions
    ] = useState({
        width: 0,
        height: 0
    });


    const [
        targetWidth,
        setTargetWidth
    ] = useState("");


    const [
        targetHeight,
        setTargetHeight
    ] = useState("");


    const [
        keepAspectRatio,
        setKeepAspectRatio
    ] = useState(true);


    const [
        quality,
        setQuality
    ] = useState("high");


    const [
        previewUrl,
        setPreviewUrl
    ] = useState("");


    const [
        resizedResult,
        setResizedResult
    ] = useState(null);


    const [
        resultPreviewUrl,
        setResultPreviewUrl
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
     * CLEAN PREVIEW URLS
     * =========================================
     */

    useEffect(() => {

        return () => {

            if (previewUrl) {

                URL.revokeObjectURL(
                    previewUrl
                );

            }


            if (resultPreviewUrl) {

                URL.revokeObjectURL(
                    resultPreviewUrl
                );

            }

        };

    }, [
        previewUrl,
        resultPreviewUrl
    ]);


    /*
     * =========================================
     * FORMAT FILE SIZE
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
     * VALIDATE IMAGE
     * =========================================
     */

    const isSupportedImage =
        (file) => {

            if (!file) {

                return false;

            }


            const lowerName =
                file.name
                    .toLowerCase();


            return (
                file.type === "image/jpeg" ||
                file.type === "image/png" ||
                lowerName.endsWith(".jpg") ||
                lowerName.endsWith(".jpeg") ||
                lowerName.endsWith(".png")
            );

        };


    /*
     * =========================================
     * CLEAR OLD RESULT
     * =========================================
     */

    const clearResult = () => {

        if (
            resultPreviewUrl
        ) {

            URL.revokeObjectURL(
                resultPreviewUrl
            );

        }


        setResultPreviewUrl("");

        setResizedResult(null);

    };


    /*
     * =========================================
     * LOAD IMAGE
     * =========================================
     */

    const loadImageFile =
        async (file) => {

            if (!file) {

                return;

            }


            if (
                !isSupportedImage(
                    file
                )
            ) {

                setError(
                    "Please select a JPG, JPEG or PNG image."
                );

                return;

            }


            try {

                setError("");

                clearResult();


                const dimensions =
                    await getImageDimensions(
                        file
                    );


                /*
                 * Remove previous preview.
                 */
                if (
                    previewUrl
                ) {

                    URL.revokeObjectURL(
                        previewUrl
                    );

                }


                const newPreviewUrl =
                    URL.createObjectURL(
                        file
                    );


                setImageFile(
                    file
                );


                setPreviewUrl(
                    newPreviewUrl
                );


                setOriginalDimensions({
                    width:
                        dimensions.width,

                    height:
                        dimensions.height
                });


                /*
                 * Start with original
                 * dimensions.
                 */
                setTargetWidth(
                    String(
                        dimensions.width
                    )
                );


                setTargetHeight(
                    String(
                        dimensions.height
                    )
                );


                setKeepAspectRatio(
                    true
                );


                setQuality(
                    "high"
                );


            } catch (error) {

                console.error(
                    "Resize image load error:",
                    error
                );


                setError(
                    error?.message ||
                    "Unable to read this image."
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


            await loadImageFile(
                file
            );


            event.target.value =
                "";

        };


    /*
     * =========================================
     * DROP IMAGE
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


            await loadImageFile(
                file
            );

        };


    /*
     * =========================================
     * WIDTH CHANGE
     * =========================================
     */

    const handleWidthChange =
        (event) => {

            const value =
                event.target.value;


            setTargetWidth(
                value
            );


            clearResult();


            if (
                !keepAspectRatio ||
                !imageFile
            ) {

                return;

            }


            const width =
                Number(
                    value
                );


            if (
                !Number.isFinite(
                    width
                ) ||
                width <= 0
            ) {

                return;

            }


            const ratio =
                originalDimensions.height /
                originalDimensions.width;


            const calculatedHeight =
                Math.round(
                    width *
                    ratio
                );


            setTargetHeight(
                String(
                    calculatedHeight
                )
            );

        };


    /*
     * =========================================
     * HEIGHT CHANGE
     * =========================================
     */

    const handleHeightChange =
        (event) => {

            const value =
                event.target.value;


            setTargetHeight(
                value
            );


            clearResult();


            if (
                !keepAspectRatio ||
                !imageFile
            ) {

                return;

            }


            const height =
                Number(
                    value
                );


            if (
                !Number.isFinite(
                    height
                ) ||
                height <= 0
            ) {

                return;

            }


            const ratio =
                originalDimensions.width /
                originalDimensions.height;


            const calculatedWidth =
                Math.round(
                    height *
                    ratio
                );


            setTargetWidth(
                String(
                    calculatedWidth
                )
            );

        };


    /*
     * =========================================
     * ASPECT RATIO TOGGLE
     * =========================================
     */

    const handleAspectRatioChange =
        () => {

            const newValue =
                !keepAspectRatio;


            setKeepAspectRatio(
                newValue
            );


            clearResult();


            /*
             * When aspect ratio is turned
             * back ON, recalculate height
             * from the current width.
             */
            if (
                newValue &&
                imageFile
            ) {

                const width =
                    Number(
                        targetWidth
                    );


                if (
                    Number.isFinite(
                        width
                    ) &&
                    width > 0
                ) {

                    const ratio =
                        originalDimensions.height /
                        originalDimensions.width;


                    setTargetHeight(
                        String(
                            Math.round(
                                width *
                                ratio
                            )
                        )
                    );

                }

            }

        };


    /*
     * =========================================
     * ESTIMATED OUTPUT SIZE
     * =========================================
     */

    const expectedDimensions =
        useMemo(
            () => {

                if (
                    !imageFile ||
                    !targetWidth ||
                    !targetHeight
                ) {

                    return null;

                }


                try {

                    return calculateResizeDimensions(

                        originalDimensions.width,

                        originalDimensions.height,

                        Number(
                            targetWidth
                        ),

                        Number(
                            targetHeight
                        ),

                        keepAspectRatio

                    );


                } catch {

                    return null;

                }

            },
            [
                imageFile,
                originalDimensions,
                targetWidth,
                targetHeight,
                keepAspectRatio
            ]
        );


    /*
     * =========================================
     * RESIZE IMAGE
     * =========================================
     */

    const handleResize =
        async () => {

            if (!imageFile) {

                setError(
                    "Please select an image first."
                );

                return;

            }


            try {

                setError("");

                setIsProcessing(
                    true
                );


                const result =
                    await resizeStandaloneImage(

                        imageFile,

                        {
                            width:
                                Number(
                                    targetWidth
                                ),

                            height:
                                Number(
                                    targetHeight
                                ),

                            keepAspectRatio,

                            quality
                        }

                    );


                clearResult();


                const newResultUrl =
                    URL.createObjectURL(
                        result.blob
                    );


                setResultPreviewUrl(
                    newResultUrl
                );


                setResizedResult({
                    ...result,

                    fileName:
                        createResizedFileName(
                            imageFile.name,
                            result.mimeType
                        )
                });


            } catch (error) {

                console.error(
                    "Resize image error:",
                    error
                );


                setError(
                    error?.message ||
                    "Unable to resize this image."
                );


            } finally {

                setIsProcessing(
                    false
                );

            }

        };


    /*
     * =========================================
     * DOWNLOAD
     * =========================================
     */

    const handleDownload = () => {

        if (
            !resizedResult
        ) {

            return;

        }


        const url =
            URL.createObjectURL(
                resizedResult.blob
            );


        const anchor =
            document.createElement(
                "a"
            );


        anchor.href =
            url;


        anchor.download =
            resizedResult.fileName;


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
     * REMOVE IMAGE
     * =========================================
     */

    const removeImage = () => {

        if (
            previewUrl
        ) {

            URL.revokeObjectURL(
                previewUrl
            );

        }


        clearResult();


        setPreviewUrl("");

        setImageFile(null);


        setOriginalDimensions({
            width: 0,
            height: 0
        });


        setTargetWidth("");

        setTargetHeight("");

        setError("");

    };


    return (

        <div className="resize-image-card">


            {/* =====================================
                HEADER
            ===================================== */}

            <div className="resize-image-header">

                <span className="resize-image-label">

                    RESIZE IMAGE

                </span>


                <h1>

                    Resize Images Online

                </h1>


                <p>

                    Change image width and height
                    while keeping your files private.

                </p>

            </div>



            {/* =====================================
                UPLOAD
            ===================================== */}

            {
                !imageFile
                    ? (

                        <label

                            className={
                                isDraggingOver

                                    ? "resize-upload-area resize-upload-active"

                                    : "resize-upload-area"
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

                            <div className="resize-upload-icon">

                                +

                            </div>


                            <h3>

                                Select or drop an image

                            </h3>


                            <p>

                                JPG, JPEG and PNG supported

                            </p>


                            <span className="resize-select-button">

                                Select Image

                            </span>


                            <input

                                type="file"

                                accept="
                                    image/jpeg,
                                    image/png,
                                    .jpg,
                                    .jpeg,
                                    .png
                                "

                                onChange={
                                    handleFileChange
                                }

                            />

                        </label>

                    )
                    : (

                        <div className="resize-selected-image">


                            <div className="resize-preview-box">

                                <img
                                    src={
                                        previewUrl
                                    }
                                    alt="Selected"
                                />

                            </div>


                            <div className="resize-file-information">

                                <strong>

                                    {
                                        imageFile.name
                                    }

                                </strong>


                                <span>

                                    {
                                        formatFileSize(
                                            imageFile.size
                                        )
                                    }

                                </span>


                                <span>

                                    {
                                        originalDimensions.width
                                    }

                                    {" × "}

                                    {
                                        originalDimensions.height
                                    }

                                    {" px"}

                                </span>

                            </div>


                            <button
                                type="button"
                                className="resize-remove-button"
                                onClick={
                                    removeImage
                                }
                                aria-label="Remove image"
                                title="Remove image"
                            >

                                ×

                            </button>

                        </div>

                    )
            }



            {/* =====================================
                SETTINGS
            ===================================== */}

            <div className="resize-settings">


                <div className="resize-settings-heading">

                    <h3>

                        Resize Settings

                    </h3>


                    <p>

                        Enter the dimensions you want.

                    </p>

                </div>



                {/* DIMENSIONS */}

                <div className="resize-dimensions-grid">


                    <div className="resize-input-group">

                        <label>

                            Width

                        </label>


                        <div className="resize-number-input">

                            <input

                                type="number"

                                min="1"

                                max="10000"

                                placeholder="Width"

                                value={
                                    targetWidth
                                }

                                disabled={
                                    !imageFile
                                }

                                onChange={
                                    handleWidthChange
                                }

                            />


                            <span>

                                px

                            </span>

                        </div>

                    </div>



                    <div className="resize-dimension-symbol">

                        ×

                    </div>



                    <div className="resize-input-group">

                        <label>

                            Height

                        </label>


                        <div className="resize-number-input">

                            <input

                                type="number"

                                min="1"

                                max="10000"

                                placeholder="Height"

                                value={
                                    targetHeight
                                }

                                disabled={
                                    !imageFile
                                }

                                onChange={
                                    handleHeightChange
                                }

                            />


                            <span>

                                px

                            </span>

                        </div>

                    </div>

                </div>



                {/* ASPECT RATIO */}

                <button
                    type="button"

                    className={
                        keepAspectRatio

                            ? "resize-aspect-toggle resize-aspect-active"

                            : "resize-aspect-toggle"
                    }

                    onClick={
                        handleAspectRatioChange
                    }

                    disabled={
                        !imageFile
                    }
                >

                    <span className="resize-toggle-box">

                        {
                            keepAspectRatio
                                ? "✓"
                                : ""
                        }

                    </span>


                    <span>

                        Keep aspect ratio

                    </span>

                </button>



                {/* OUTPUT DIMENSIONS */}

                {
                    imageFile &&
                    expectedDimensions && (

                        <div className="resize-output-size">

                            <span>

                                Output size

                            </span>


                            <strong>

                                {
                                    expectedDimensions.width
                                }

                                {" × "}

                                {
                                    expectedDimensions.height
                                }

                                {" px"}

                            </strong>

                        </div>

                    )
                }



                {/* QUALITY */}

                <div className="resize-quality-section">

                    <label>

                        Image Quality

                    </label>


                    <div className="resize-quality-grid">


                        <button

                            type="button"

                            className={
                                quality === "high"

                                    ? "resize-quality-option resize-quality-active"

                                    : "resize-quality-option"
                            }

                            onClick={() => {

                                setQuality(
                                    "high"
                                );

                                clearResult();

                            }}

                        >

                            <strong>

                                High

                            </strong>


                            <span>

                                Best quality

                            </span>

                        </button>



                        <button

                            type="button"

                            className={
                                quality === "medium"

                                    ? "resize-quality-option resize-quality-active"

                                    : "resize-quality-option"
                            }

                            onClick={() => {

                                setQuality(
                                    "medium"
                                );

                                clearResult();

                            }}

                        >

                            <strong>

                                Medium

                            </strong>


                            <span>

                                Balanced

                            </span>

                        </button>



                        <button

                            type="button"

                            className={
                                quality === "low"

                                    ? "resize-quality-option resize-quality-active"

                                    : "resize-quality-option"
                            }

                            onClick={() => {

                                setQuality(
                                    "low"
                                );

                                clearResult();

                            }}

                        >

                            <strong>

                                Low

                            </strong>


                            <span>

                                Smaller JPG

                            </span>

                        </button>

                    </div>


                    {
                        imageFile?.type ===
                        "image/png" && (

                            <p className="resize-png-note">

                                PNG keeps lossless image data,
                                so quality level mainly affects JPG images.

                            </p>

                        )
                    }

                </div>

            </div>



            {/* =====================================
                ERROR
            ===================================== */}

            {
                error && (

                    <div
                        className="resize-error"
                        role="alert"
                    >

                        {
                            error
                        }

                    </div>

                )
            }



            {/* =====================================
                RESIZE BUTTON
            ===================================== */}

            <button

                type="button"

                className="resize-main-button"

                onClick={
                    handleResize
                }

                disabled={
                    !imageFile ||
                    isProcessing
                }

            >

                {
                    isProcessing

                        ? "Resizing Image..."

                        : "Resize Image"
                }

            </button>



            {/* =====================================
                RESULT
            ===================================== */}

            {
                resizedResult &&
                resultPreviewUrl && (

                    <div className="resize-result">


                        <div className="resize-result-heading">

                            <div>

                                <span>

                                    RESIZED IMAGE

                                </span>


                                <h3>

                                    Your image is ready

                                </h3>

                            </div>


                            <div className="resize-result-dimensions">

                                {
                                    resizedResult.width
                                }

                                {" × "}

                                {
                                    resizedResult.height
                                }

                                {" px"}

                            </div>

                        </div>



                        <div className="resize-result-preview">

                            <img
                                src={
                                    resultPreviewUrl
                                }
                                alt="Resized result"
                            />

                        </div>



                        <div className="resize-result-details">

                            <div>

                                <span>

                                    File size

                                </span>


                                <strong>

                                    {
                                        formatFileSize(
                                            resizedResult.blob.size
                                        )
                                    }

                                </strong>

                            </div>


                            <div>

                                <span>

                                    Format

                                </span>


                                <strong>

                                    {
                                        resizedResult.mimeType ===
                                        "image/png"

                                            ? "PNG"

                                            : "JPG"
                                    }

                                </strong>

                            </div>


                            <div>

                                <span>

                                    Dimensions

                                </span>


                                <strong>

                                    {
                                        resizedResult.width
                                    }

                                    {" × "}

                                    {
                                        resizedResult.height
                                    }

                                </strong>

                            </div>

                        </div>



                        <button
                            type="button"
                            className="resize-download-button"
                            onClick={
                                handleDownload
                            }
                        >

                            Download Resized Image

                            <span>

                                ↓

                            </span>

                        </button>

                    </div>

                )
            }



            {/* =====================================
                PRIVACY
            ===================================== */}

            <div className="resize-privacy">

                🔒 Your image is resized entirely
                inside your browser. Nothing is
                uploaded to our server.

            </div>

        </div>

    );

}


export default ResizeImage;