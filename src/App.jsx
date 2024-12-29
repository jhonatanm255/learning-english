import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/navbar";
import Bar from "./components/bar";
import Session from "./components/session";
import GooglePage from "./components/googlePage";
import EmailPage from "./components/emailPage";
import Main from "./components/main";
import Chatbot from "./components/Chatbot";
import VoicePractice from "./components/VoicePractice";
import Translator from "./components/traductor";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext"; // Asegúrate de tener AuthContext configurado
import PrivateRoute from "./components/PrivateRoute"; // Rutas privadas
import { UpdateProvider } from "./contexts/UpdateContext";
import UpdateNotification from "./components/UpdateNotification"; // Componente para mostrar la notificación de actualización

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Cambiar entre modo oscuro y claro
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    // Guardamos la preferencia del modo en el localStorage
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
  }, []);

  useEffect(() => {
    // Actualizamos el localStorage cuando se cambia el modo
    localStorage.setItem("darkMode", isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <AuthProvider>
      <UpdateProvider>
        {" "}
        {/* Envuelve toda la app con el UpdateProvider */}
        <Router>
          <div className="flex flex-col h-full justify-between dark:bg-gray-700">
            {/* BARRA DE NAVEGACION SUPERIOR */}
            <Navbar isDarkMode={isDarkMode} />{" "}
            {/* Pasamos isDarkMode como prop */}
            {/* INICIO DE SESION */}
            <div className="flex-grow p-2">
              <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<Session />} />
                <Route path="/google" element={<GooglePage />} />
                <Route path="/email" element={<EmailPage />} />

                {/* Rutas protegidas */}
                <Route
                  path="/"
                  element={<PrivateRoute component={<Main />} />}
                />
                <Route
                  path="/chatbot"
                  element={<PrivateRoute component={<Chatbot />} />}
                />
                <Route
                  path="/voice"
                  element={<PrivateRoute component={<VoicePractice />} />}
                />
                <Route
                  path="/translator"
                  element={<PrivateRoute component={<Translator />} />}
                />
              </Routes>
            </div>
            {/* BARRA DE NAVEGACION INFERIOR */}
            <Bar toggleDarkMode={toggleDarkMode} />{" "}
            {/* Pasamos la función para cambiar el modo */}
          </div>
        </Router>
        <UpdateNotification />{" "}
        {/* Componente para la notificación de actualización */}
      </UpdateProvider>
    </AuthProvider>
  );
}

export default App;



