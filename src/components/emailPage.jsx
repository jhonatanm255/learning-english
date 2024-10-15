import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";

function EmailPage() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/"); // Redirigir a la página de inicio de sesión
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl">Iniciaste sesión con Correo/Contraseña</h2>
      <button
        onClick={handleSignOut}
        className="bg-red-500 text-white p-2 rounded mt-4"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

export default EmailPage;
