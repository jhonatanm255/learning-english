import React from "react";
import { Link } from "react-router-dom";

function Main() {
  return (
    <div className="container mt-4 mb-24 px-4">
      <h2 className="text-center mt-28 text-2xl font-bold text-gray-900 dark:text-gray-100 lg:mt-32">
        Herramientas de aprendizaje
      </h2>

      <div className="grid grid-cols-1 w-full gap-4 pt-8 lg:flex lg:pt-16 lg:px-8">
        {/* CHATBOT */}
        <Link className="w-full" to="/chatbot">
          <div className="bg-blue-50 dark:bg-gray-800 flex shadow-md items-center w-full h-32 p-4 cursor-pointer rounded-md transform transition-all ease-in-out duration-300">
            <i className="text-blue-400 text-5xl flex justify-center py-8 bx bxs-bot"></i>
            <div className="flex flex-col justify-center ml-8">
              <p className="text-slate-800 dark:text-gray-200 font-semibold text-lg">
                Bot de Gemini
              </p>
              <p className="text-slate-500 dark:text-gray-400 text-sm">
                Esta herramienta te ayudará a practicar tu inglés con un chatbot
              </p>
            </div>
          </div>
        </Link>

        {/* VOICE PRACTICE */}
        <Link className="w-full" to="/voice">
          <div className="bg-green-50 dark:bg-gray-800 flex shadow-md items-center w-full h-32 p-4 cursor-pointer rounded-md transform transition-all ease-in-out duration-300">
            <i className="text-green-400 text-5xl flex justify-center py-8 bx bxs-user-voice"></i>
            <div className="flex flex-col justify-center ml-8">
              <p className="text-slate-800 dark:text-gray-200 font-semibold text-lg">
                Pronunciación
              </p>
              <p className="text-slate-500 dark:text-gray-400 text-sm">
                Práctica de pronunciación de palabras en inglés utilizando
                nuestra herramienta de voz
              </p>
            </div>
          </div>
        </Link>

        {/* TRANSLATE */}
        <Link className="w-full" to="/translator">
          <div className="bg-yellow-50 dark:bg-gray-800 flex shadow-md items-center w-full h-32 p-4 cursor-pointer rounded-md transform transition-all ease-in-out duration-300">
            <i class="text-yellow-400 text-5xl flex justify-center py-8 bx bxs-message-alt-detail"></i>
            <div className="flex flex-col justify-center ml-8">
              <p className="text-slate-800 dark:text-gray-200 font-semibold text-lg">
                Traductor
              </p>
              <p className="text-slate-500 dark:text-gray-400 text-sm">
                Traduce palabras y frases a diferentes idiomas utilizando
                nuestra herramienta de traducción
              </p>
            </div>
          </div>
        </Link>

        <Link className="w-full" to="">
          <div className="bg-red-50 dark:bg-gray-800 flex shadow-md items-center w-full h-32 p-4 cursor-pointer rounded-md transform transition-all ease-in-out duration-300">
            <i class="text-red-400 text-5xl flex justify-center py-8 bx bxs-book-add"></i>
            <div className="flex flex-col justify-center ml-8">
              <p className="text-slate-800 dark:text-gray-200 font-semibold text-lg">
                New Item
              </p>
              <p className="text-slate-500 dark:text-gray-400 text-sm">
                Este es un item de prueba
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Main;






