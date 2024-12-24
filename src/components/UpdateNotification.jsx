import React, { useState, useEffect } from "react";
import { useUpdate } from "../contexts/UpdateContext";
import { database } from "./firebaseConfig";
import { ref, set } from "firebase/database";

function UpdateNotification() {
  const { updateAvailable, triggerUpdate, newVersion, setUpdateAvailable } =
    useUpdate();

  // Estado para controlar la visibilidad del modal
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (updateAvailable) setIsVisible(true);
  }, [updateAvailable]);

  if (!isVisible) return null;

  const handleLater = () => {
    // Cierra el modal
    setIsVisible(false);

    // Guardar la actualización pendiente en Firebase
    const updateRef = ref(database, "updates/pending");
    set(updateRef, { version: newVersion, status: "pending" })
      .then(() => console.log("Actualización pendiente registrada"))
      .catch((error) =>
        console.error("Error al guardar la actualización pendiente:", error)
      );

    // Actualizar el estado global
    setUpdateAvailable(false);
  };

  const handleUpdateNow = () => {
    triggerUpdate(); // Inicia la actualización
    setIsVisible(false); // Cierra el modal

    // Ya no es necesario limpiar la actualización pendiente en Firebase aquí,
    // ya que el triggerUpdate debe ocuparse de eso.
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4 text-center shadow-lg animate-slide-up">
      <div className="flex gap-2 justify-center">
        <h2 className="font-semibold text-lg text-gray-200">
          ¡Nueva versión disponible!
        </h2>
        <p className="text-center text-gray-100 text-lg">
          <strong>{newVersion}</strong>
        </p>
      </div>

      <p className="text-gray-300">
        Hay una nueva actualización disponible. ¿Quieres actualizar ahora?
      </p>
      <div className="mt-2">
        <button
          onClick={handleUpdateNow}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
        >
          Actualizar ahora
        </button>
        <button
          onClick={handleLater}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          Más tarde
        </button>
      </div>
    </div>
  );
}

export default UpdateNotification;
