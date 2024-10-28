// src/components/PrivateRoute.jsx
import { useAuth } from "../components/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ component }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  return user ? component : <Navigate to="/login" />;
};

export default PrivateRoute;
