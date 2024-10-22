import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import Main from "./main";

function GooglePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // Verificación de la autenticación del usuario
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        navigate("/login"); // Redirige al login si el usuario no está autenticado
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    setLoading(true);
    setError("");

    try {
      await signOut(auth);
      navigate("/"); // Redirige a la página principal después de cerrar sesión
    } catch (err) {
      setError("Error al cerrar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Cargando...</p>; // O un spinner si prefieres
  }

  return (
    <div className="flex flex-col items-center">
      <Main />
      
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default GooglePage;
