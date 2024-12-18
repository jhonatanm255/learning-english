import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, storage } from "./firebaseConfig.js";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Session() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // FOTO DE PERFIL
  const uploadProfilePicture = async (user) => {
    if (file) {
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/email");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await uploadProfilePicture(user);
        navigate("/email");
      }
    } catch (err) {
      setError(
        err.code === "auth/user-not-found"
          ? "Usuario no encontrado."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/google");
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
    <div className="max-w-md mx-auto mt-16 mb-8 p-4 rounded bg-white dark:bg-gray-800 transition-all ease-in-out duration-300">
      <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200 transition-all ease-in-out duration-300">
        {isLoginMode ? "Iniciar Sesión" : "Crear Cuenta"}
      </h2>
      {error && (
        <p className="text-red-500 mb-4 transition-all ease-in-out duration-300">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-1 text-gray-500 dark:text-gray-300 transition-all ease-in-out duration-300"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:border-gray-500 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-in-out duration-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block mb-1 text-gray-500 dark:text-gray-300 transition-all ease-in-out duration-300"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:border-gray-500 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-in-out duration-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {!isLoginMode && (
          <div className="mb-4">
            <label
              htmlFor="profilePicture"
              className="block mb-1 text-gray-500 dark:text-gray-300 transition-all ease-in-out duration-300"
            >
              Foto de Perfil
            </label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              className="p-2 bg-gray-100 dark:bg-gray-700 border rounded text-gray-900 dark:text-gray-200 transition-all ease-in-out duration-300"
            />
          </div>
        )}
        <button
          type="submit"
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white p-2 rounded mt-4 transition-all ease-in-out duration-300`}
          disabled={loading}
        >
          {loading
            ? "Cargando..."
            : isLoginMode
            ? "Iniciar Sesión"
            : "Crear Cuenta"}
        </button>
      </form>
      <button
        onClick={handleGoogleSignIn}
        className="flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 w-full border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-200 p-2 rounded mt-4 transition-all ease-in-out duration-300"
      >
        <FcGoogle className="text-2xl mr-2" />
        Iniciar sesión con Google
      </button>
      <button
        onClick={toggleMode}
        className="w-full mt-4 text-blue-500 dark:text-blue-300 transition-all ease-in-out duration-300"
      >
        {isLoginMode ? (
          <>
            <span className="text-gray-500 dark:text-gray-400">
              ¿No tienes cuenta?
            </span>{" "}
            <span className="hover:border-b hover:border-blue-500">
              Crea una
            </span>
          </>
        ) : (
          <>
            <span className="text-gray-500 dark:text-gray-400">
              ¿Ya tienes cuenta?
            </span>{" "}
            <span className="hover:border-b hover:border-blue-500">
              Iniciar sesión
            </span>
          </>
        )}
      </button>

      <button
        onClick={handlePasswordReset}
        className="w-full text-blue-500 dark:text-blue-300 mt-2 transition-all ease-in-out duration-300"
      >
        <span className="hover:border-b hover:border-blue-500">
          Recuperar Contraseña
        </span>
      </button>
    </div>
  );
}

export default Session;
