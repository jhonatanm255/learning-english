import "./App.css";
import Navbar from "./components/navbar";
import Bar from "./components/bar";
import Session from "./components/session";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { auth } from "./components/firebaseConfig";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";

// Componente para la página a la que redirigirá después de iniciar sesión con Google
function GooglePage() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/"); // Redirigir a la página de inicio de sesión después de cerrar sesión
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl">Iniciaste sesión con Google</h2>
      <button
        onClick={handleSignOut}
        className="bg-red-500 text-white p-2 rounded mt-4"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

// Componente para la página a la que redirigirá después de iniciar sesión con correo/contraseña
function EmailPage() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/"); // Redirigir a la página de inicio de sesión después de cerrar sesión
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl">Iniciaste sesión con Correo/Contraseña</h2>
      <button
        onClick={handleSignOut}
        className="bg-red-500 text-white p-2 rounded mt-4"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

function App() {
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Si el usuario está autenticado, obtener su foto de perfil
        setProfilePicture(user.photoURL);
      } else {
        setProfilePicture(null); // No hay usuario autenticado
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            {/* Ruta para la página de inicio de sesión */}
            <Route path="/" element={<Session />} />

            {/* Rutas para redirigir después del inicio de sesión */}
            <Route path="/google" element={<GooglePage />} />
            <Route path="/email" element={<EmailPage />} />
          </Routes>
        </div>
        {/* Pasar la imagen de perfil como prop a Bar */}
        <Bar profilePicture={profilePicture} />
      </div>
    </Router>
  );
}

export default App;
