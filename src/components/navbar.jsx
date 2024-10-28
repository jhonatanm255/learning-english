import React, { useState, useEffect, useRef } from "react";
import { getAuth, signOut } from "firebase/auth";
import logolight from "../assets/logo-ingles-light.png";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Cerrar menú si se hace clic fuera de él o en el botón de menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  return (
    <>
      {/* NAVBAR */}
      <div className="bg-white relative z-50 p-4 flex justify-between items-center shadow-md">
        <img className="w-12" src={logolight} alt="logo-app" />

        <h1 className="text-xl font-semibold text-slate-700">
          Learning English
        </h1>

        <div className="flex items-center gap-4 text-slate-700">
          <i
            ref={buttonRef}
            onClick={toggleMenu}
            className={`text-4xl bx ${isMenuOpen ? "bx-x" : "bx-menu"}`}
          ></i>
        </div>
      </div>

      {/* DROPDOWN MENU */}
      <div
        ref={menuRef}
        className={`absolute z-40 w-screen bg-blue-50 transition-transform duration-300 ease-in-out transform shadow-md ${
          isMenuOpen ? "translate-y-20" : "-translate-y-[150%]"
        }`}
      >
        <ul className="flex flex-col justify-center items-center gap-4 py-8">
          <li
            onClick={toggleMenu}
            className="text-lg text-slate-700 cursor-pointer"
          >
            Home
          </li>
          <li
            onClick={toggleMenu}
            className="text-lg text-slate-700 cursor-pointer"
          >
            Task
          </li>
          <li
            onClick={toggleMenu}
            className="text-lg text-slate-700 cursor-pointer"
          >
            Learning
          </li>
          <li
            onClick={toggleMenu}
            className="text-lg text-slate-700 cursor-pointer"
          >
            Chatbox
          </li>

          <li
            className="text-lg text-red-600 cursor-pointer"
            onClick={() => {
              toggleMenu();
              handleSignOut();
            }}
          >
            Logout
          </li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
