import React, { useState } from "react";
import axios from "axios";
import BackButton from "./backbutton";

function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;

    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setLoading(true);

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAAqBptinQ1QEWiG8L29wR6a5OYCmaJ_MA",
        {
          contents: [
            {
              parts: [
                {
                  text: input,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const botMessage =
        response.data.candidates[0].content.parts[0].text ||
        "Lo siento, no entendí tu mensaje.";

      setMessages((prev) => [...prev, { text: botMessage, sender: "bot" }]);
    } catch (error) {
      console.error("Error al obtener la respuesta de Google Gemini:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Lo siento, hubo un error al procesar tu mensaje.",
          sender: "bot",
        },
      ]);
    }

    setLoading(false);
    setInput("");
  };

  return (
    <div className="w-full h-full mx-auto mt-20 p-4 dark:bg-gray-800 shadow-md rounded transition-all duration-500 ease-in-out">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Chatbot Learning English
        </h2>
        <BackButton />
      </div>
      <div className="chat-window h-[540px] max-h-[495px] lg:h-[315px] overflow-y-auto mb-4 p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 transition-all duration-500 ease-in-out">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <strong
              className={`${
                msg.sender === "user" ? "text-blue-500" : "text-green-500"
              }`}
            >
              {msg.sender === "user" ? "You:" : "Bot:"}
            </strong>
            <span
              className={`ml-2 p-2 inline-block rounded ${
                msg.sender === "user"
                  ? "bg-blue-100 dark:bg-blue-600 text-blue-900 dark:text-white"
                  : "bg-green-100 dark:bg-green-600 text-green-900 dark:text-white"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center text-gray-500 dark:text-gray-400 mb-2">
          Writing...
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          required
          className="flex-grow outline-none p-2 border border-gray-300 dark:border-gray-600 rounded-l dark:bg-gray-700 dark:text-white transition-all duration-500 ease-in-out"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition-all duration-500 ease-in-out"
        >
          <i className="flex items-center px-2 bx bx-send"></i>
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
