// import { createContext, useContext, useState, useEffect } from "react";
// import { database } from "../components/firebaseConfig"; // Importa la configuración de Firebase
// import { ref, set, remove, get } from "firebase/database"; // Métodos de Firebase

// const UpdateContext = createContext();

// export const UpdateProvider = ({ children }) => {
//   const [updateAvailable, setUpdateAvailable] = useState(false);
//   const [newVersion, setNewVersion] = useState(null);
//   const [pendingUpdate, setPendingUpdate] = useState(false);

//   useEffect(() => {
//     // Revisamos si hay una actualización pendiente en Firebase
//     const checkPendingUpdate = async () => {
//       const updateRef = ref(database, "updates/pending");
//       const snapshot = await get(updateRef);
//       if (snapshot.exists()) {
//         const updateData = snapshot.val();
//         setPendingUpdate(true);
//         setNewVersion(updateData.version);
//       }
//     };

//     checkPendingUpdate();

//     if ("serviceWorker" in navigator) {
//       navigator.serviceWorker.ready.then((registration) => {
//         // Detectar nuevos service workers instalados
//         registration.addEventListener("updatefound", () => {
//           const newWorker = registration.installing;
//           newWorker.addEventListener("statechange", () => {
//             if (
//               newWorker.state === "installed" &&
//               navigator.serviceWorker.controller
//             ) {
//               setUpdateAvailable(true);
//               console.log("Nueva versión del Service Worker disponible.");
//             } else if (newWorker.state === "redundant") {
//               console.error("Service Worker instalación fallida (redundant).");
//             }
//           });
//         });
//       });

//       // Manejar mensajes del Service Worker
//       navigator.serviceWorker.addEventListener("message", (event) => {
//         if (event.data.type === "UPDATE_READY") {
//           setUpdateAvailable(true);
//           setNewVersion(event.data.newVersion);

//           // Guardar actualización pendiente en Firebase
//           const updateRef = ref(database, "updates/pending");
//           set(updateRef, {
//             version: event.data.newVersion,
//             status: "pending",
//           })
//             .then(() =>
//               console.log("Actualización pendiente registrada en Firebase.")
//             )
//             .catch((error) =>
//               console.error("Error al guardar en Firebase:", error)
//             );
//         }
//       });
//     }
//   }, []);

//   const triggerUpdate = () => {
//     if (navigator.serviceWorker.controller) {
//       navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
//     }

//     // Eliminar la actualización pendiente en Firebase
//     const updateRef = ref(database, "updates/pending");
//     remove(updateRef)
//       .then(() => {
//         console.log("Actualización pendiente eliminada de Firebase.");
//         setPendingUpdate(false); // Actualizamos el estado de la UI
//         setUpdateAvailable(false); // Ya no hay actualización disponible
//       })
//       .catch((error) => console.error("Error al eliminar de Firebase:", error));

//     // Recargar la página para aplicar la nueva versión
//     window.location.reload();
//   };

//   const dismissUpdate = () => {
//     // Eliminar la actualización pendiente sin aplicar la actualización
//     const updateRef = ref(database, "updates/pending");
//     remove(updateRef)
//       .then(() => {
//         console.log("Actualización pendiente descartada.");
//         setPendingUpdate(false); // Actualizamos el estado de la UI
//         setUpdateAvailable(false); // Ya no hay actualización disponible
//       })
//       .catch((error) => console.error("Error al eliminar de Firebase:", error));
//   };

//   return (
//     <UpdateContext.Provider
//       value={{
//         updateAvailable,
//         triggerUpdate,
//         dismissUpdate,
//         newVersion,
//         pendingUpdate,
//         setUpdateAvailable,
//         setPendingUpdate,
//       }}
//     >
//       {children}
//     </UpdateContext.Provider>
//   );
// };

// export const useUpdate = () => useContext(UpdateContext);







import { createContext, useContext, useState, useEffect } from "react";
import { database } from "../components/firebaseConfig"; // Importa la configuración de Firebase
import { ref, set, remove, get } from "firebase/database"; // Métodos de Firebase

const UpdateContext = createContext();

export const UpdateProvider = ({ children }) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [newVersion, setNewVersion] = useState(null);
  const [pendingUpdate, setPendingUpdate] = useState(false);

  useEffect(() => {
    const checkPendingUpdate = async () => {
      try {
        const updateRef = ref(database, "updates/pending");
        const snapshot = await get(updateRef);
        if (snapshot.exists()) {
          const updateData = snapshot.val();
          setPendingUpdate(true);
          setNewVersion(updateData.version);
        }
      } catch (error) {
        console.error("Error al verificar actualizaciones pendientes:", error);
      }
    };

    checkPendingUpdate();

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
              console.log("Nueva versión disponible del Service Worker.");
            } else if (newWorker.state === "redundant") {
              console.error("Fallo en la instalación del Service Worker.");
            }
          });
        });
      });

      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "UPDATE_READY") {
          setUpdateAvailable(true);
          setNewVersion(event.data.newVersion);

          const updateRef = ref(database, "updates/pending");
          set(updateRef, {
            version: event.data.newVersion,
            status: "pending",
          })
            .then(() => console.log("Actualización pendiente registrada."))
            .catch((error) =>
              console.error(
                "Error al registrar actualización en Firebase:",
                error
              )
            );
        }
      });
    }
  }, []);

  const applyUpdate = () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
    }

    const updateRef = ref(database, "updates/pending");
    remove(updateRef)
      .then(() => {
        console.log("Actualización pendiente eliminada de Firebase.");
        setPendingUpdate(false);
        setUpdateAvailable(false);
      })
      .catch((error) =>
        console.error("Error al eliminar actualización de Firebase:", error)
      );

    window.location.reload();
  };

  const dismissUpdate = () => {
    const updateRef = ref(database, "updates/pending");
    remove(updateRef)
      .then(() => {
        console.log("Actualización pendiente descartada.");
        setPendingUpdate(false);
        setUpdateAvailable(false);
      })
      .catch((error) =>
        console.error("Error al eliminar actualización de Firebase:", error)
      );
  };

  return (
    <UpdateContext.Provider
      value={{
        updateAvailable,
        triggerUpdate: applyUpdate,
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
