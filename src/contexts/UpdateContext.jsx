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









import { createContext, useContext, useState, useEffect } from "react";
import { database, ref, set, get, child } from "../components/firebaseConfig"; // Importar las funciones de Firebase Realtime Database

const UpdateContext = createContext();

export const UpdateProvider = ({ children }) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [newVersion, setNewVersion] = useState(null); // Para almacenar la nueva versión
  const [updateDecisionMade, setUpdateDecisionMade] = useState(false);

  useEffect(() => {
    const checkPendingUpdate = async () => {
      try {
        const userId = "USER_ID"; // Obtén el ID del usuario, si es necesario
        const dbRef = ref(database, "pendingUpdates/" + userId);
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
          const pendingUpdate = snapshot.val();
          if (pendingUpdate) {
            setUpdateAvailable(true);
            setNewVersion(pendingUpdate.version);
          }
        }
      } catch (error) {
        console.error("Error fetching update info:", error);
      }
    };

    checkPendingUpdate();
  }, [updateDecisionMade]);

  // Función para guardar la elección del usuario en Firebase
  const saveUpdateDecision = async (status) => {
    try {
      const userId = "USER_ID"; // Obtén el ID del usuario
      const dbRef = ref(database, "pendingUpdates/" + userId);
      await set(dbRef, { updatePending: status, version: newVersion });
    } catch (error) {
      console.error("Error saving update decision:", error);
    }
  };

  // Función para manejar la actualización
  const triggerUpdate = () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
    }
    window.location.reload(); // Recarga la página una vez se aplica la actualización
  };

  return (
    <UpdateContext.Provider
      value={{
        updateAvailable,
        triggerUpdate,
        newVersion,
        setUpdateAvailable,
        setUpdateDecisionMade,
        saveUpdateDecision,
      }}
    >
      {children}
    </UpdateContext.Provider>
  );
};

export const useUpdate = () => useContext(UpdateContext);

