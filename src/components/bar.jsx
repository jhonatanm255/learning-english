import React, { useState, useEffect } from "react";
import { auth } from "./firebaseConfig"; 

function Bar() {
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setProfilePicture(user.photoURL);
      } else {
        setProfilePicture(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <ul className="flex items-center justify-between p-4 bg-white shadow-top">
        <li>
          <i className="hover:bg-gray-300 p-1 px-2 rounded text-2xl text-slate-700 bx bx-home"></i>
        </li>
        <li>
          <i className="hover:bg-gray-300 p-1 px-2 rounded text-2xl text-slate-700 bx bx-objects-vertical-bottom"></i>
        </li>
        <li>
          <i className="hover:bg-gray-300 p-1 px-2 rounded text-2xl text-slate-700 bx bx-book-bookmark"></i>
        </li>
        <li>
          {/* Muestra la imagen de perfil si está disponible, si no, muestra el ícono de usuario */}
          {profilePicture ? (
            <img
              className="w-8 h-8 rounded-full ml-2"
              src={profilePicture}
              alt="Profile"
            />
          ) : (
            <i className="hover:bg-gray-300 p-1 px-2 rounded text-2xl text-slate-700 bx bx-user"></i>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Bar;
