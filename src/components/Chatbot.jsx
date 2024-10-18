
import React, { useState } from "react";
import axios from "axios";

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
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBw9C-TmXENnreA-fawCpCg3nH_Ab41Q2U", // Asegúrate de usar tu clave API correcta aquí
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

      console.log(response.data); // Ver la respuesta completa para asegurarnos de que es la correcta

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
    <div className="w-full h-full mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Chatbot Learning English</h2>
      <div className="chat-window h-[540px] max-h-[540px] overflow-y-auto mb-4 p-2 border border-gray-300 rounded bg-gray-50">
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
                msg.sender === "user" ? "bg-blue-100" : "bg-green-100"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center text-gray-500 mb-2">Writing...</div>
      )}

      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          required
          className="flex-grow outline-none p-2 border border-gray-300 rounded-l"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600"
        >
          <i className="flex items-center px-2 bx bx-send"></i>
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
