import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig"; // Importa la configuración de Firebase
import Main from "./main";

function EmailPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Verificación de la autenticación del usuario
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        navigate("/login"); // Redirige al formulario de login si no está autenticado
      }
    });

    // Limpia el listener cuando el componente se desmonta
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <p>Cargando...</p>; // O un spinner si prefieres
  }

  return (
    <div className="text-center">
      {user ? <Main /> : <p>Redirigiendo...</p>}{" "}
      {/* Solo muestra el contenido si el usuario está autenticado */}
    </div>
  );
}

export default EmailPage;
