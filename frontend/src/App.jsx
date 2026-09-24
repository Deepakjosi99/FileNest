import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Seo from "./components/Seo";
import ToolInfo from "./components/ToolInfo";

import Home from "./pages/Home";
import ImageToPdfPage from "./pages/ImageToPdfPage";
import MergePdfPage from "./pages/MergePdfPage";
import SplitPdfPage from "./pages/SplitPdfPage";
import PdfToJpgPage from "./pages/PdfToJpgPage";
import ResizeImagePage from "./pages/ResizeImagePage";


function App() {

    return (

        <div className="app">

            <Navbar />

            <Seo />

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/image-to-pdf"
                    element={<ImageToPdfPage />}
                />

                <Route
                    path="/resize-image"
                    element={<ResizeImagePage />}
                />

                <Route
                    path="/merge-pdf"
                    element={<MergePdfPage />}
                />

                <Route
                    path="/split-pdf"
                    element={<SplitPdfPage />}
                />

                <Route
                    path="/pdf-to-jpg"
                    element={<PdfToJpgPage />}
                />

            </Routes>

            <ToolInfo />

            <Footer />

        </div>

    );

}


export default App;