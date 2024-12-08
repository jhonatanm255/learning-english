import React from "react";
import { useUpdate } from "../contexts/UpdateContext"; // Asegúrate de tener la ruta correcta

function UpdateNotification() {
  const { updateAvailable, triggerUpdate } = useUpdate(); // Accede al estado de la actualización

  // Si no hay actualización disponible, no se muestra nada
  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 text-center">
      <h2 className="font-semibold">¡Nueva versión disponible!</h2>
      <p>Hay una nueva actualización disponible. ¿Quieres actualizar ahora?</p>
      <div className="mt-2">
        <button
          onClick={triggerUpdate}
          className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
        >
          Actualizar ahora
        </button>
        <button
          onClick={() => window.location.reload()} // Recarga la página si el usuario no quiere actualizar
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Más tarde
        </button>
      </div>
    </div>
  );
}

export default UpdateNotification;
