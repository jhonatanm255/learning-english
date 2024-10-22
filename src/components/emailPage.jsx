import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import { useState } from "react";
import Main from "./main";

function EmailPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignOut = async () => {
    setLoading(true);
    setError("");

    try {
      await signOut(auth);
      navigate("/"); 
    } catch (err) {
      setError("Error al cerrar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <Main />
      {error && <p className="text-red-500 mt-2">{error}</p>}{" "}
      {/* AQUI SE MUESTRA EL MENSAJE DE ERROR */}
    </div>
  );
}

export default EmailPage;
