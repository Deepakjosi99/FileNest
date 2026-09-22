import {
    useEffect,
    useRef,
    useState
} from "react";

import "../css/image-to-pdf.css";

import {
    convertImagesToPdf
} from "../utils/imageToPdf";

import {
    calculateResizeDimensions,
    resizeImage
} from "../utils/imageResize";
function ImageToPdf() {

    /*
     * IMAGES
     */
    const [images, setImages] =
        useState([]);


    const [
        isConverting,
        setIsConverting
    ] = useState(false);


    const [
        isDraggingOver,
        setIsDraggingOver
    ] = useState(false);


    const [error, setError] =
        useState("");


    /*
     * PDF SETTINGS
     */
    const [
        pageSize,
        setPageSize
    ] = useState("A4");


    const [
        orientation,
        setOrientation
    ] = useState("auto");


    const [
        margin,
        setMargin
    ] = useState("medium");


    /*
     * IMAGE RESIZE SETTINGS
     */
    const [
        resizeEnabled,
        setResizeEnabled
    ] = useState(false);


    const [
        resizeWidth,
        setResizeWidth
    ] = useState(1200);


    const [
        resizeHeight,
        setResizeHeight
    ] = useState(1200);


    const [
        keepAspectRatio,
        setKeepAspectRatio
    ] = useState(true);


    const [
        imageQuality,
        setImageQuality
    ] = useState("high");


    /*
     * DRAG ORDER
     */
    const draggedIndex =
        useRef(null);


    /*
     * PREVIEW CLEANUP
     */
    const imagesRef =
        useRef([]);


    useEffect(() => {

        imagesRef.current =
            images;

    }, [images]);


    useEffect(() => {

        return () => {

            imagesRef.current.forEach(
                (image) => {

                    URL.revokeObjectURL(
                        image.preview
                    );

                }
            );

        };

    }, []);


    /*
     * GET ORIGINAL DIMENSIONS
     */
    const getImageDimensions =
        (previewUrl) => {

            return new Promise(
                (resolve) => {

                    const image =
                        new Image();


                    image.onload = () => {

                        resolve({

                            width:
                                image.naturalWidth,

                            height:
                                image.naturalHeight

                        });

                    };


                    image.onerror = () => {

                        resolve({

                            width: null,

                            height: null

                        });

                    };


                    image.src =
                        previewUrl;

                }
            );

        };


    /*
     * ADD IMAGES
     */
    const addImages =
        async (files) => {

            const selectedFiles =
                Array.from(files);


            const validFiles =
                selectedFiles.filter(
                    (file) => {

                        return (
                            file.type ===
                                "image/jpeg" ||

                            file.type ===
                                "image/png"
                        );

                    }
                );


            if (
                validFiles.length !==
                selectedFiles.length
            ) {

                setError(
                    "Only JPG and PNG images are supported."
                );

            } else {

                setError("");

            }


            const newImages =
                await Promise.all(

                    validFiles.map(
                        async (file) => {

                            const preview =
                                URL.createObjectURL(
                                    file
                                );


                            const dimensions =
                                await getImageDimensions(
                                    preview
                                );


                            return {

                                id:
                                    crypto.randomUUID(),

                                file,

                                preview,

                                width:
                                    dimensions.width,

                                height:
                                    dimensions.height

                            };

                        }
                    )

                );


            setImages(
                (currentImages) => [

                    ...currentImages,

                    ...newImages

                ]
            );

        };


    /*
     * FILE SELECT
     */
    const handleFileChange =
        async (event) => {

            await addImages(
                event.target.files
            );


            event.target.value =
                "";

        };


    /*
     * DROP IMAGES
     */
    const handleDropUpload =
        async (event) => {

            event.preventDefault();

            setIsDraggingOver(false);


            await addImages(
                event.dataTransfer.files
            );

        };


    const handleDragOverUpload =
        (event) => {

            event.preventDefault();

            setIsDraggingOver(true);

        };


    const handleDragLeaveUpload =
        () => {

            setIsDraggingOver(false);

        };


    /*
     * REMOVE IMAGE
     */
    const removeImage =
        (id) => {

            setImages(
                (currentImages) => {

                    const imageToRemove =
                        currentImages.find(
                            (image) =>
                                image.id === id
                        );


                    if (imageToRemove) {

                        URL.revokeObjectURL(
                            imageToRemove.preview
                        );

                    }


                    return currentImages.filter(
                        (image) =>
                            image.id !== id
                    );

                }
            );

        };


    /*
     * CLEAR ALL
     */
    const clearAllImages =
        () => {

            images.forEach(
                (image) => {

                    URL.revokeObjectURL(
                        image.preview
                    );

                }
            );


            setImages([]);

            setError("");

        };


    /*
     * REORDER IMAGES
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
                sourceIndex === targetIndex
            ) {

                return;

            }


            setImages(
                (currentImages) => {

                    const updatedImages =
                        [
                            ...currentImages
                        ];


                    const [
                        draggedImage
                    ] =
                        updatedImages.splice(
                            sourceIndex,
                            1
                        );


                    updatedImages.splice(
                        targetIndex,
                        0,
                        draggedImage
                    );


                    return updatedImages;

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
     * FILE SIZE
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
                ).toFixed(
                    1
                )} KB`;

            }


            return `${(
                bytes /
                1024 /
                1024
            ).toFixed(
                2
            )} MB`;

        };


    /*
     * RESULT DIMENSIONS
     */
    const getResultDimensions =
        (image) => {

            if (
                !resizeEnabled ||
                !image.width ||
                !image.height
            ) {

                return {

                    width:
                        image.width,

                    height:
                        image.height

                };

            }


            return (
                calculateResizeDimensions(

                    image.width,

                    image.height,

                    Number(
                        resizeWidth
                    ),

                    Number(
                        resizeHeight
                    ),

                    keepAspectRatio

                )
            );

        };


    /*
     * VALIDATE RESIZE SETTINGS
     */
    const validateResizeSettings =
        () => {

            if (!resizeEnabled) {

                return true;

            }


            const width =
                Number(
                    resizeWidth
                );


            const height =
                Number(
                    resizeHeight
                );


            if (
                !width ||
                !height
            ) {

                setError(
                    "Please enter width and height."
                );

                return false;

            }


            if (
                width < 1 ||
                height < 1
            ) {

                setError(
                    "Width and height must be greater than 0."
                );

                return false;

            }


            if (
                width > 10000 ||
                height > 10000
            ) {

                setError(
                    "Maximum supported width or height is 10000 px."
                );

                return false;

            }


            return true;

        };


    /*
     * CONVERT
     */
    const handleConvert =
        async () => {

            if (
                images.length === 0
            ) {

                setError(
                    "Please select at least one image."
                );

                return;

            }


            if (
                !validateResizeSettings()
            ) {

                return;

            }


            try {

                setIsConverting(true);

                setError("");


                let files =
                    images.map(
                        (image) =>
                            image.file
                    );


                /*
                 * RESIZE IMAGES BEFORE PDF
                 */
                if (resizeEnabled) {

                    files =
                        await Promise.all(

                            files.map(
                                (file) => {

                                    return resizeImage(
                                        file,
                                        {

                                            width:
                                                Number(
                                                    resizeWidth
                                                ),

                                            height:
                                                Number(
                                                    resizeHeight
                                                ),

                                            keepAspectRatio,

                                            quality:
                                                imageQuality

                                        }
                                    );

                                }
                            )

                        );

                }


                /*
                 * CREATE PDF
                 */
                const pdfBytes =
                    await convertImagesToPdf(
                        files,
                        {

                            pageSize,

                            orientation,

                            margin

                        }
                    );


                const blob =
                    new Blob(
                        [pdfBytes],
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
                    "PDFForge-Images.pdf";


                document.body.appendChild(
                    anchor
                );


                anchor.click();


                anchor.remove();


                URL.revokeObjectURL(
                    downloadUrl
                );


            } catch (error) {

                console.error(
                    error
                );


                setError(

                    error.message ||

                    "Unable to create PDF."

                );


            } finally {

                setIsConverting(
                    false
                );

            }

        };


    return (

        <div className="converter-card">


            {/* =========================
                HEADER
            ========================= */}

            <div className="converter-header">

                <span className="tool-label">

                    IMAGE → PDF

                </span>


                <h2>

                    Convert Images to PDF

                </h2>


                <p>

                    Convert JPG and PNG
                    images into one PDF.

                </p>

            </div>



            {/* =========================
                UPLOAD
            ========================= */}

            <label

                className={
                    isDraggingOver
                        ? "upload-area upload-area-active"
                        : "upload-area"
                }

                onDrop={
                    handleDropUpload
                }

                onDragOver={
                    handleDragOverUpload
                }

                onDragLeave={
                    handleDragLeaveUpload
                }

            >

                <div className="upload-circle">

                    +

                </div>


                <h3>

                    Select or drop images

                </h3>


                <p>

                    JPG and PNG supported

                </p>


                <span className="select-button">

                    Select Images

                </span>


                <input

                    type="file"

                    accept="image/jpeg,image/png"

                    multiple

                    onChange={
                        handleFileChange
                    }

                />

            </label>



            {/* =========================
                IMAGE RESIZE
                ALWAYS VISIBLE
            ========================= */}

            <div className="resize-settings">


                <div className="settings-title">

                    <div>

                        <h3>

                            Optional Image Resize

                        </h3>

                        <p>

                            Set custom width and
                            height in pixels before
                            creating your PDF.

                        </p>

                    </div>



                    <label className="resize-switch">

                        <input

                            type="checkbox"

                            checked={
                                resizeEnabled
                            }

                            onChange={(
                                event
                            ) =>
                                setResizeEnabled(
                                    event.target
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

                        <div className="resize-content">


                            {/* WIDTH / HEIGHT */}

                            <div className="dimension-inputs">


                                <div className="dimension-input-group">

                                    <label>

                                        Width

                                    </label>


                                    <div className="pixel-input">

                                        <input

                                            type="number"

                                            min="1"

                                            max="10000"

                                            value={
                                                resizeWidth
                                            }

                                            onChange={(
                                                event
                                            ) =>
                                                setResizeWidth(
                                                    event.target
                                                        .value
                                                )
                                            }

                                        />

                                        <span>
                                            px
                                        </span>

                                    </div>

                                </div>



                                <div className="dimension-input-group">

                                    <label>

                                        Height

                                    </label>


                                    <div className="pixel-input">

                                        <input

                                            type="number"

                                            min="1"

                                            max="10000"

                                            value={
                                                resizeHeight
                                            }

                                            onChange={(
                                                event
                                            ) =>
                                                setResizeHeight(
                                                    event.target
                                                        .value
                                                )
                                            }

                                        />


                                        <span>
                                            px
                                        </span>

                                    </div>

                                </div>

                            </div>



                            {/* KEEP ASPECT RATIO */}

                            <label className="ratio-checkbox">

                                <input

                                    type="checkbox"

                                    checked={
                                        keepAspectRatio
                                    }

                                    onChange={(
                                        event
                                    ) =>
                                        setKeepAspectRatio(
                                            event.target
                                                .checked
                                        )
                                    }

                                />


                                <span>

                                    🔗 Keep aspect ratio

                                </span>

                            </label>



                            <p className="resize-help">

                                {
                                    keepAspectRatio

                                        ? "Images will keep their original proportions and will not be stretched."

                                        : "Images will use the exact width and height you enter. This may stretch the image."
                                }

                            </p>



                            {/* IMAGE QUALITY */}

                            <div className="setting-group">

                                <label>

                                    Image Quality

                                </label>


                                <div className="option-buttons">

                                    {
                                        [
                                            "original",
                                            "high",
                                            "medium",
                                            "low"
                                        ].map(
                                            (
                                                quality
                                            ) => (

                                                <button

                                                    key={
                                                        quality
                                                    }

                                                    type="button"

                                                    className={
                                                        imageQuality ===
                                                        quality
                                                            ? "option-button active-option"
                                                            : "option-button"
                                                    }

                                                    onClick={() =>
                                                        setImageQuality(
                                                            quality
                                                        )
                                                    }

                                                >

                                                    {
                                                        quality
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase() +
                                                        quality.slice(
                                                            1
                                                        )
                                                    }

                                                </button>

                                            )
                                        )
                                    }

                                </div>

                            </div>



                            <div className="resize-note">

                                Maximum width or
                                height: 10,000 px.

                                Resizing happens
                                directly inside your
                                browser.

                                PNG quality mainly
                                depends on dimensions.

                                JPEG files also use
                                the selected quality
                                setting.

                            </div>

                        </div>

                    )
                }

            </div>



            {/* =========================
                SELECTED IMAGES
            ========================= */}

            {
                images.length >
                    0 && (

                    <div className="images-section">


                        <div className="images-header">

                            <div>

                                <strong>

                                    Your Images

                                </strong>


                                <p>

                                    Drag images to
                                    change page order

                                </p>

                            </div>


                            <button

                                type="button"

                                className="clear-button"

                                onClick={
                                    clearAllImages
                                }

                            >

                                Clear all

                            </button>

                        </div>



                        <div className="image-grid">

                            {
                                images.map(
                                    (
                                        image,
                                        index
                                    ) => {

                                        const result =
                                            getResultDimensions(
                                                image
                                            );


                                        return (

                                            <div

                                                key={
                                                    image.id
                                                }

                                                className="preview-card"

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


                                                {/* PAGE NUMBER */}

                                                <div className="page-number">

                                                    {
                                                        index +
                                                        1
                                                    }

                                                </div>



                                                {/* PREVIEW */}

                                                <img

                                                    src={
                                                        image.preview
                                                    }

                                                    alt={
                                                        image.file
                                                            .name
                                                    }

                                                />



                                                {/* IMAGE INFO */}

                                                <div className="preview-info">


                                                    <strong>

                                                        {
                                                            image.file
                                                                .name
                                                        }

                                                    </strong>



                                                    <span className="original-dimension">

                                                        Original:{" "}

                                                        {
                                                            image.width
                                                        }

                                                        {" × "}

                                                        {
                                                            image.height
                                                        }

                                                        {" px"}

                                                    </span>



                                                    {
                                                        resizeEnabled && (

                                                            <span className="result-dimension">

                                                                Result:{" "}

                                                                {
                                                                    result.width
                                                                }

                                                                {" × "}

                                                                {
                                                                    result.height
                                                                }

                                                                {" px"}

                                                            </span>

                                                        )
                                                    }



                                                    <span>

                                                        {
                                                            formatFileSize(
                                                                image.file
                                                                    .size
                                                            )
                                                        }

                                                    </span>

                                                </div>



                                                {/* REMOVE */}

                                                <button

                                                    type="button"

                                                    className="remove-image"

                                                    onClick={() =>
                                                        removeImage(
                                                            image.id
                                                        )
                                                    }

                                                    title="Remove image"

                                                >

                                                    ×

                                                </button>

                                            </div>

                                        );

                                    }
                                )
                            }

                        </div>



                        {/* ADD MORE */}

                        <label className="add-more-button">

                            + Add More Images


                            <input

                                type="file"

                                accept="image/jpeg,image/png"

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
                PDF SETTINGS
            ========================= */}

            {
                images.length >
                    0 && (

                    <div className="pdf-settings">


                        <div className="settings-title">

                            <div>

                                <h3>

                                    PDF Settings

                                </h3>


                                <p>

                                    Customize your
                                    PDF pages.

                                </p>

                            </div>

                        </div>



                        <div className="settings-grid">


                            {/* PAGE SIZE */}

                            <div className="setting-group">

                                <label>

                                    Page Size

                                </label>


                                <div className="option-buttons">


                                    <button

                                        type="button"

                                        className={
                                            pageSize ===
                                            "A4"
                                                ? "option-button active-option"
                                                : "option-button"
                                        }

                                        onClick={() =>
                                            setPageSize(
                                                "A4"
                                            )
                                        }

                                    >

                                        A4

                                    </button>



                                    <button

                                        type="button"

                                        className={
                                            pageSize ===
                                            "LETTER"
                                                ? "option-button active-option"
                                                : "option-button"
                                        }

                                        onClick={() =>
                                            setPageSize(
                                                "LETTER"
                                            )
                                        }

                                    >

                                        Letter

                                    </button>

                                </div>

                            </div>



                            {/* ORIENTATION */}

                            <div className="setting-group">

                                <label>

                                    Orientation

                                </label>


                                <div className="option-buttons">

                                    {
                                        [
                                            "auto",
                                            "portrait",
                                            "landscape"
                                        ].map(
                                            (
                                                option
                                            ) => (

                                                <button

                                                    key={
                                                        option
                                                    }

                                                    type="button"

                                                    className={
                                                        orientation ===
                                                        option
                                                            ? "option-button active-option"
                                                            : "option-button"
                                                    }

                                                    onClick={() =>
                                                        setOrientation(
                                                            option
                                                        )
                                                    }

                                                >

                                                    {
                                                        option
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase() +
                                                        option.slice(
                                                            1
                                                        )
                                                    }

                                                </button>

                                            )
                                        )
                                    }

                                </div>

                            </div>



                            {/* MARGIN */}

                            <div className="setting-group">

                                <label>

                                    Margin

                                </label>


                                <div className="option-buttons">

                                    {
                                        [
                                            "none",
                                            "small",
                                            "medium",
                                            "large"
                                        ].map(
                                            (
                                                option
                                            ) => (

                                                <button

                                                    key={
                                                        option
                                                    }

                                                    type="button"

                                                    className={
                                                        margin ===
                                                        option
                                                            ? "option-button active-option"
                                                            : "option-button"
                                                    }

                                                    onClick={() =>
                                                        setMargin(
                                                            option
                                                        )
                                                    }

                                                >

                                                    {
                                                        option
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase() +
                                                        option.slice(
                                                            1
                                                        )
                                                    }

                                                </button>

                                            )
                                        )
                                    }

                                </div>

                            </div>

                        </div>

                    </div>

                )
            }



            {/* =========================
                ERROR
            ========================= */}

            {
                error && (

                    <div className="error-message">

                        {error}

                    </div>

                )
            }



            {/* =========================
                CONVERT BUTTON
            ========================= */}

            <button

                type="button"

                className="convert-button"

                onClick={
                    handleConvert
                }

                disabled={
                    isConverting ||
                    images.length === 0
                }

            >

                {
                    isConverting

                        ? resizeEnabled
                            ? "Resizing & Creating PDF..."
                            : "Creating PDF..."

                        : images.length === 0

                            ? "Select Images to Continue"

                            : `Convert ${
                                  images.length
                              } Image${
                                  images.length ===
                                  1
                                      ? ""
                                      : "s"
                              } to PDF`
                }

            </button>



            {/* =========================
                PRIVACY
            ========================= */}

            <div className="privacy-text">

                🔒 Files are processed
                inside your browser.
                Nothing is uploaded
                to our server.

            </div>

        </div>

    );

}


export default ImageToPdf;