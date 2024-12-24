import React, { useState, useEffect } from "react";
import { auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import PendingUpdateNotification from "./PendingUpdateNotification";

function Bar({ appVersion, onLogout }) {
  const [profilePicture, setProfilePicture] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Estado para manejar el usuario
  const navigate = useNavigate();

  // Comprobar el estado inicial del dark mode desde localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("dark-mode");
    if (savedMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setProfilePicture(user.photoURL);
        setUser(user); // Establecer el usuario
      } else {
        setProfilePicture(null);
        setUser(null); // No hay usuario autenticado
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dark-mode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dark-mode", "false");
    }
  };

  // FUNCION PARA CERRAR SESION
  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("Sesión cerrada exitosamente");
      navigate("/login");
      setIsMenuOpen(false); // Cerrar el menú cuando se cierra sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleLogout = () => {
    onLogout(); // Llamar a la función de logout pasada como prop
    setIsMenuOpen(false); // Cerrar el menú al hacer logout
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen); // Alternar el menú de perfil
  };

  return (
    <div className="fixed bottom-0 w-full">
      <ul className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-top transform transition-all ease-in-out duration-300">
        <li>
          <i className="hover:bg-gray-300 p-1 px-2 rounded text-2xl text-slate-700 dark:text-slate-200 dark:hover:text-slate-700 bx bx-home"></i>
        </li>
        <li>
          <i className="hover:bg-gray-300 p-1 px-2 rounded text-2xl text-slate-700 dark:text-slate-200 dark:hover:text-slate-700 bx bx-objects-vertical-bottom"></i>
        </li>
        <li>
          <i className="hover:bg-gray-300 p-1 px-2 rounded text-2xl text-slate-700 dark:text-slate-200 dark:hover:text-slate-700 bx bx-book-bookmark"></i>
        </li>
        <li>
          {/* IMAGEN DE PERFIL DE LA SESION O ICONO DE USER */}
          {user ? (
            <img
              className="w-8 h-8 rounded-full ml-2 object-cover cursor-pointer"
              src={profilePicture}
              alt="Profile"
              onClick={handleMenuToggle}
            />
          ) : (
            <i
              className="hover:bg-gray-300 p-1 px-2 rounded text-2xl text-slate-700 dark:text-slate-200 dark:hover:text-slate-700 bx bx-cog cursor-pointer"
              onClick={handleMenuToggle}
            ></i>
          )}
        </li>
      </ul>

      {/* Menú del perfil con transición */}
      {isMenuOpen && (
        <div
          className={`absolute right-2 bottom-20 border dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-48 transform transition-all ease-in-out duration-300
          ${isMenuOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="flex flex-col gap-2">
            <button
              onClick={toggleDarkMode}
              className="w-full text-left text-gray-900 dark:text-white p-2"
            >
              {isDarkMode ? "☀️ Light Mode" : "🌑 Dark Mode"}
            </button>
            <div className="border-t border-gray-300 dark:border-gray-600"></div>

            {/* Mostrar botón de logout solo si el usuario está autenticado */}
            {user && (
              <button
                onClick={handleSignOut}
                className="w-full text-left text-red-500 px-2 flex items-center"
              >
                <i className="bx bx-log-out-circle mr-1 text-lg"></i>
                Logout
              </button>
            )}

            {/* Mostrar notificación de actualización pendiente */}
            {/* <PendingUpdateNotification className="p-2"/> */}

            <div className="text-gray-600 dark:text-gray-400 mt-1 px-2 text-sm">
              Versión: <strong>{__APP_VERSION__}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bar;
