import { createContext, useContext, useState, useEffect } from "react";

const UpdateContext = createContext();

export const UpdateProvider = ({ children }) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

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
              // Una nueva versión está disponible
              setUpdateAvailable(true);
            }
          });
        });
      });

      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data.type === "UPDATE_READY") {
          setUpdateAvailable(true);
        }
      });
    }
  }, []);

  const triggerUpdate = () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
    }
    window.location.reload();
  };

  return (
    <UpdateContext.Provider value={{ updateAvailable, triggerUpdate }}>
      {children}
    </UpdateContext.Provider>
  );
};

export const useUpdate = () => useContext(UpdateContext);

