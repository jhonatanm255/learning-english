import { createContext, useContext, useState, useEffect } from "react";
import { database } from "../components/firebaseConfig"; // Importa la configuración de Firebase
import { ref, set, remove, get } from "firebase/database"; // Métodos de Firebase
import Swal from "sweetalert2"; // Importa SweetAlert2
import { BsWindowSidebar } from "react-icons/bs";

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

    // Recargar la página para aplicar la nueva versión
    window.location.reload();

    // Mostrar alerta de que la app fue actualizada
    setTimeout(() => {
      Swal.fire({
        title: "¡Actualización exitosa!",
        text: "La nueva versión de la app ya está lista para usarse.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    }, 1500); // Tiempo de espera para asegurar que la página se recargue
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

//   const applyUpdate = () => {
//     if (navigator.serviceWorker.controller) {
//       navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
//     }

//     // Eliminar la actualización pendiente en Firebase
//     const updateRef = ref(database, "updates/pending");
//     remove(updateRef)
//       .then(() => {
//         console.log("Actualización pendiente eliminada de Firebase.");
//         setPendingUpdate(false);
//         setUpdateAvailable(false);

//         // Recargar la página después de activar el nuevo Service Worker
//         navigator.serviceWorker.ready.then((registration) => {
//           if (registration.waiting) {
//             registration.waiting.postMessage({ type: "SKIP_WAITING" });
//           }

//           registration.update().then(() => {
//             console.log("Recargando la app para aplicar la actualización...");
//              Swal.fire({
//                title: "Actualizando!",
//                text: "La aplicación se reiniciará para aplicar la nueva actualización!",
//                icon: "success",
//                timer: 1000,
//              });
//             setTimeout(() => {
//               window.location.reload();
//             }, 1000);
//           });
//         });
//       })
//       .catch((error) =>
//         console.error("Error al eliminar actualización de Firebase:", error)
//       );
//   };

//   const dismissUpdate = () => {
//     // Eliminar la actualización pendiente sin aplicar la actualización
//     const updateRef = ref(database, "updates/pending");
//     remove(updateRef)
//       .then(() => {
//         console.log("Actualización pendiente descartada.");
//         setPendingUpdate(false);
//         setUpdateAvailable(false);
//       })
//       .catch((error) => console.error("Error al eliminar de Firebase:", error));
//   };

//   return (
//     <UpdateContext.Provider
//       value={{
//         updateAvailable,
//         applyUpdate,
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
