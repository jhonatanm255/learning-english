import React, { useState } from "react";
import BackButton from "./backbutton";

const Translator = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("en"); // Idioma de origen por defecto (inglés)
  const [targetLanguage, setTargetLanguage] = useState("es"); // Idioma de destino por defecto (español)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Manejo de errores

  const translateText = async () => {
    if (!inputText.trim()) {
      setError("Por favor, introduce texto para traducir.");
      setTranslatedText("");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Realizamos la solicitud a la API de MyMemory con los idiomas correctos
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          inputText
        )}&langpair=${sourceLanguage}|${targetLanguage}`
      );

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      setTranslatedText(
        data.responseData.translatedText || "No se pudo obtener la traducción."
      );
    } catch (error) {
      setTranslatedText("");
      setError(
        "Hubo un error al traducir el texto. Intenta nuevamente más tarde."
      );
      console.error("Error en la solicitud de traducción:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para invertir los idiomas de origen y destino
  const toggleLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-24 bg-gray-50 dark:bg-gray-800 rounded-md shadow-lg transition-all duration-500 ease-in-out">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Traductor
        </h1>
        <BackButton />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <textarea
          className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white transition-all duration-500 ease-in-out"
          rows="6"
          placeholder="Introduce el texto aquí..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          aria-label="Texto a traducir"
        />
        <textarea
          className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 dark:text-white transition-all duration-500 ease-in-out"
          rows="6"
          readOnly
          placeholder={
            loading ? "Traduciendo..." : "Traducción aparecerá aquí..."
          }
          value={translatedText}
          aria-label="Texto traducido"
        />
      </div>

      {error && (
        <div
          className="mt-4 p-2 bg-red-200 text-red-700 border border-red-400 rounded-md"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center justify-between">
          <select
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white transition-all duration-500 ease-in-out"
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            aria-label="Seleccionar idioma de origen"
          >
            <option value="en">Inglés</option>
            <option value="es">Español</option>
            <option value="fr">Francés</option>
            <option value="de">Alemán</option>
            <option value="it">Italiano</option>
            <option value="ja">Japonés</option>
            <option value="ko">Coreano</option>
            <option value="zh-CN">Chino</option>
          </select>

          {/* Botón para alternar idiomas */}
          <button
            onClick={toggleLanguages}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md mx-2"
            aria-label="Alternar idiomas"
          >
            <i class="bx bx-transfer font-semibold flex items-center"></i>
          </button>

          <select
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white transition-all duration-500 ease-in-out"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            aria-label="Seleccionar idioma objetivo"
          >
            <option value="es">Español</option>
            <option value="en">Inglés</option>
            <option value="fr">Francés</option>
            <option value="de">Alemán</option>
            <option value="it">Italiano</option>
            <option value="ja">Japonés</option>
            <option value="ko">Coreano</option>
            <option value="zh-CN">Chino</option>
          </select>
        </div>

        {/* Botón de traducción debajo de los selectores */}
        <button
          onClick={translateText}
          className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-all duration-500 ease-in-out"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Traduciendo..." : "Traducir"}
        </button>
      </div>
    </div>
  );
};

export default Translator;
