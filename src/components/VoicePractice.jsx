import React, { useState, useEffect } from "react";
import BackButton from "./backbutton";
import { BiCategoryAlt } from "react-icons/bi";

const fetchWords = async () => {
  const response = await fetch("/words.json");
  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }
  const data = await response.json();
  return data;
};

// Función para medir la similitud de cadenas (simplificada)
const similarity = (s1, s2) => {
  let matches = 0;
  for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
    if (s1[i] === s2[i]) matches++;
  }
  return matches / Math.max(s1.length, s2.length);
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

      // Usa la función de similitud para permitir flexibilidad
      const similarityScore = similarity(normalizedResult, normalizedPhrase);

      if (similarityScore >= 0.8) {
        // Acepta frases similares en un 80% o más
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
    <div className="text-center">
      <div className="flex justify-between px-4 py-4">
        <h2 className="text-2xl text-gray-700 font-bold mb-4">
          Práctica de pronunciación
        </h2>
        <BackButton />
      </div>

      <div className="flex justify-start items-center gap-2 mt-8">
        <BiCategoryAlt className="text-3xl text-green-600" />
        <p className="text-2xl text-gray-500 font-semibold">Categorías</p>
      </div>
      <p className="text-slate-500 text-lg py-4">
        Seleccione entre las cuatro categorías que tiene la app para practicar
        la pronunciación de distintas palabras.
      </p>

      <select
        className="p-2 bg-blue-200 rounded mt-4 text-xl text-slate-800"
        onChange={handleCategoryChange}
        value={selectedCategory}
      >
        <option value="frases">Frases</option>
        <option value="abecedario">Abecedario</option>
        <option value="dias_y_meses">Días y Meses</option>
        <option value="numeros">Números</option>
      </select>

      <p className="my-4 text-slate-700 text-xl">
        Frase:{" "}
        <strong>
          {wordsByCategory[selectedCategory]?.[currentWordIndex] || ""}
        </strong>
      </p>

      <button
        onClick={handleSpeak}
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Escuchar Frase
      </button>
      <button
        onClick={handleRecognition}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded ml-4"
      >
        Repetir Frase
      </button>

      {userSpeech && (
        <p className="mt-4">
          Tú dijiste: <strong>{userSpeech}</strong>
        </p>
      )}
      {feedback && (
        <p
          className={`mt-4 ${
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
