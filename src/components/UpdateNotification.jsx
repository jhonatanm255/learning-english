import React from "react";
import { useUpdate } from "../contexts/UpdateContext";
import { database } from "../components/firebaseConfig"; // Asegúrate de que esta ruta sea correcta
import { ref, set } from "firebase/database"; // Importa los métodos necesarios

function UpdateNotification() {
  const { updateAvailable, triggerUpdate, newVersion, setUpdateAvailable } =
    useUpdate();

  if (!updateAvailable) return null;

  const handleLater = () => {
    setUpdateAvailable(false); // Desactiva la notificación visualmente

    // Guardar la actualización pendiente en Firebase
    const updateRef = ref(database, "updates/pending");
    set(updateRef, { version: newVersion, status: "pending" }); // Guardar los datos en Firebase
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
          onClick={triggerUpdate}
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
