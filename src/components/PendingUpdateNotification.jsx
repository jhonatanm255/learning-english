import React, { useEffect, useState } from "react";
import { useUpdate } from "../contexts/UpdateContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { app } from "../components/firebaseConfig";

function PendingUpdateNotification() {
  const { updateAvailable, setUpdateAvailable, setUpdateDecisionMade } =
    useUpdate();
  const [pendingUpdate, setPendingUpdate] = useState(false);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const auth = getAuth(app);
  const db = getDatabase(app);

  // Verifica si hay una actualización pendiente en Realtime Database
  useEffect(() => {
    const checkPendingUpdate = async (user) => {
      if (user) {
        try {
          const dbRef = ref(db, `users/${user.uid}/updates/pendingUpdate`);
          const snapshot = await get(dbRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
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
    setUpdateAvailable(true);
  };

  // Cerrar el modal y resetear el estado de la actualización
  const handleCloseModal = () => {
    setShowModal(false);
    setUpdateDecisionMade(false); // El usuario no ha tomado una decisión
    setPendingUpdate(false); // Aseguramos que el estado de la actualización pendiente se restablezca
  };

  if (!pendingUpdate) return null; // No mostrar nada si no hay actualización pendiente

  return (
    <>
      <div className="mt-2 w-full bg-green-100 text-white p-1 text-center rounded-md">
        <button
          onClick={handleShowModal}
          className="text-green-500"
          aria-label="Abrir actualización pendiente"
        >
          ¡Actualización pendiente!
        </button>
      </div>
    </>
  );
}

export default PendingUpdateNotification;

