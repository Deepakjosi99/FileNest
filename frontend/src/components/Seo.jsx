import {
    useEffect
} from "react";

import {
    useLocation
} from "react-router-dom";


function Seo() {

    const location =
        useLocation();


    const baseUrl =
        "https://tools.fileconverters.workers.dev";


    /*
     * =========================================
     * SEO DATA FOR EVERY PAGE
     * =========================================
     */

    const seoData = {

        "/": {

            title:
                "FileNest - Free PDF & Image Tools Online",

            description:
                "Free online PDF and image tools. Convert images to PDF, compress and resize images, merge PDFs, split PDFs and convert PDF pages to JPG directly in your browser."

        },


        "/image-to-pdf": {

            title:
                "Image to PDF Converter - JPG & PNG to PDF Free | FileNest",

            description:
                "Convert JPG and PNG images to PDF online for free with FileNest. Fast, simple and browser-based with no signup required."

        },


        "/pdf-to-jpg": {

            title:
                "PDF to JPG Converter - Convert PDF to Images Free | FileNest",

            description:
                "Convert PDF pages to JPG images online for free. FileNest processes supported PDF conversions directly in your browser."

        },


        "/resize-image": {

            title:
                "Resize Image Online - Free Image Resizer | FileNest",

            description:
                "Resize JPG and PNG images online for free. Change image width and height quickly using FileNest without installing software."

        },


        "/compress-image": {

            title:
                "Compress Image Online - Reduce JPG, PNG & WebP Size | FileNest",

            description:
                "Compress JPG, PNG and WebP images online for free. Reduce image file size and adjust quality directly in your browser with FileNest."

        },


        "/merge-pdf": {

            title:
                "Merge PDF Online - Combine PDF Files Free | FileNest",

            description:
                "Merge multiple PDF files into one PDF online for free with FileNest. Simple browser-based PDF merging with no signup required."

        },


        "/split-pdf": {

            title:
                "Split PDF Online - Extract PDF Pages Free | FileNest",

            description:
                "Split PDF files and extract selected pages online for free with FileNest. Process supported PDF files directly in your browser."

        },


        /*
         * =====================================
         * TRUST / COMPANY PAGES
         * =====================================
         */

        "/about": {

            title:
                "About FileNest - Free Browser-Based File Tools",

            description:
                "Learn about FileNest, a collection of free browser-based PDF and image tools designed to make everyday file tasks simple and private."

        },


        "/privacy": {

            title:
                "Privacy Policy | FileNest",

            description:
                "Read the FileNest Privacy Policy and learn how browser-based file processing, website data and privacy are handled."

        },


        "/terms": {

            title:
                "Terms of Use | FileNest",

            description:
                "Read the FileNest Terms of Use covering browser-based file tools, acceptable use, service availability and user responsibilities."

        },


        "/contact": {

            title:
                "Contact FileNest - Support & Feedback",

            description:
                "Contact FileNest for support, bug reports, feedback, privacy questions or suggestions for new PDF and image tools."

        }

    };


    useEffect(() => {

        /*
         * =====================================
         * GET SEO DATA
         * =====================================
         */

        const currentSeo =
            seoData[
                location.pathname
            ] || seoData["/"];


        const canonicalUrl =
            location.pathname === "/"
                ? `${baseUrl}/`
                : `${baseUrl}${location.pathname}`;


        /*
         * =====================================
         * PAGE TITLE
         * =====================================
         */

        document.title =
            currentSeo.title;


        /*
         * =====================================
         * HELPER FUNCTION
         * =====================================
         */

        const updateMeta =
            (
                selector,
                attributeName,
                attributeValue,
                content
            ) => {

                let meta =
                    document.head.querySelector(
                        selector
                    );


                if (!meta) {

                    meta =
                        document.createElement(
                            "meta"
                        );


                    meta.setAttribute(
                        attributeName,
                        attributeValue
                    );


                    document.head.appendChild(
                        meta
                    );

                }


                meta.setAttribute(
                    "content",
                    content
                );

            };


        /*
         * =====================================
         * META DESCRIPTION
         * =====================================
         */

        updateMeta(
            'meta[name="description"]',
            "name",
            "description",
            currentSeo.description
        );


        /*
         * =====================================
         * ROBOTS
         * =====================================
         */

        updateMeta(
            'meta[name="robots"]',
            "name",
            "robots",
            "index, follow"
        );


        /*
         * =====================================
         * OPEN GRAPH TITLE
         * =====================================
         */

        updateMeta(
            'meta[property="og:title"]',
            "property",
            "og:title",
            currentSeo.title
        );


        /*
         * =====================================
         * OPEN GRAPH DESCRIPTION
         * =====================================
         */

        updateMeta(
            'meta[property="og:description"]',
            "property",
            "og:description",
            currentSeo.description
        );


        /*
         * =====================================
         * OPEN GRAPH URL
         * =====================================
         */

        updateMeta(
            'meta[property="og:url"]',
            "property",
            "og:url",
            canonicalUrl
        );


        /*
         * =====================================
         * OPEN GRAPH TYPE
         * =====================================
         */

        updateMeta(
            'meta[property="og:type"]',
            "property",
            "og:type",
            "website"
        );


        /*
         * =====================================
         * OPEN GRAPH SITE NAME
         * =====================================
         */

        updateMeta(
            'meta[property="og:site_name"]',
            "property",
            "og:site_name",
            "FileNest"
        );


        /*
         * =====================================
         * CANONICAL URL
         * =====================================
         */

        let canonical =
            document.head.querySelector(
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


        canonical.setAttribute(
            "href",
            canonicalUrl
        );


    }, [location.pathname]);


    return null;

}


export default Seo;