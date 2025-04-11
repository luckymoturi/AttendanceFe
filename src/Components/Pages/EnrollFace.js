import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase/firebase";

import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  AppBar,
  Toolbar,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import {
  AccountCircle,
  Camera,
  AddAPhoto,
} from "@mui/icons-material";

function FaceEnrollmentApp() {
  const webcamRef = useRef(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 60000);

    const autoLogout = setTimeout(() => {
      signOut(auth).then(() => {
        toast("Session expired. Logged out.");
        navigate("/login");
      });
    }, 2 * 60 * 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(autoLogout);
    };
  }, [navigate]);

  const captureAndEnroll = async () => {
    if (!name.trim()) {
      toast.error("Please provide a name.");
      return;
    }

    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      toast.error("Unable to capture image. Please check your camera.");
      return;
    }

    setIsLoading(true);
    toast.loading("Processing...", { id: "upload" });

    try {
      const blob = await (await fetch(imageSrc)).blob();
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("photo", file);

      const res = await axios.post(
        `http://localhost:8000/enroll-photo/?name=${encodeURIComponent(name)}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(`Enrollment successful for ${name}!`, { id: "upload" });
    } catch (error) {
      toast.error(
        `Upload failed: ${error.response?.data?.message || error.message}`,
        { id: "upload" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toaster position="top-center" />
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: "#fff", borderBottom: "1px solid #e0e0e0" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 600, color: "#333" }}
          >
            <AccountCircle sx={{ mr: 1, verticalAlign: "middle" }} />
            Face Enrollment System
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {currentTime}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={7}>
            <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
              <CardContent sx={{ p: 0 }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <Typography variant="h6">
                    <Camera
                      sx={{ mr: 1, verticalAlign: "middle", fontSize: 20 }}
                    />
                    Face Enrollment
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "350px",
                      borderRadius: 1,
                      overflow: "hidden",
                      mb: 2,
                      border: "1px solid #e0e0e0",
                      position: "relative",
                    }}
                  >
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      videoConstraints={{ facingMode: "user" }}
                    />
                    {isLoading && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        <CircularProgress size={60} />
                      </Box>
                    )}
                  </Box>

                  <TextField
                    fullWidth
                    label="Enter your name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 3 }}
                  />

                  <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={captureAndEnroll}
                        disabled={isLoading}
                        startIcon={<AddAPhoto />}
                        sx={{
                          py: 1.5,
                          bgcolor: "#6a1b9a",
                          "&:hover": { bgcolor: "#4a148c" },
                          textTransform: "none",
                        }}
                      >
                        {isLoading ? "Processing..." : "Enroll"}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default FaceEnrollmentApp;
