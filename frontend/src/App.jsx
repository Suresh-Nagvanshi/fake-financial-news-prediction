import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FormspreeProvider } from '@formspree/react';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <FormspreeProvider project="2981684724860189987">
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-background">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </FormspreeProvider>
  );
}

export default App;
