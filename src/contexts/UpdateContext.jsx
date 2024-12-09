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
  const [newVersion, setNewVersion] = useState(""); // Para almacenar la versión nueva

  useEffect(() => {
    let newWorker;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });

      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener("updatefound", () => {
          newWorker = registration.installing;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // Obtén la nueva versión desde package.json
              fetch("/manifest.json")
                .then((res) => res.json())
                .then((manifest) => {
                  setNewVersion(manifest.version);
                  setUpdateAvailable(true);
                });
            }
          });
        });
      });
    }
  }, []);

  const updateApp = () => {
    if (newWorker) {
      newWorker.postMessage({ type: "SKIP_WAITING" });
    }
  };

  const dismissUpdate = () => {
    setUpdateAvailable(false);
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
