import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import Logout from "./Components/Dashboard";
import PrivateRoute from "./Components/Auth/PrivateRoute";
import EnrollFace from "./Components/Pages/EnrollFace";
import React from "react";
import FaceRecognitionApp from "./Components/Pages/FaceRecognition";
import UserDetails from "./Components/Pages/UserDetails";
import Sidebar from "./Components/Sidebar/sidebar";
import { Box, Container } from "@mui/material";
import UserReport from "./Components/Pages/UserReport";
import { Toaster } from "react-hot-toast";
import Admin from "./Components/Pages/Admin";
import UnderProgress from "./Components/Pages/UnderProgress";


function App() {
  return (
    <Router>
      <Box display="flex">
        <Sidebar />
        <Container>
          <Toaster position="bottom-center" reverseOrder={false} />

          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
            <Route path="/enroll" element={<PrivateRoute><EnrollFace /></PrivateRoute>} />
            <Route path="/face-recognition" element={<FaceRecognitionApp />} />
            <Route path="/userdetails" element={<UserDetails />} />
            <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
            <Route path="/attendance/:username" element={<UserReport />} />
            <Route path="/UnderProgress" element={<UnderProgress />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
