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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col h-screen justify-between">
          {/* BARRA DE NAVEGACION SUPERIOR */}
          <Navbar />

          {/* INICIO DE SESION */}
          <div className="flex-grow">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Session />} />
              <Route path="/google" element={<GooglePage />} />
              <Route path="/email" element={<EmailPage />} />

              {/* Rutas protegidas */}
              <Route path="/" element={<PrivateRoute component={<Main />} />} />
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
          <Bar />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
