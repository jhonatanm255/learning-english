import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import Main from "./main";
import Swal from "sweetalert2";

function EmailPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Verificación de la autenticación del usuario y su correo
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        setLoading(false);

        // Verificar si el usuario ha verificado su correo electrónico
        if (!user.emailVerified) {
          Swal.fire({
            title: "Verificación!",
            text: "Por favor verifica tu email para continuar.",
            icon: "warning",
          });
          navigate("/login"); 
        }
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
      {/* Solo muestra el contenido si el usuario está autenticado y ha verificado su correo */}
    </div>
  );
}

export default EmailPage;
