import React from "react";
import { Button } from "@mui/material";
import { auth } from "./Firebase/firebase";
import { signOut } from "firebase/auth";

export default function Logout() {
  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out successfully!");
  };

  return <Button variant="contained" color="secondary" onClick={handleLogout}>Logout</Button>;
}
