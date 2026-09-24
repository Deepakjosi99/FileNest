import { useEffect } from "react";
import { useLocation } from "react-router-dom";


const BASE_URL =
    "https://tools.fileconverters.workers.dev";


const seoData = {

    "/": {
        title:
            "FileNest - Free PDF & Image Tools Online",

        description:
            "Free online PDF and image tools. Convert, resize, merge and split files securely in your browser with no uploads required."
    },


    "/image-to-pdf": {
        title:
            "Image to PDF Converter - JPG & PNG to PDF Free | FileNest",

        description:
            "Convert JPG and PNG images to PDF online for free. Create PDFs securely in your browser with FileNest."
    },


    "/pdf-to-jpg": {
        title:
            "PDF to JPG Converter - Convert PDF to Images Free | FileNest",

        description:
            "Convert PDF pages to high-quality JPG images online for free. Fast, private and browser-based PDF to JPG conversion."
    },


    "/resize-image": {
        title:
            "Resize Image Online - Free Image Resizer | FileNest",

        description:
            "Resize JPG and PNG images online by width and height. Free browser-based image resizer with no file uploads."
    },


    "/merge-pdf": {
        title:
            "Merge PDF Online - Combine PDF Files Free | FileNest",

        description:
            "Merge multiple PDF files into one PDF online for free. Combine PDFs privately and securely inside your browser."
    },


    "/split-pdf": {
        title:
            "Split PDF Online - Extract PDF Pages Free | FileNest",

        description:
            "Split PDF files and extract selected pages online for free. Process PDFs securely inside your browser with FileNest."
    }

};


function Seo() {

    const location =
        useLocation();


    useEffect(() => {

        const seo =
            seoData[location.pathname]
            || seoData["/"];


        /* =========================
           PAGE TITLE
        ========================= */

        document.title =
            seo.title;


        /* =========================
           META DESCRIPTION
        ========================= */

        let description =
            document.querySelector(
                'meta[name="description"]'
            );


        if (!description) {

            description =
                document.createElement(
                    "meta"
                );

            description.setAttribute(
                "name",
                "description"
            );

            document.head.appendChild(
                description
            );

        }


        description.setAttribute(
            "content",
            seo.description
        );


        /* =========================
           CANONICAL URL
        ========================= */

        let canonical =
            document.querySelector(
                'link[rel="canonical"]'
            );


        if (!canonical) {

            canonical =
                document.createElement(
                    "link"
                );

            canonical.setAttribute(
                "rel",
                "canonical"
            );

            document.head.appendChild(
                canonical
            );

        }


        const canonicalUrl =
            location.pathname === "/"
                ? `${BASE_URL}/`
                : `${BASE_URL}${location.pathname}`;


        canonical.setAttribute(
            "href",
            canonicalUrl
        );


        /* =========================
           OPEN GRAPH TITLE
        ========================= */

        updateMetaProperty(
            "og:title",
            seo.title
        );


        /* =========================
           OPEN GRAPH DESCRIPTION
        ========================= */

        updateMetaProperty(
            "og:description",
            seo.description
        );


        /* =========================
           OPEN GRAPH URL
        ========================= */

        updateMetaProperty(
            "og:url",
            canonicalUrl
        );


        updateMetaProperty(
            "og:type",
            "website"
        );


    }, [location.pathname]);


    return null;

}


function updateMetaProperty(
    property,
    content
) {

    let meta =
        document.querySelector(
            `meta[property="${property}"]`
        );


    if (!meta) {

        meta =
            document.createElement(
                "meta"
            );

        meta.setAttribute(
            "property",
            property
        );

        document.head.appendChild(
            meta
        );

    }


    meta.setAttribute(
        "content",
        content
    );

}


export default Seo;