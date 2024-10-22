import React, { useState } from "react";
import BackButton from "./backbutton";

/*LISTA DE PALABRAS PARA PRACTICAR
AQUI CONSIDERO LA OPCION DE GENERAR LAS PALABRAS CON IA EN LA NUBE Y CONSUMIRLAS MEDINTE API
O CREAR UN JSON CON MUCHAS PALABRAS Y GENERAR UNA FUNCION QUE LAS MUESTRE ALEATORIAMENTE*/
const words = [
  "hello",
  "how are you",
  "good morning",
  "good night",
  "thank you",
  "please",
  "sorry",
  "yes",
  "no",
  "goodbye",
];

// OBTENER UNA PALABRA ALEATORIA
const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};

function VoicePractice() {
  const [currentWord, setCurrentWord] = useState(getRandomWord());
  const [userSpeech, setUserSpeech] = useState("");
  const [feedback, setFeedback] = useState("");

  // REPRODUCIR FRASE
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  // RECONOCIMIENTO DE VOZ
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
    speakText(currentWord);
  };

  const handleRecognition = () => {
    startRecognition((result) => {
      setUserSpeech(result);

      const normalizedResult = result.trim().toLowerCase();
      const normalizedPhrase = currentWord.trim().toLowerCase();

      // DEPURACION (PARA ELIMINAR)
      console.log("Frase original:", normalizedPhrase); 
      console.log("Frase del usuario:", normalizedResult);

      if (normalizedResult === normalizedPhrase) {
        setFeedback("¡Correcto!");
        setCurrentWord(getRandomWord());
      } else {
        setFeedback("Inténtalo de nuevo.");
      }
    });
  };

  return (
    <div className="text-center">
      <div className="flex justify-between px-4 py-4">
        <h2 className="text-2xl font-bold mb-4">Práctica de pronunciación</h2>
        <BackButton />
      </div>
      <p className="mt-4">
        Frase: <strong>{currentWord}</strong>
      </p>
      <button
        onClick={handleSpeak}
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Escuchar Frase
      </button>
      <button
        onClick={handleRecognition}
        className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded ml-4"
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
