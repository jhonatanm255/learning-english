import React from "react";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="bg-blue-500 flex items-center hover:bg-blue-700 text-white font-bold mb-4 py-2 px-4 rounded"
    >
      <i class="bx bx-arrow-back"></i>  
    </button>
  );
}

export default BackButton;
