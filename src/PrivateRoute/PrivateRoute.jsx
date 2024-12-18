/* eslint-disable react/prop-types */
import { Navigate } from "react-router";

const PrivateRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;

