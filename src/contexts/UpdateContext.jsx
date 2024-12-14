import { createContext, useContext, useState, useEffect } from "react";
import firebase from "firebase/app"; // Asegúrate de que Firebase esté configurado correctamente

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

          // Guardar estado en Firebase (Realtimedatabase)
          if (firebase) {
            const updateRef = firebase.database().ref("updates/pending");
            updateRef.set({
              version: event.data.newVersion,
              status: "pending",
            });
          }
        }
      });
    }
  }, []);

  const triggerUpdate = () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
    }

    // Limpiar el estado de la actualización pendiente en Firebase
    if (firebase) {
      const updateRef = firebase.database().ref("updates/pending");
      updateRef.remove();
    }

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
