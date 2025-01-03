import { createContext, useContext, useState, useEffect } from "react";
import { database } from "../components/firebaseConfig";
import { ref, set, remove, get } from "firebase/database";
import Swal from "sweetalert2";

const UpdateContext = createContext();

export const UpdateProvider = ({ children }) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [newVersion, setNewVersion] = useState(null);
  const [pendingUpdate, setPendingUpdate] = useState(false);

  useEffect(() => {
    // Revisamos si hay una actualización pendiente en Firebase
    const checkPendingUpdate = async () => {
      const updateRef = ref(database, "updates/pending");
      const snapshot = await get(updateRef);
      if (snapshot.exists()) {
        const updateData = snapshot.val();
        setPendingUpdate(true);
        setNewVersion(updateData.version);
      }
    };

    checkPendingUpdate();

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
      .then(() => {
        console.log("Actualización pendiente eliminada de Firebase.");
        setPendingUpdate(false); // Actualizamos el estado de la UI
        setUpdateAvailable(false); // Ya no hay actualización disponible
      })
      .catch((error) => console.error("Error al eliminar de Firebase:", error));

    Swal.fire({
      title: "¡Actualización exitosa!",
      text: "La nueva versión de la app ya está lista para usarse.",
      icon: "success",
      confirmButtonText: "Aceptar",
    }).then(() => {
      // Después de que el usuario cierre el modal, recargamos la página
      window.location.reload();
    });
  };

  const dismissUpdate = () => {
    // Eliminar la actualización pendiente sin aplicar la actualización
    const updateRef = ref(database, "updates/pending");
    remove(updateRef)
      .then(() => {
        console.log("Actualización pendiente descartada.");
        setPendingUpdate(false); // Actualizamos el estado de la UI
        setUpdateAvailable(false); // Ya no hay actualización disponible
      })
      .catch((error) => console.error("Error al eliminar de Firebase:", error));
  };

  return (
    <UpdateContext.Provider
      value={{
        updateAvailable,
        triggerUpdate,
        dismissUpdate,
        newVersion,
        pendingUpdate,
        setUpdateAvailable,
        setPendingUpdate,
      }}
    >
      {children}
    </UpdateContext.Provider>
  );
};

export const useUpdate = () => useContext(UpdateContext);