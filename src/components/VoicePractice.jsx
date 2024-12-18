import React, { useState, useEffect } from "react";
import BackButton from "./backbutton";
import { BiCategoryAlt } from "react-icons/bi";

// Función para calcular la distancia de Levenshtein (ajustada)
const levenshtein = (s1, s2) => {
  const lenS1 = s1.length;
  const lenS2 = s2.length;
  const dp = Array(lenS1 + 1)
    .fill(null)
    .map(() => Array(lenS2 + 1).fill(null));

  for (let i = 0; i <= lenS1; i++) {
    for (let j = 0; j <= lenS2; j++) {
      if (i === 0) dp[i][j] = j;
      else if (j === 0) dp[i][j] = i;
      else {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // Eliminación
          dp[i][j - 1] + 1, // Inserción
          dp[i - 1][j - 1] + cost // Sustitución
        );
      }
    }
  }

  return dp[lenS1][lenS2];
};

// Función para medir la similitud entre cadenas con mayor flexibilidad
const similarity = (s1, s2) => {
  // Normalizamos las cadenas (sin espacios, en minúsculas)
  const dist = levenshtein(s1.trim().toLowerCase(), s2.trim().toLowerCase());
  const maxLen = Math.max(s1.length, s2.length);
  const threshold = 0.4; // Cambiar umbral si es necesario

  // Usamos un umbral mayor para aceptar variaciones
  return 1 - dist / maxLen > threshold;
};

const fetchWords = async () => {
  const response = await fetch("/words.json");
  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }
  const data = await response.json();
  return data;
};

function VoicePractice() {
  const [wordsByCategory, setWordsByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("frases");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userSpeech, setUserSpeech] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const loadWords = async () => {
      const words = await fetchWords();
      setWordsByCategory(words);
      setCurrentWordIndex(0);
    };
    loadWords();
  }, []);

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    setTimeout(() => {
      speechSynthesis.speak(utterance);
    }, 300);
  };

  const startRecognition = (callback) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      callback(transcript);
    };

    recognition.onerror = (event) => {
      alert("Hubo un error en el reconocimiento de voz: " + event.error);
    };

    recognition.start();
  };

  const handleSpeak = () => {
    const currentWord = wordsByCategory[selectedCategory][currentWordIndex];
    speakText(currentWord);
  };

  const handleRecognition = () => {
    startRecognition((result) => {
      setUserSpeech(result);
      const normalizedResult = result.trim().toLowerCase();
      const normalizedPhrase = wordsByCategory[selectedCategory][
        currentWordIndex
      ]
        .trim()
        .toLowerCase();

      // Usa la función de similitud para una mayor flexibilidad
      if (similarity(normalizedResult, normalizedPhrase)) {
        setFeedback("¡Correcto!");
        setCurrentWordIndex((prevIndex) => prevIndex + 1);
      } else {
        setFeedback("Casi! Inténtalo de nuevo.");
      }
    });
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
    setCurrentWordIndex(0);
  };

  return (
    <div className="text-center transition-all ease-in-out duration-300">
      <div className="flex justify-between px-4 py-4">
        <h2 className="text-2xl text-gray-700 dark:text-gray-200 font-bold mb-4 transition-all ease-in-out duration-300">
          Práctica de pronunciación
        </h2>
        <BackButton />
      </div>

      <div className="flex justify-start items-center gap-2 mt-8">
        <BiCategoryAlt className="text-3xl text-green-600 dark:text-green-400 transition-all ease-in-out duration-300" />
        <p className="text-2xl text-gray-500 dark:text-gray-300 font-semibold transition-all ease-in-out duration-300">
          Categorías
        </p>
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-lg py-4 transition-all ease-in-out duration-300">
        Seleccione entre las cuatro categorías que tiene la app para practicar
        la pronunciación de distintas palabras.
      </p>

      <select
        className="p-2 bg-blue-200 dark:bg-blue-600 rounded mt-4 text-xl text-slate-800 dark:text-slate-100 transition-all ease-in-out duration-300"
        onChange={handleCategoryChange}
        value={selectedCategory}
      >
        <option value="frases">Frases</option>
        <option value="abecedario">Abecedario</option>
        <option value="dias_y_meses">Días y Meses</option>
        <option value="numeros">Números</option>
      </select>

      <p className="my-4 text-slate-700 dark:text-slate-300 text-xl transition-all ease-in-out duration-300">
        Frase:{" "}
        <strong className="text-gray-900 dark:text-gray-100 transition-all ease-in-out duration-300">
          {wordsByCategory[selectedCategory]?.[currentWordIndex] || ""}
        </strong>
      </p>

      <button
        onClick={handleSpeak}
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded transition-all ease-in-out duration-300"
      >
        Escuchar Frase
      </button>
      <button
        onClick={handleRecognition}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded ml-4 transition-all ease-in-out duration-300"
      >
        Repetir Frase
      </button>

      {userSpeech && (
        <p className="mt-4 text-gray-800 dark:text-gray-100 transition-all ease-in-out duration-300">
          Tú dijiste: <strong>{userSpeech}</strong>
        </p>
      )}
      {feedback && (
        <p
          className={`mt-4 transition-all ease-in-out duration-300 ${
            feedback === "¡Correcto!" ? "text-green-500" : "text-red-500"
          }`}
        >
          {feedback}
        </p>
      )}
    </div>
  );
}

export default VoicePractice;
