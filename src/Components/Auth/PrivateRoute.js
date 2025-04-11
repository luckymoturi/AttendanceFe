import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../Firebase/firebase";

export default function PrivateRoute({ children }) {
  return auth.currentUser ? children : <Navigate to="/login" />;
}
