import React, { useState } from "react";
import logolight from "../assets/logo-ingles-light.png";


function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para manejar la apertura del menú

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Cambia el estado de isMenuOpen
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="bg-white p-4 flex justify-between items-center shadow-md">
        {/* Logo app */}
        <img className="w-12" src={logolight} alt="logo-app" />
        {/* App name */}
        <h1 className="text-xl font-semibold text-fuchsia-700">
          Learning English
        </h1>
        {/* Button menu */}
        <div className="flex items-center gap-4 text-fuchsia-700">
          <i
            onClick={toggleMenu}
            className={`text-4xl bx ${isMenuOpen ? "bx-x" : "bx-menu"}`}
          ></i>
        </div>
      </div>

      {/* DROPDOWN MENU */}
      <div
        className={`relative -z-50 w-screen bg-blue-100 transition-transform duration-300 ease-in-out transform ${
          isMenuOpen ? "translate-y-0" : "-translate-y-[150%]"
        }`}
      >
        <ul className="flex flex-col justify-center items-center gap-4 py-8">
          <li className="text-lg font-semibold text-slate-700">Home</li>
          <li className="text-lg font-semibold text-slate-700">Task</li>
          <li className="text-lg font-semibold text-slate-700">Learning</li>
          <li className="text-lg font-semibold text-slate-700">Chatbox</li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
