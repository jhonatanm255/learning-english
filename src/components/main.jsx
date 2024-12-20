import React from "react";
import { Link } from "react-router-dom";
import { PiTranslateFill } from "react-icons/pi";

function Main() {
  return (
    <>
      <h2 className="mt-8 text-2xl font-bold text-gray-900 dark:text-gray-100 lg:mt-16">
        Herramientas de aprendizaje
      </h2>
      
      <div className="grid grid-cols-1 w-full gap-4 pt-8 lg:flex lg:pt-16 lg:px-8">
        {/* CHATBOT */}
        <Link className="w-full" to="/chatbot">
          <div className="bg-blue-50 dark:bg-gray-800 flex shadow-md items-center w-full h-32 p-4 cursor-pointer rounded-md transform transition-all ease-in-out duration-300">
            <i className="text-blue-400 text-5xl flex justify-center py-8 bx bxs-bot"></i>
            <p className="text-slate-800 dark:text-gray-200 font-semibold text-center text-lg ml-8">
              Chatea con el bot de Gemini
            </p>
          </div>
        </Link>

        {/* VOICE PRACTICE */}
        <Link className="w-full" to="/voice">
          <div className="bg-green-50 dark:bg-gray-800 flex shadow-md items-center w-full h-32 p-4 cursor-pointer rounded-md transform transition-all ease-in-out duration-300">
            <i className="text-green-400 text-6xl flex justify-center py-6 bx bxs-user-voice"></i>
            <p className="text-slate-800 dark:text-gray-200 font-semibold text-center ml-8 text-lg">
              Practica la Pronunciación
            </p>
          </div>
        </Link>

        {/* TRANSLATE */}
        <Link className="w-full" to="/translator">
          <div className="bg-yellow-50 dark:bg-gray-800 flex shadow-md items-center w-full h-32 p-4 cursor-pointer rounded-md transform transition-all ease-in-out duration-300">
            <PiTranslateFill className="text-yellow-400 text-5xl flex justify-center" />
            <p className="text-slate-800 dark:text-gray-200 font-semibold text-center ml-8 text-lg">
              Utiliza Nuestro Traductor
            </p>
          </div>
        </Link>

        {/* NUEVO ITEM */}
        {/* <div className="bg-red-50 dark:bg-gray-800 flex shadow-md items-center w-full h-32 p-4 cursor-pointer rounded-md transform transition-all ease-in-out duration-300">
          <i className="text-red-400 text-5xl flex justify-center py-8 bx bxs-heart"></i>
          <p className="text-slate-800 dark:text-gray-200 font-semibold text-center ml-8 text-lg">
            Nuevo Item
          </p>
        </div> */}
      </div>
    </>
  );
}

export default Main;
