import Hero
    from "../components/Hero";

import PopularTools
    from "../components/PopularTools";

import ImageToPdf
    from "../components/ImageToPdf";


function Home() {

    return (

        <>

            {/* HERO */}

            <Hero />


            {/* POPULAR TOOLS */}

            <PopularTools />


            {/* IMAGE TO PDF TOOL */}

            <section
                id="image-to-pdf"
            >

                <ImageToPdf />

            </section>

        </>

    );

}


export default Home;