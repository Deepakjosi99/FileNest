import {
    Route,
    Routes
} from "react-router-dom";

import Navbar
    from "./components/Navbar";

import Home
    from "./pages/Home";

import ImageToPdfPage
    from "./pages/ImageToPdfPage";

import MergePdfPage
    from "./pages/MergePdfPage";

import SplitPdfPage
    from "./pages/SplitPdfPage";

import PdfToJpgPage
    from "./pages/PdfToJpgPage";

import ResizeImagePage
    from "./pages/ResizeImagePage";


function App() {

    return (

        <div className="app">

            <Navbar />


            <Routes>

                {/* HOME */}

                <Route
                    path="/"
                    element={
                        <Home />
                    }
                />


                {/* IMAGE TO PDF */}

                <Route
                    path="/image-to-pdf"
                    element={
                        <ImageToPdfPage />
                    }
                />


                {/* RESIZE IMAGE */}

                <Route
                    path="/resize-image"
                    element={
                        <ResizeImagePage />
                    }
                />


                {/* MERGE PDF */}

                <Route
                    path="/merge-pdf"
                    element={
                        <MergePdfPage />
                    }
                />


                {/* SPLIT PDF */}

                <Route
                    path="/split-pdf"
                    element={
                        <SplitPdfPage />
                    }
                />


                {/* PDF TO JPG */}

                <Route
                    path="/pdf-to-jpg"
                    element={
                        <PdfToJpgPage />
                    }
                />

            </Routes>

        </div>

    );

}


export default App;