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
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              setUpdateAvailable(true);
            }
          });
        });
      });

      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data.type === "UPDATE_READY") {
          setUpdateAvailable(true);
          setNewVersion(event.data.newVersion);

          // Guardar estado en Firebase (Realtime Database)
          const updateRef = ref(database, "updates/pending"); // Usar ref
          set(updateRef, {
            version: event.data.newVersion,
            status: "pending",
          });
        }
      });
    }
  }, []);

  const triggerUpdate = () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
    }

    // Limpiar el estado de la actualización pendiente en Firebase
    const updateRef = ref(database, "updates/pending"); // Usar ref
    remove(updateRef); // Eliminar el estado pendiente de Firebase

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
