import {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import {
    compressImage
} from "../utils/compressImage";

import "../css/compress-image.css";


function CompressImage() {

    const [
        selectedFile,
        setSelectedFile
    ] = useState(null);


    const [
        originalPreview,
        setOriginalPreview
    ] = useState("");


    const [
        result,
        setResult
    ] = useState(null);


    const [
        resultPreview,
        setResultPreview
    ] = useState("");


    const [
        quality,
        setQuality
    ] = useState(80);


    const [
        outputFormat,
        setOutputFormat
    ] = useState(
        "original"
    );


    const [
        resizeEnabled,
        setResizeEnabled
    ] = useState(false);


    const [
        maxWidth,
        setMaxWidth
    ] = useState("");


    const [
        maxHeight,
        setMaxHeight
    ] = useState("");


    const [
        isCompressing,
        setIsCompressing
    ] = useState(false);


    const [
        isDragging,
        setIsDragging
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        notification,
        setNotification
    ] = useState("");


    const notificationTimer =
        useRef(null);


    /*
     * =========================================
     * FORMAT FILE SIZE
     * =========================================
     */

    const formatBytes =
        (bytes) => {

            if (
                bytes === 0
            ) {

                return "0 B";

            }


            const units = [
                "B",
                "KB",
                "MB",
                "GB"
            ];


            const index =
                Math.floor(
                    Math.log(bytes) /
                    Math.log(1024)
                );


            const value =
                bytes /
                Math.pow(
                    1024,
                    index
                );


            return `${
                value.toFixed(
                    index === 0
                        ? 0
                        : 2
                )
            } ${units[index]}`;

        };


    /*
     * =========================================
     * NOTIFICATION
     * =========================================
     */

    const showNotification =
        (message) => {

            setNotification(
                message
            );


            if (
                notificationTimer.current
            ) {

                clearTimeout(
                    notificationTimer.current
                );

            }


            notificationTimer.current =
                setTimeout(
                    () => {

                        setNotification("");

                        notificationTimer.current =
                            null;

                    },
                    3500
                );

        };


    /*
     * =========================================
     * CLEAR RESULT
     * =========================================
     */

    const clearResult =
        () => {

            if (
                resultPreview
            ) {

                URL.revokeObjectURL(
                    resultPreview
                );

            }


            setResult(null);

            setResultPreview("");

        };


    /*
     * =========================================
     * RESET TOOL
     * =========================================
     */

    const resetTool =
        () => {

            if (
                originalPreview
            ) {

                URL.revokeObjectURL(
                    originalPreview
                );

            }


            clearResult();


            setSelectedFile(null);

            setOriginalPreview("");

            setQuality(80);

            setOutputFormat(
                "original"
            );

            setResizeEnabled(
                false
            );

            setMaxWidth("");

            setMaxHeight("");

            setError("");

            setNotification("");

        };


    /*
     * =========================================
     * SELECT IMAGE
     * =========================================
     */

    const handleSelectedFile =
        (file) => {

            if (!file) {

                return;

            }


            const supportedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];


            if (
                !supportedTypes.includes(
                    file.type
                )
            ) {

                setError(
                    "Please select a JPG, PNG or WebP image."
                );

                return;

            }


            clearResult();


            if (
                originalPreview
            ) {

                URL.revokeObjectURL(
                    originalPreview
                );

            }


            setSelectedFile(
                file
            );


            setOriginalPreview(
                URL.createObjectURL(
                    file
                )
            );


            setError("");

            setNotification("");

        };


    /*
     * =========================================
     * FILE INPUT
     * =========================================
     */

    const handleFileChange =
        (event) => {

            const file =
                event.target.files?.[0];


            handleSelectedFile(
                file
            );


            event.target.value =
                "";

        };


    /*
     * =========================================
     * DRAG AND DROP
     * =========================================
     */

    const handleDrop =
        (event) => {

            event.preventDefault();

            setIsDragging(
                false
            );


            const file =
                event.dataTransfer
                    .files?.[0];


            handleSelectedFile(
                file
            );

        };


    const handleDragOver =
        (event) => {

            event.preventDefault();

            setIsDragging(
                true
            );

        };


    const handleDragLeave =
        () => {

            setIsDragging(
                false
            );

        };


    /*
     * =========================================
     * COMPRESS IMAGE
     * =========================================
     */

    const handleCompress =
        async () => {

            if (
                !selectedFile
            ) {

                setError(
                    "Please select an image first."
                );

                return;

            }


            try {

                setIsCompressing(
                    true
                );

                setError("");

                setNotification("");


                clearResult();


                const compressionResult =
                    await compressImage(
                        selectedFile,
                        {

                            quality:
                                Number(
                                    quality
                                ) / 100,

                            outputFormat,

                            maxWidth:
                                resizeEnabled &&
                                maxWidth
                                    ? Number(
                                          maxWidth
                                      )
                                    : null,

                            maxHeight:
                                resizeEnabled &&
                                maxHeight
                                    ? Number(
                                          maxHeight
                                      )
                                    : null

                        }
                    );


                const previewUrl =
                    URL.createObjectURL(
                        compressionResult.blob
                    );


                setResult(
                    compressionResult
                );


                setResultPreview(
                    previewUrl
                );


                /*
                 * SUCCESS NOTIFICATION
                 */

                if (
                    compressionResult
                        .savingsPercent >
                    0
                ) {

                    showNotification(
                        `File size reduced by ${compressionResult.savingsPercent}%.`
                    );

                } else {

                    showNotification(
                        "This image is already well optimized at the selected settings."
                    );

                }


            } catch (err) {

                console.error(
                    err
                );


                setError(
                    err.message ||
                    "Unable to compress this image."
                );


            } finally {

                setIsCompressing(
                    false
                );

            }

        };


    /*
     * =========================================
     * DOWNLOAD
     * =========================================
     */

    const handleDownload =
        () => {

            if (
                !result ||
                !resultPreview
            ) {

                return;

            }


            const anchor =
                document.createElement(
                    "a"
                );


            anchor.href =
                resultPreview;


            anchor.download =
                result.fileName;


            document.body.appendChild(
                anchor
            );


            anchor.click();

            anchor.remove();

        };


    /*
     * =========================================
     * ORIGINAL SIZE
     * =========================================
     */

    const originalSizeText =
        useMemo(
            () => {

                if (
                    !selectedFile
                ) {

                    return "";

                }


                return formatBytes(
                    selectedFile.size
                );

            },
            [
                selectedFile
            ]
        );


    /*
     * =========================================
     * CLEAN NOTIFICATION TIMER
     * =========================================
     */

    useEffect(
        () => {

            return () => {

                if (
                    notificationTimer.current
                ) {

                    clearTimeout(
                        notificationTimer.current
                    );

                }

            };

        },
        []
    );


    /*
     * =========================================
     * UI
     * =========================================
     */

    return (

        <section className="compress-image-section">


            {/* =====================================
                SUCCESS NOTIFICATION
            ===================================== */}

            {
                notification && (

                    <div
                        className="compress-notification"
                        role="status"
                        aria-live="polite"
                    >

                        <div className="compress-notification-icon">

                            ✓

                        </div>


                        <div className="compress-notification-content">

                            <strong>
                                Compression complete
                            </strong>

                            <p>
                                {
                                    notification
                                }
                            </p>

                        </div>

                    </div>

                )
            }


            <div className="compress-image-container">


                {/* =====================================
                    HEADER
                ===================================== */}

                <div className="compress-image-header">

                    <span className="compress-image-label">

                        COMPRESS IMAGE

                    </span>


                    <h1>

                        Compress Images Online

                    </h1>


                    <p>

                        Reduce JPG, PNG and WebP image size
                        directly in your browser.

                    </p>

                </div>


                {/* =====================================
                    UPLOAD
                ===================================== */}

                {
                    !selectedFile && (

                        <label

                            className={
                                isDragging
                                    ? "compress-upload-area compress-upload-active"
                                    : "compress-upload-area"
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

                            <div className="compress-upload-icon">

                                ↓

                            </div>


                            <h3>

                                Select or drop an image

                            </h3>


                            <p>

                                JPG, PNG and WebP supported

                            </p>


                            <span className="compress-select-button">

                                Select Image

                            </span>


                            <input

                                type="file"

                                accept="image/jpeg,image/png,image/webp"

                                onChange={
                                    handleFileChange
                                }

                            />

                        </label>

                    )
                }


                {/* =====================================
                    WORKSPACE
                ===================================== */}

                {
                    selectedFile && (

                        <div className="compress-workspace">


                            {/* ORIGINAL IMAGE */}

                            <div className="compress-preview-card">

                                <div className="compress-preview-heading">

                                    <div>

                                        <span className="compress-small-label">

                                            ORIGINAL IMAGE

                                        </span>


                                        <h3>

                                            {
                                                selectedFile.name
                                            }

                                        </h3>

                                    </div>


                                    <button

                                        type="button"

                                        className="compress-remove-button"

                                        onClick={
                                            resetTool
                                        }

                                    >

                                        Remove

                                    </button>

                                </div>


                                <div className="compress-image-preview">

                                    <img

                                        src={
                                            originalPreview
                                        }

                                        alt="Selected image preview"

                                    />

                                </div>


                                <div className="compress-file-meta">

                                    <span>

                                        Original size

                                    </span>


                                    <strong>

                                        {
                                            originalSizeText
                                        }

                                    </strong>

                                </div>

                            </div>


                            {/* =================================
                                SETTINGS
                            ================================= */}

                            <div className="compress-settings-card">

                                <h2>

                                    Compression settings

                                </h2>


                                {/* QUALITY */}

                                <div className="compress-setting-group">

                                    <div className="compress-setting-title">

                                        <label htmlFor="qualityRange">

                                            Quality

                                        </label>


                                        <strong>

                                            {
                                                quality
                                            }%

                                        </strong>

                                    </div>


                                    <input

                                        id="qualityRange"

                                        type="range"

                                        min="10"

                                        max="100"

                                        step="5"

                                        value={
                                            quality
                                        }

                                        onChange={
                                            (
                                                event
                                            ) =>
                                                setQuality(
                                                    Number(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                )
                                        }

                                    />


                                    <div className="compress-range-labels">

                                        <span>

                                            Smaller file

                                        </span>


                                        <span>

                                            Better quality

                                        </span>

                                    </div>

                                </div>


                                {/* OUTPUT FORMAT */}

                                <div className="compress-setting-group">

                                    <label htmlFor="outputFormat">

                                        Output format

                                    </label>


                                    <select

                                        id="outputFormat"

                                        value={
                                            outputFormat
                                        }

                                        onChange={
                                            (
                                                event
                                            ) =>
                                                setOutputFormat(
                                                    event
                                                        .target
                                                        .value
                                                )
                                        }

                                    >

                                        <option value="original">

                                            Keep original format

                                        </option>


                                        <option value="jpg">

                                            JPG

                                        </option>


                                        <option value="png">

                                            PNG

                                        </option>


                                        <option value="webp">

                                            WebP

                                        </option>

                                    </select>

                                </div>


                                {/* RESIZE */}

                                <div className="compress-setting-group">

                                    <div className="compress-resize-toggle">

                                        <div>

                                            <strong>

                                                Resize while compressing

                                            </strong>


                                            <p>

                                                Optional maximum dimensions

                                            </p>

                                        </div>


                                        <label className="compress-switch">

                                            <input

                                                type="checkbox"

                                                checked={
                                                    resizeEnabled
                                                }

                                                onChange={
                                                    (
                                                        event
                                                    ) =>
                                                        setResizeEnabled(
                                                            event
                                                                .target
                                                                .checked
                                                        )
                                                }

                                            />


                                            <span>

                                                {
                                                    resizeEnabled
                                                        ? "On"
                                                        : "Off"
                                                }

                                            </span>

                                        </label>

                                    </div>


                                    {
                                        resizeEnabled && (

                                            <div className="compress-dimensions">


                                                <div>

                                                    <label htmlFor="compressMaxWidth">

                                                        Max width

                                                    </label>


                                                    <input

                                                        id="compressMaxWidth"

                                                        type="number"

                                                        min="1"

                                                        placeholder="e.g. 1920"

                                                        value={
                                                            maxWidth
                                                        }

                                                        onChange={
                                                            (
                                                                event
                                                            ) =>
                                                                setMaxWidth(
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                        }

                                                    />

                                                </div>


                                                <div>

                                                    <label htmlFor="compressMaxHeight">

                                                        Max height

                                                    </label>


                                                    <input

                                                        id="compressMaxHeight"

                                                        type="number"

                                                        min="1"

                                                        placeholder="e.g. 1080"

                                                        value={
                                                            maxHeight
                                                        }

                                                        onChange={
                                                            (
                                                                event
                                                            ) =>
                                                                setMaxHeight(
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                        }

                                                    />

                                                </div>

                                            </div>

                                        )
                                    }

                                </div>


                                {/* ERROR */}

                                {
                                    error && (

                                        <div className="compress-error">

                                            {
                                                error
                                            }

                                        </div>

                                    )
                                }


                                {/* COMPRESS BUTTON */}

                                <button

                                    type="button"

                                    className="compress-main-button"

                                    onClick={
                                        handleCompress
                                    }

                                    disabled={
                                        isCompressing
                                    }

                                >

                                    {
                                        isCompressing
                                            ? "Compressing..."
                                            : "Compress Image"
                                    }

                                </button>


                                {/* PRIVACY */}

                                <div className="compress-privacy">

                                    🔒 Your image is processed
                                    inside your browser and does not
                                    need to be uploaded to our server.

                                </div>

                            </div>

                        </div>

                    )
                }


                {/* =====================================
                    RESULT
                ===================================== */}

                {
                    result && (

                        <div className="compress-result-card">

                            <div className="compress-result-header">

                                <div>

                                    <span className="compress-small-label">

                                        COMPRESSION COMPLETE

                                    </span>


                                    <h2>

                                        Your image is ready

                                    </h2>

                                </div>


                                <div className="compress-saving-badge">

                                    {
                                        result.savingsPercent
                                    }% smaller

                                </div>

                            </div>


                            <div className="compress-result-content">


                                {/* RESULT IMAGE */}

                                <div className="compress-result-preview">

                                    <img

                                        src={
                                            resultPreview
                                        }

                                        alt="Compressed image preview"

                                    />

                                </div>


                                {/* RESULT DETAILS */}

                                <div className="compress-result-details">


                                    <div className="compress-result-stat">

                                        <span>

                                            Original

                                        </span>


                                        <strong>

                                            {
                                                formatBytes(
                                                    result.originalSize
                                                )
                                            }

                                        </strong>

                                    </div>


                                    <div className="compress-result-stat">

                                        <span>

                                            Compressed

                                        </span>


                                        <strong>

                                            {
                                                formatBytes(
                                                    result.compressedSize
                                                )
                                            }

                                        </strong>

                                    </div>


                                    <div className="compress-result-stat">

                                        <span>

                                            Saved

                                        </span>


                                        <strong>

                                            {
                                                formatBytes(
                                                    result.savedBytes
                                                )
                                            }

                                        </strong>

                                    </div>


                                    <div className="compress-result-stat">

                                        <span>

                                            Dimensions

                                        </span>


                                        <strong>

                                            {
                                                result.width
                                            }

                                            ×

                                            {
                                                result.height
                                            }

                                        </strong>

                                    </div>


                                    <div className="compress-result-stat">

                                        <span>

                                            Format

                                        </span>


                                        <strong>

                                            {
                                                result.mimeType
                                                    .replace(
                                                        "image/",
                                                        ""
                                                    )
                                                    .toUpperCase()
                                            }

                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* RESULT ACTIONS */}

                            <div className="compress-result-actions">

                                <button

                                    type="button"

                                    className="compress-secondary-button"

                                    onClick={
                                        resetTool
                                    }

                                >

                                    Compress Another

                                </button>


                                <button

                                    type="button"

                                    className="compress-download-button"

                                    onClick={
                                        handleDownload
                                    }

                                >

                                    Download Image

                                    <span>
                                        ↓
                                    </span>

                                </button>

                            </div>

                        </div>

                    )
                }

            </div>

        </section>

    );

}


export default CompressImage;