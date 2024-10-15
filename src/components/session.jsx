import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, storage } from "./firebaseConfig.js"; // Asegúrate de que la ruta sea correcta
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Importar funciones de Storage

function Session() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null); // Estado para el archivo de imagen
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Para la navegación

  const toggleMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]); // Guardar el archivo seleccionado
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/email"); // Redirigir a la página 'email' después de iniciar sesión con correo/contraseña
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Si hay un archivo de imagen, subirlo a Firebase Storage
        if (file) {
          const storageRef = ref(storage, `profilePictures/${user.uid}`);
          await uploadBytes(storageRef, file); // Subir el archivo

          // Obtener la URL de la imagen
          const photoURL = await getDownloadURL(storageRef);

          // Actualizar el perfil del usuario con la URL de la imagen
          await updateProfile(user, { photoURL });
        }

        navigate("/email"); // Redirigir a la página 'email' después de crear la cuenta
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/google"); // Redirigir a la página 'google' después de iniciar sesión con Google
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Por favor, ingresa tu email para restablecer tu contraseña");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("¡Email para restablecer la contraseña enviado!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto -mt-40 mb-8 p-4   rounded">
      <h2 className="text-2xl font-bold mb-4">
        {isLoginMode ? "Iniciar Sesión" : "Crear Cuenta"}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {!isLoginMode && ( // Mostrar campo de carga de imagen solo en modo de registro
          <div className="mb-4">
            <label htmlFor="profilePicture" className="block mb-1">
              Foto de Perfil
            </label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {isLoginMode ? "Iniciar Sesión" : "Crear Cuenta"}
        </button>
      </form>
      <button
        onClick={handleGoogleSignIn}
        className="w-full bg-red-500 text-white p-2 rounded mt-4"
      >
        Iniciar sesión con Google
      </button>
      <button onClick={toggleMode} className="w-full text-blue-500 mt-4">
        {isLoginMode
          ? "¿No tienes cuenta? Crear una cuenta"
          : "¿Ya tienes cuenta? Iniciar sesión"}
      </button>
      <button
        onClick={handlePasswordReset}
        className="w-full text-blue-500 mt-2"
      >
        Recuperar Contraseña
      </button>
    </div>
  );
}

export default Session;
