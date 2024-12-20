// import React, { useEffect, useState } from "react";
// import { useUpdate } from "../contexts/UpdateContext";
// import { getAuth } from "firebase/auth";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { app } from "../components/firebaseConfig"; // Asegúrate de importar tu configuración de Firebase
// import UpdateNotification from "./UpdateNotification"; // Importa el modal de actualización

// function PendingUpdateNotification() {
//   const { updateAvailable, setUpdateAvailable, setUpdateDecisionMade } =
//     useUpdate();
//   const [pendingUpdate, setPendingUpdate] = useState(false);
//   const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
//   const auth = getAuth(app);
//   const db = getFirestore(app);

//   // Verifica si hay una actualización pendiente en Firestore
//   useEffect(() => {
//     const checkPendingUpdate = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         const docRef = doc(db, "users", user.uid, "updates", "pendingUpdate");
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setPendingUpdate(data.updateAvailable);
//         }
//       }
//     };

//     if (auth.currentUser) {
//       checkPendingUpdate();
//     }
//   }, [auth.currentUser]);

//   // Función para mostrar el modal
//   const handleShowModal = () => {
//     setShowModal(true);
//     setUpdateAvailable(true); // Indicamos que hay una actualización disponible
//   };

//   // Cerrar el modal y resetear el estado de la actualización
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setUpdateDecisionMade(false); // El usuario no ha tomado una decisión
//   };

//   if (!pendingUpdate) return null; // No mostrar nada si no hay actualización pendiente

//   return (
//     <>
//       <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-white p-4 text-center">
//         <div className="flex gap-2 justify-center">
//           <h2 className="font-semibold text-lg text-gray-200">
//             ¡Actualización pendiente!
//           </h2>
//         </div>

//         <p className="text-gray-300">
//           Hay una actualización pendiente. Haz clic para actualizar cuando lo
//           desees.
//         </p>
//         <div className="mt-2">
//           <button
//             onClick={handleShowModal}
//             className="bg-blue-500 text-white px-4 py-2 rounded-md"
//           >
//             Actualización pendiente
//           </button>
//         </div>
//       </div>

//       {/* Mostrar el modal de actualización si showModal es true */}
//       {showModal && <UpdateNotification onClose={handleCloseModal} />}
//     </>
//   );
// }

// export default PendingUpdateNotification;








import React, { useEffect, useState } from "react";
import { useUpdate } from "../contexts/UpdateContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../components/firebaseConfig"; // Configuración de Firebase
import UpdateNotification from "./UpdateNotification"; // Modal de actualización

function PendingUpdateNotification() {
  const { updateAvailable, setUpdateAvailable, setUpdateDecisionMade } =
    useUpdate();
  const [pendingUpdate, setPendingUpdate] = useState(false);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Verifica si hay una actualización pendiente en Firestore
  useEffect(() => {
    const checkPendingUpdate = async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid, "updates", "pendingUpdate");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setPendingUpdate(data.updateAvailable);
          }
        } catch (error) {
          console.error("Error al obtener actualización pendiente:", error);
        }
      }
    };

    // Listener para cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        checkPendingUpdate(user);
      } else {
        setPendingUpdate(false); // Restablece el estado si el usuario cierra sesión
      }
    });

    return () => unsubscribe(); // Limpia el listener al desmontar
  }, [auth, db]);

  // Función para mostrar el modal
  const handleShowModal = () => {
    setShowModal(true);
    setUpdateAvailable(true); // Indicamos que hay una actualización disponible
  };

  // Cerrar el modal y resetear el estado de la actualización
  const handleCloseModal = () => {
    setShowModal(false);
    setUpdateDecisionMade(false); // El usuario no ha tomado una decisión
  };

  if (!pendingUpdate) return null; // No mostrar nada si no hay actualización pendiente

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-white p-4 text-center">
        <div className="flex gap-2 justify-center">
          <h2 className="font-semibold text-lg text-gray-200">
            ¡Actualización pendiente!
          </h2>
        </div>

        <p className="text-gray-300">
          Hay una actualización pendiente. Haz clic para actualizar cuando lo
          desees.
        </p>
        <div className="mt-2">
          <button
            onClick={handleShowModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            aria-label="Abrir actualización pendiente"
          >
            Actualización pendiente
          </button>
        </div>
      </div>

      {/* Mostrar el modal de actualización si showModal es true */}
      {showModal && <UpdateNotification onClose={handleCloseModal} />}
    </>
  );
}

export default PendingUpdateNotification;
