import "./App.css";
import Navbar from "./components/navbar";
import Bar from "./components/bar";
import Session from "./components/session";
import GooglePage from "./components/googlePage";
import EmailPage from "./components/emailPage";
import Main from "./components/main";
import Chatbot from "./components/Chatbot";
import VoicePractice from "./components/VoicePractice";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen justify-between">
        {/* BARRA DE NAVEGACION SUPERIOR */}
        <Navbar />
        
        {/* INICIO DE SESION */}
        <div className="flex-grow">
          <Routes>
            <Route path="/login" element={<Session />} />
            <Route path="/google" element={<GooglePage />} />
            <Route path="/email" element={<EmailPage />} />
            {/* RUTA PARA EL MAIN */}
            <Route path="/" element={<Main />} />
            {/* RUTA PARA EL CHATBOT */}
            <Route path="/chatbot" element={<Chatbot />} />{" "}
            {/* RUTA PARA PRACTICA DE PRONUNCIACION */}
            <Route path="/voice" element={<VoicePractice />} />{" "}
          </Routes>
        </div>

        {/* BARRA DE NAVEGACION INFERIOR */}
        <Bar />
      </div>
    </Router>
  );
}

export default App;
