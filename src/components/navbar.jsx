import React, { useState, useEffect, useRef, useCallback } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "./AuthContext";
import { useUpdate } from "../contexts/UpdateContext";
import logolight from "../assets/logo-ingles-light.png"; // Logo para modo claro
import logodark from "../assets/logo-ingles-dark.png"; // Logo para modo oscuro
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import { useNavigate } from "react-router-dom";

function Navbar({ isDarkMode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth(); // Obtener el usuario autenticado del contexto
  const { pendingUpdate, setUpdateAvailable } = useUpdate(); // Obtener si hay actualización pendiente
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Cerrar menú si se hace clic fuera de él o en el botón de menú
  const handleClickOutside = useCallback((event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // FUNCION PARA CERRAR SESION
  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("Sesión cerrada exitosamente");
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Función para manejar el clic en "Actualización pendiente"
  const handlePendingUpdateClick = () => {
    setUpdateAvailable(true); // Mostrar nuevamente el modal de actualización
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 z-50 p-4 flex justify-between items-center shadow-md dark:text-white transform transition-all ease-in-out duration-300">
      {/* Logo que cambia dependiendo del modo */}
      <img
        className="w-14"
        src={logo2} // Cambiar el logo según el modo
        alt="logo-app"
      />

      {/* Resto del contenido */}
      <h1 className="text-xl absolute left-1/2 transform -translate-x-1/2 font-semibold text-slate-700 dark:text-white">
        Learning English
      </h1>
      {user && (
        <div className="flex items-center gap-4 text-slate-700 dark:text-white">
          {/* BOTÓN DE MENÚ: Visible solo en pantallas pequeñas */}
          <i
            ref={buttonRef}
            onClick={toggleMenu}
            className={`text-4xl bx ${
              isMenuOpen ? "bx-x" : "bx-menu"
            } lg:hidden`}
          ></i>
        </div>
      )}
      {/* MENÚ HORIZONTAL: Visible en pantallas medianas o mayores */}
      {user && (
        <ul className="hidden lg:flex gap-4 items-center transform transition-all ease-in-out duration-300">
          <li
            className="text-md text-slate-700 dark:text-white cursor-pointer"
            onClick={() => navigate("/home")}
          >
            Home
          </li>
          <li
            className="text-md text-slate-700 dark:text-white cursor-pointer"
            onClick={() => navigate("/task")}
          >
            Task
          </li>
          <li
            className="text-md text-slate-700 dark:text-white cursor-pointer"
            onClick={() => navigate("/learning")}
          >
            Learning
          </li>
          <li
            className="text-md text-slate-700 dark:text-white cursor-pointer"
            onClick={() => navigate("/chatbox")}
          >
            Chatbox
          </li>
        </ul>
      )}
      {/* MENÚ DESPLEGABLE: Visible solo en pantallas pequeñas */}
      {user && (
        <div
          ref={menuRef}
          className={`absolute -ml-4 w-full bg-slate-100 dark:bg-gray-700 transition-transform duration-300 ease-in-out transform shadow-md ${
            isMenuOpen ? "translate-x-0" : "-translate-x-[100%]"
          }`}
          style={{ top: "100%" }}
        >
          <div className="flex flex-col justify-between h-[90vh]">
            <ul className="flex flex-col justify-start items-center gap-4 py-8 flex-grow transform transition-all ease-in-out duration-300">
              <li
                key="home"
                onClick={() => {
                  toggleMenu();
                  navigate("/home");
                }}
                className="text-lg text-slate-700 dark:text-white cursor-pointer"
              >
                Home
              </li>
              <li
                key="task"
                onClick={() => {
                  toggleMenu();
                  navigate("/task");
                }}
                className="text-lg text-slate-700 dark:text-white cursor-pointer"
              >
                Task
              </li>
              <li
                key="learning"
                onClick={() => {
                  toggleMenu();
                  navigate("/learning");
                }}
                className="text-lg text-slate-700 dark:text-white cursor-pointer"
              >
                Learning
              </li>
              <li
                key="chatbox"
                onClick={() => {
                  toggleMenu();
                  navigate("/chatbox");
                }}
                className="text-lg text-slate-700 dark:text-white cursor-pointer"
              >
                Chatbox
              </li>
              {pendingUpdate && (
                <li
                  key="pending-update"
                  onClick={handlePendingUpdateClick}
                  className="text-lg text-blue-500 dark:text-blue-300 cursor-pointer"
                >
                  Actualización pendiente
                </li>
              )}
            </ul>
            {/* SOCIAL NETWORK */}
            <div className="mt-auto">
              <ul>
                <li className="flex justify-center gap-4 text-3xl text-gray-500 dark:text-gray-300">
                  <a href="#" key="facebook">
                    <i className="bx bxl-facebook-circle"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/jhonatan-mu%C3%B1oz-1aa8bb28b/"
                    key="linkedin"
                  >
                    <i className="bx bxl-linkedin"></i>
                  </a>
                  <a href="https://github.com/jhonatanm255" key="github">
                    <i className="bx bxl-github"></i>
                  </a>
                </li>
              </ul>

              <p className="text-center my-4 text-gray-400 text-md">
                Versión: <strong>{__APP_VERSION__}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
