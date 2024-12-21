import { createContext, useContext, useState, useEffect } from "react";
import { database } from "../components/firebaseConfig"; // Importa la configuración de Firebase
import { ref, set, remove } from "firebase/database"; // Métodos de Firebase

const UpdateContext = createContext();

export const UpdateProvider = ({ children }) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [newVersion, setNewVersion] = useState(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Detectar nuevos service workers instalados
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              setUpdateAvailable(true);
              console.log("Nueva versión del Service Worker disponible.");
            } else if (newWorker.state === "redundant") {
              console.error("Service Worker instalación fallida (redundant).");
            }
          });
        });
      });

      // Manejar mensajes del Service Worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data.type === "UPDATE_READY") {
          setUpdateAvailable(true);
          setNewVersion(event.data.newVersion);

          // Guardar actualización pendiente en Firebase
          const updateRef = ref(database, "updates/pending");
          set(updateRef, {
            version: event.data.newVersion,
            status: "pending",
          })
            .then(() =>
              console.log("Actualización pendiente registrada en Firebase.")
            )
            .catch((error) =>
              console.error("Error al guardar en Firebase:", error)
            );
        }
      });
    }
  }, []);

  const triggerUpdate = () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
    }

    // Eliminar la actualización pendiente en Firebase
    const updateRef = ref(database, "updates/pending");
    remove(updateRef)
      .then(() => console.log("Actualización pendiente eliminada de Firebase."))
      .catch((error) => console.error("Error al eliminar de Firebase:", error));

    // Recargar la página para aplicar la nueva versión
    window.location.reload();
  };

  return (
    <UpdateContext.Provider
      value={{ updateAvailable, triggerUpdate, newVersion, setUpdateAvailable }}
    >
      {children}
    </UpdateContext.Provider>
  );
};

export const useUpdate = () => useContext(UpdateContext);
