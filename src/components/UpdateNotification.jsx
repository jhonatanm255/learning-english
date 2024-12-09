// import React from "react";
// import { useUpdate } from "../contexts/UpdateContext"; // Asegúrate de tener la ruta correcta

// function UpdateNotification() {
//   const { updateAvailable, triggerUpdate } = useUpdate(); // Accede al estado de la actualización

//   // Si no hay actualización disponible, no se muestra nada
//   if (!updateAvailable) return null;

//   return (
//     <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4 text-center">
//       <div className="flex gap-2 justify-center">
//         <h2 className="font-semibold text-lg text-gray-200">¡Nueva versión disponible!</h2>
//         <p className="text-center text-gray-100 text-lg">
//           <strong>{__APP_VERSION__}</strong>
//         </p>
//       </div>

//       <p className="text-gray-300">
//         Hay una nueva actualización disponible. ¿Quieres actualizar ahora?
//       </p>
//       <div className="mt-2">
//         <button
//           onClick={triggerUpdate}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
//         >
//           Actualizar ahora
//         </button>
//         <button
//           onClick={() => window.location.reload()} // Recarga la página si el usuario no quiere actualizar
//           className="bg-gray-500 text-white px-4 py-2 rounded-md"
//         >
//           Más tarde
//         </button>
//       </div>
//     </div>
//   );
// }

// export default UpdateNotification;




import React from "react";
import { useUpdate } from "../contexts/UpdateContext";

const UpdateNotification = () => {
  const { updateAvailable, newVersion, updateApp, dismissUpdate } = useUpdate();

  if (!updateAvailable) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-lg font-semibold">Nueva versión disponible</h2>
        <p>Versión actual: {process.env.REACT_APP_VERSION}</p>
        <p>Versión nueva: {newVersion}</p>
        <div className="flex justify-around mt-4">
          <button
            onClick={updateApp}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Actualizar ahora
          </button>
          <button
            onClick={dismissUpdate}
            className="bg-gray-300 text-black px-4 py-2 rounded-md"
          >
            Más tarde
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;
