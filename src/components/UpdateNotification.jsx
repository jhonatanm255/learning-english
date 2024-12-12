import React from "react";
import { useUpdate } from "../contexts/UpdateContext";

function UpdateNotification() {
  const { updateAvailable, triggerUpdate, newVersion, setUpdateAvailable } = useUpdate(); // Accede al estado de la actualización y la nueva versión

  // Si no hay actualización disponible, no se muestra nada
  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4 text-center">
      <div className="flex gap-2 justify-center">
        <h2 className="font-semibold text-lg text-gray-200">
          ¡Nueva versión disponible!
        </h2>
        {/* Muestra la nueva versión en lugar de la versión actual */}
        <p className="text-center text-gray-100 text-lg">
          <strong>{newVersion}</strong>
        </p>
      </div>

      <p className="text-gray-300">
        Hay una nueva actualización disponible. ¿Quieres actualizar ahora?
      </p>
      <div className="mt-2">
        <button
          onClick={triggerUpdate} // Al hacer clic en "Actualizar ahora", ejecuta la función para actualizar
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
        >
          Actualizar ahora
        </button>
        <button
          onClick={() => setUpdateAvailable(false)} // Recarga la página sin aplicar la actualización
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Más tarde
        </button>
      </div>
    </div>
  );
}

export default UpdateNotification;


// import React from "react";
// import { useUpdate } from "../contexts/UpdateContext";

// function UpdateNotification() {
//   const { updateAvailable, triggerUpdate, newVersion, setUpdateAvailable } =
//     useUpdate();

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
//           onClick={triggerUpdate}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
//         >
//           Actualizar ahora
//         </button>
//         <button
//           onClick={() => setUpdateAvailable(false)}
//           className="bg-gray-500 text-white px-4 py-2 rounded-md"
//         >
//           Más tarde
//         </button>
//       </div>
//     </div>
//   );
// }

// export default UpdateNotification;