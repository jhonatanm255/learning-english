// import React from "react";
// import { useUpdate } from "../contexts/UpdateContext";

// function UpdateNotification() {
//   const { updateAvailable, triggerUpdate, newVersion, setUpdateAvailable } = useUpdate(); // Accede al estado de la actualización y la nueva versión

//   // Si no hay actualización disponible, no se muestra nada
//   if (!updateAvailable) return null;

//   return (
//     <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4 text-center">
//       <div className="flex gap-2 justify-center">
//         <h2 className="font-semibold text-lg text-gray-200">
//           ¡Nueva versión disponible!
//         </h2>
//         {/* Muestra la nueva versión en lugar de la versión actual */}
//         <p className="text-center text-gray-100 text-lg">
//           <strong>{newVersion}</strong>
//         </p>
//       </div>

//       <p className="text-gray-300">
//         Hay una nueva actualización disponible. ¿Quieres actualizar ahora?
//       </p>
//       <div className="mt-2">
//         <button
//           onClick={triggerUpdate} // Al hacer clic en "Actualizar ahora", ejecuta la función para actualizar
//           className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
//         >
//           Actualizar ahora
//         </button>
//         <button
//           onClick={() => setUpdateAvailable(false)} // Recarga la página sin aplicar la actualización
//           className="bg-gray-500 text-white px-4 py-2 rounded-md"
//         >
//           Más tarde
//         </button>
//       </div>
//     </div>
//   );
// }

// export default UpdateNotification;





// import React from "react";
// import { useUpdate } from "../contexts/UpdateContext";

// function UpdateNotification() {
//   const { updateAvailable, triggerUpdate, newVersion, setUpdateAvailable } =
//     useUpdate();

//   if (!updateAvailable) return null; // Si no hay actualizaciones, no renderiza el modal

//   const handleUpdate = () => {
//     triggerUpdate();
//     setUpdateAvailable(false); // Oculta el modal después de actualizar
//   };

//   const handleLater = () => {
//     console.log("Cerrando modal sin actualizar..."); // Debug
//     setUpdateAvailable(false); // Actualiza el estado para ocultar el modal
//     setTimeout(() => {}, 0);
//   };

//   return (
//     <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4 text-center">
//       <div className="flex gap-2 justify-center">
//         <h2 className="font-semibold text-lg text-gray-200">
//           ¡Nueva versión disponible!
//         </h2>
//         <p className="text-center text-gray-100 text-lg">
//           <strong>{newVersion}</strong>
//         </p>
//       </div>

//       <p className="text-gray-300">
//         Hay una nueva actualización disponible. ¿Quieres actualizar ahora?
//       </p>
//       <div className="mt-2">
//         <button
//           onClick={handleUpdate}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
//         >
//           Actualizar ahora
//         </button>
//         <button
//           onClick={handleLater}
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

function UpdateNotification({ onClose }) {
  const {
    updateAvailable,
    triggerUpdate,
    newVersion,
    setUpdateAvailable,
    saveUpdateDecision,
  } = useUpdate();

  if (!updateAvailable) return null;

  const handleUpdate = () => {
    triggerUpdate();
    setUpdateAvailable(false);
    saveUpdateDecision(false); // Guardar la decisión de actualización
  };

  const handleLater = () => {
    setUpdateAvailable(false);
    onClose(); // Cerrar el modal cuando el usuario elige "Más tarde"
    saveUpdateDecision(true); // Guardar que la actualización está pendiente
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4 text-center">
      <div className="flex gap-2 justify-center">
        <h2 className="font-semibold text-lg text-gray-200">
          ¡Nueva versión disponible!
        </h2>
        <p className="text-center text-gray-100 text-lg">
          <strong>{newVersion}</strong>
        </p>
      </div>

      <p className="text-gray-300">
        Hay una nueva actualización disponible. ¿Quieres actualizar ahora?
      </p>
      <div className="mt-2">
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
        >
          Actualizar ahora
        </button>
        <button
          onClick={handleLater}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Más tarde
        </button>
      </div>
    </div>
  );
}

export default UpdateNotification;
