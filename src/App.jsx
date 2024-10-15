import "./App.css";
import Navbar from "./components/navbar";
import Bar from "./components/Bar";
import Session from "./components/session";
import GooglePage from "./components/googlePage";
import EmailPage from "./components/emailPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen justify-between">
        {/* Barra de navegación superior */}
        <Navbar />

        {/* Contenido principal con flex-grow para ocupar el espacio disponible */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Session />} />
            <Route path="/google" element={<GooglePage />} />
            <Route path="/email" element={<EmailPage />} />
          </Routes>
        </div>

        {/* Barra de navegación inferior */}
        <Bar />
      </div>
    </Router>
  );
}

export default App;
