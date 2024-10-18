import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import Chatbot from "./Chatbot";
import { useState } from "react";

function GooglePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      navigate("/"); // Redirigir a la página de inicio de sesión
    } catch (err) {
      setError("Error al cerrar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Chatbot />
      
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default GooglePage;
