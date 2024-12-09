// import { createContext, useContext, useState, useEffect } from "react";

// const UpdateContext = createContext();

// export const UpdateProvider = ({ children }) => {
//   const [updateAvailable, setUpdateAvailable] = useState(false);

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
//         }
//       });
//     }
//   }, []);

//   const triggerUpdate = () => {
//     if (navigator.serviceWorker.controller) {
//       navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
//     }
//     window.location.reload();
//   };

//   return (
//     <UpdateContext.Provider value={{ updateAvailable, triggerUpdate }}>
//       {children}
//     </UpdateContext.Provider>
//   );
// };

// export const useUpdate = () => useContext(UpdateContext);


import React, { createContext, useContext, useState, useEffect } from "react";

export const UpdateContext = createContext();

export const UpdateProvider = ({ children }) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [newVersion, setNewVersion] = useState(""); // Para almacenar la nueva versión

  useEffect(() => {
    const handleUpdateReady = (event) => {
      if (event.data && event.data.type === "UPDATE_READY") {
        // Aquí se obtiene la nueva versión desde el manifest
        fetch("/manifest.webmanifest")
          .then((res) => res.json())
          .then((manifest) => {
            setNewVersion(manifest.version); // Asignar la nueva versión
            setUpdateAvailable(true); // Hacer visible el modal de notificación
          });
      }
    };

    navigator.serviceWorker.addEventListener("message", handleUpdateReady);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleUpdateReady);
    };
  }, []);

  const updateApp = () => {
    // Al actualizar, le decimos al service worker que se salte la espera
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
    }
  };

  const dismissUpdate = () => {
    setUpdateAvailable(false); // Cerrar el modal si el usuario no quiere actualizar
  };

  return (
    <UpdateContext.Provider
      value={{ updateAvailable, newVersion, updateApp, dismissUpdate }}
    >
      {children}
    </UpdateContext.Provider>
  );
};

export const useUpdate = () => useContext(UpdateContext);

