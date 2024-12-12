// import React, { useState, useEffect, useRef } from "react";
// import { getAuth, signOut } from "firebase/auth";
// import logolight from "../assets/logo-ingles-light.png";
// import { useNavigate } from "react-router-dom";

// function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const menuRef = useRef(null);
//   const buttonRef = useRef(null);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   // Cerrar menú si se hace clic fuera de él o en el botón de menú
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         menuRef.current &&
//         !menuRef.current.contains(event.target) &&
//         buttonRef.current &&
//         !buttonRef.current.contains(event.target)
//       ) {
//         setIsMenuOpen(false);||qss
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // FUNCION PARA CERRAR SESION
//   const handleSignOut = async () => {
//     const auth = getAuth();
//     try {
//       await signOut(auth);
//       console.log("Sesión cerrada exitosamente");
//       navigate("/login");
//     } catch (error) {
//       console.error("Error al cerrar sesión:", error);
//     }
//   };

//   return (
//     <>
//       {/* NAVBAR */}
//       <div className="bg-white relative z-50 p-4 flex justify-between items-center shadow-md">
//         <img className="w-12" src={logolight} alt="logo-app" />

//         <h1 className="text-xl font-semibold text-slate-700">
//           Learning English
//         </h1>

//         <div className="flex items-center gap-4 text-slate-700">
//           <i
//             ref={buttonRef}
//             onClick={toggleMenu}
//             className={`text-4xl bx ${isMenuOpen ? "bx-x" : "bx-menu"}`}
//           ></i>
//         </div>
//       </div>

//       {/* DROPDOWN MENU */}
//       <div
//         ref={menuRef}
//         className={`absolute z-40 w-screen bg-blue-50 transition-transform duration-300 ease-in-out transform shadow-md ${
//           isMenuOpen ? "translate-y-20" : "-translate-y-[150%]"
//         }`}
//       >
//         <ul className="flex flex-col justify-center items-center gap-4 py-8">
//           <li
//             onClick={toggleMenu}
//             className="text-lg text-slate-700 cursor-pointer"
//           >
//             Home
//           </li>
//           <li
//             onClick={toggleMenu}
//             className="text-lg text-slate-700 cursor-pointer"
//           >
//             Task
//           </li>
//           <li
//             onClick={toggleMenu}
//             className="text-lg text-slate-700 cursor-pointer"
//           >
//             Learning
//           </li>
//           <li
//             onClick={toggleMenu}
//             className="text-lg text-slate-700 cursor-pointer"
//           >
//             Chatbox
//           </li>

//           <li
//             className="text-lg text-red-600 cursor-pointer"
//             onClick={() => {
//               toggleMenu();
//               handleSignOut();
//             }}
//           >
//             Logout
//           </li>
//         </ul>
//       </div>
//     </>
//   );
// }

// export default Navbar;





import React, { useState, useEffect, useRef } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "./AuthContext"; // Importar el contexto de autenticación
import logolight from "../assets/logo-ingles-light.png";
import { useNavigate } from "react-router-dom";
import PendingUpdateNotification from "./PendingUpdateNotification"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth(); // Obtener el usuario autenticado del contexto
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Cerrar menú si se hace clic fuera de él o en el botón de menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // FUNCION PARA CERRAR SESION
  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("Sesión cerrada exitosamente");
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      <div className="relative bg-white z-50 p-4 flex justify-between items-center shadow-md">
        <img className="w-12" src={logolight} alt="logo-app" />
        {/* CONTENEDOR DEL NOMBRE - CENTRADO */}
        <h1 className="text-xl absolute left-1/2 transform -translate-x-1/2 font-semibold text-slate-700">
          Learning English
        </h1>
        {user && (
          <div className="flex items-center gap-4 text-slate-700">
            {/* BOTÓN DE MENÚ: Visible solo en pantallas pequeñas */}
            <i
              ref={buttonRef}
              onClick={toggleMenu}
              className={`text-4xl bx ${
                isMenuOpen ? "bx-x" : "bx-menu"
              } lg:hidden`}
            ></i>
          </div>
        )}
        {/* MENÚ HORIZONTAL: Visible en pantallas medianas o mayores */}
        {user && (
          <ul className="hidden lg:flex gap-4 items-center">
            <li
              className="text-md text-slate-700 cursor-pointer"
              onClick={() => navigate("/home")}
            >
              Home
            </li>
            <li
              className="text-md text-slate-700 cursor-pointer"
              onClick={() => navigate("/task")}
            >
              Task
            </li>
            <li
              className="text-md text-slate-700 cursor-pointer"
              onClick={() => navigate("/learning")}
            >
              Learning
            </li>
            <li
              className="text-md text-slate-700 cursor-pointer"
              onClick={() => navigate("/chatbox")}
            >
              Chatbox
            </li>
            <li
              className="text-md text-red-600 cursor-pointer"
              onClick={handleSignOut}
            >
              Logout
            </li>
          </ul>
        )}

        {/* MENÚ DESPLEGABLE: Visible solo en pantallas pequeñas */}
        {user && (
          <div
            ref={menuRef}
            className={`absolute -z-10 -ml-4 w-full h-[90vh] bg-slate-100 transition-transform duration-300 ease-in-out transform shadow-md ${
              isMenuOpen ? "translate-x-0" : "-translate-x-[150%]"
            }`}
            style={{ top: "100%" }} // Ajustar la posición para que salga debajo del navbar
          >
            <div className="flex flex-col justify-between gap-96">
              <ul className="flex flex-col justify-center items-center gap-4 py-8">
                <li
                  onClick={() => {
                    toggleMenu();
                    navigate("/home");
                  }}
                  className="text-lg text-slate-700 cursor-pointer"
                >
                  Home
                </li>
                <li
                  onClick={() => {
                    toggleMenu();
                    navigate("/task");
                  }}
                  className="text-lg text-slate-700 cursor-pointer"
                >
                  Task
                </li>
                <li
                  onClick={() => {
                    toggleMenu();
                    navigate("/learning");
                  }}
                  className="text-lg text-slate-700 cursor-pointer"
                >
                  Learning
                </li>
                <li
                  onClick={() => {
                    toggleMenu();
                    navigate("/chatbox");
                  }}
                  className="text-lg text-slate-700 cursor-pointer"
                >
                  Chatbox
                </li>
                <li
                  className="text-lg text-red-600 cursor-pointer"
                  onClick={() => {
                    toggleMenu();
                    handleSignOut();
                  }}
                >
                  Logout
                </li>
              </ul>

              {/* SOCIAL NETWORK */}
              <div>
                <div>
                  <ul>
                    <li className="flex justify-center gap-4 text-3xl text-gray-500">
                      <a href="#">
                        <i class="bx bxl-facebook-circle"></i>
                      </a>
                      <a href="https://www.linkedin.com/in/jhonatan-mu%C3%B1oz-1aa8bb28b/">
                        <i class="bx bxl-linkedin"></i>
                      </a>
                      <a href="https://github.com/jhonatanm255 ">
                        <i class="bx bxl-github"></i>
                      </a>
                    </li>
                  </ul>
                </div>

                <p className="text-center mt-4 text-gray-400 text-md">
                  Versión: <strong>{__APP_VERSION__}</strong>
                </p>
                <PendingUpdateNotification />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;
