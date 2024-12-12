// import { createContext, useContext, useState, useEffect } from "react";

// const UpdateContext = createContext();

// export const UpdateProvider = ({ children }) => {
//   const [updateAvailable, setUpdateAvailable] = useState(false);
//   const [newVersion, setNewVersion] = useState(null); // Para almacenar la nueva versión

//   useEffect(() => {
//     if ("serviceWorker" in navigator) {
//       navigator.serviceWorker.ready.then((registration) => {
//         registration.addEventListener("updatefound", () => {
//           const newWorker = registration.installing;

//           newWorker.addEventListener("statechange", () => {
//             if (
//               newWorker.state === "installed" &&
//               navigator.serviceWorker.controller
//             ) {
//               // Una nueva versión está disponible
//               setUpdateAvailable(true);
//             }
//           });
//         });
//       });

//       navigator.serviceWorker.addEventListener("message", (event) => {
//         if (event.data.type === "UPDATE_READY") {
//           setUpdateAvailable(true);
//           setNewVersion(event.data.newVersion); // Guardamos la nueva versión
//         }
//       });
//     }
//   }, []);

//   // Función para manejar la actualización
//   const triggerUpdate = () => {
//     if (navigator.serviceWorker.controller) {
//       navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
//     }
//     window.location.reload(); // Recarga la página una vez se aplica la actualización
//   };

//   return (
//     <UpdateContext.Provider
//       value={{ updateAvailable, triggerUpdate, newVersion }}
//     >
//       {children}
//     </UpdateContext.Provider>
//   );
// };

// export const useUpdate = () => useContext(UpdateContext);




// import { createContext, useContext, useState, useEffect } from "react";

// const UpdateContext = createContext();

// export const UpdateProvider = ({ children }) => {
//   const [updateAvailable, setUpdateAvailable] = useState(false);
//   const [newVersion, setNewVersion] = useState(null); // Para almacenar la nueva versión
//   const [updateDecisionMade, setUpdateDecisionMade] = useState(false);

//   useEffect(() => {
//     if ("serviceWorker" in navigator) {
//       navigator.serviceWorker.ready.then((registration) => {
//         registration.addEventListener("updatefound", () => {
//           const newWorker = registration.installing;

//           newWorker.addEventListener("statechange", () => {
//             if (
//               newWorker.state === "installed" &&
//               navigator.serviceWorker.controller
//             ) {
//               // Una nueva versión está disponible
//               setUpdateAvailable(true);
//               // Si el usuario no ha tomado una decisión, no se aplica la actualización automáticamente
//               if (!updateDecisionMade) {
//                 // No se aplica la actualización automáticamente
//                 return;
//               }
//             }
//           });
//         });
//       });

//       navigator.serviceWorker.addEventListener("message", (event) => {
//         if (event.data.type === "UPDATE_READY") {
//           setUpdateAvailable(true);
//           setNewVersion(event.data.newVersion); // Guardamos la nueva versión
//         }
//       });
//     }
//   }, [updateDecisionMade]);

//   // Función para manejar la actualización
//   const triggerUpdate = () => {
//     if (navigator.serviceWorker.controller) {
//       navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
//     }
//     window.location.reload(); // Recarga la página una vez se aplica la actualización
//   };

//   return (
//     <UpdateContext.Provider
//       value={{
//         updateAvailable,
//         triggerUpdate,
//         newVersion,
//         setUpdateAvailable,
//         setUpdateDecisionMade,
//       }}
//     >
//       {children}
//     </UpdateContext.Provider>
//   );
// };

// export const useUpdate = () => useContext(UpdateContext);







import React, { createContext, useContext, useState, useEffect } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const UpdateContext = createContext();

export function UpdateProvider({ children }) {
  const [pendingUpdate, setPendingUpdate] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false); // Nueva actualización disponible

  useEffect(() => {
    // Supongamos que la URL de la nueva versión está almacenada en Firebase Storage
    const storage = getStorage();
    const versionRef = ref(storage, "app/version"); // La ruta donde guardas la versión

    getDownloadURL(versionRef)
      .then((url) => {
        // Simulamos la verificación de la versión de la app
        if (url) {
          setUpdateAvailable(true); // Nueva actualización disponible
        }
      })
      .catch((error) => {
        console.error("Error al verificar la actualización:", error);
      });
  }, []);

  return (
    <UpdateContext.Provider
      value={{
        pendingUpdate,
        setPendingUpdate,
        updateAvailable,
        setUpdateAvailable,
      }}
    >
      {children}
    </UpdateContext.Provider>
  );
}

export function useUpdate() {
  return useContext(UpdateContext);
}





// import React, { createContext, useContext, useState, useEffect } from "react";
// import { getStorage, ref, getDownloadURL } from "firebase/storage";

// const UpdateContext = createContext();

// export function UpdateProvider({ children }) {
//   const [pendingUpdate, setPendingUpdate] = useState(false); // Estado para saber si hay una actualización pendiente
//   const [updateAvailable, setUpdateAvailable] = useState(false); // Estado que indica si hay una actualización disponible

//   useEffect(() => {
//     // Aquí se verifica si hay una nueva versión de la app en Firebase Storage
//     const storage = getStorage();
//     const versionRef = ref(storage, "app/version"); // Aquí asumimos que el archivo de versión está en 'app/version'

//     // Tratamos de obtener la URL del archivo que contiene la versión
//     getDownloadURL(versionRef)
//       .then((url) => {
//         // Si conseguimos la URL, podemos asumir que hay una nueva versión
//         if (url) {
//           setUpdateAvailable(true); // Se marca como disponible una nueva actualización
//         }
//       })
//       .catch((error) => {
//         console.error("Error al verificar la actualización:", error); // En caso de error, lo logueamos
//       });
//   }, []); // El efecto solo se ejecuta una vez cuando el componente se monta

//   return (
//     <UpdateContext.Provider
//       value={{
//         pendingUpdate, // Valor que indica si hay una actualización pendiente
//         setPendingUpdate, // Función para actualizar si hay una actualización pendiente
//         updateAvailable, // Valor que indica si hay una actualización disponible
//         setUpdateAvailable, // Función para actualizar si hay una nueva versión disponible
//       }}
//     >
//       {children}
//     </UpdateContext.Provider>
//   );
// }

// // Hook personalizado para consumir el contexto desde cualquier componente
// export function useUpdate() {
//   return useContext(UpdateContext);
// }
