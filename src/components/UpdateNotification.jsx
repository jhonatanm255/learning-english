import React, { useState, useEffect } from "react";
import { useUpdate } from "../contexts/UpdateContext";
import { firebase } from "firebase/app"; // Asegúrate de que Firebase esté correctamente configurado

function UpdateNotification() {
  const { updateAvailable, triggerUpdate, newVersion, setUpdateAvailable } =
    useUpdate();

  // Estado para controlar la visibilidad del modal
  const [isVisible, setIsVisible] = useState(updateAvailable);

  useEffect(() => {
    setIsVisible(updateAvailable);
  }, [updateAvailable]);

  if (!isVisible) return null;

  const handleLater = () => {
    setIsVisible(false); // Cierra el modal

    // Guardar la actualización pendiente en Firebase
    if (firebase) {
      const updateRef = firebase.database().ref("updates/pending");
      updateRef.set({ version: newVersion, status: "pending" });
    }
  };

  const handleUpdateNow = () => {
    triggerUpdate(); // Inicia la actualización inmediatamente
    setIsVisible(false); // Cierra el modal
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4 text-center">
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
          onClick={handleUpdateNow} // Cierra el modal y actualiza
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
        >
          Actualizar ahora
        </button>
        <button
          onClick={handleLater} // Llamamos a la función que guarda la actualización pendiente
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Más tarde
        </button>
      </div>
    </div>
  );
}

export default UpdateNotification;
