import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import toast from "react-hot-toast";
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
} from "@mui/material";
import {
  AccountCircle,
  CheckCircle,
  CancelOutlined,
  AccessTime,
  Camera,
} from "@mui/icons-material";

function FaceRecognitionApp() {
  const webcamRef = useRef(null);
  const [processing, setProcessing] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      toast.error("Error capturing image. Please try again.");
      return null;
    }
    const blob = await (await fetch(imageSrc)).blob();
    return new File([blob], "photo.jpg", { type: "image/jpeg" });
  };

  const sendRequest = async (endpoint, actionType) => {
    setProcessing(true);

    try {
      const file = await handleCapture();
      if (!file) {
        setProcessing(false);
        return;
      }

      const formData = new FormData();
      formData.append("photo", file);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          formData.append("latitude", latitude);
          formData.append("longitude", longitude);

          try {
            const res = await axios.post(endpoint, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            const { success, message } = res.data;

            if (success) {
              toast.success(message || `${actionType} successful`);
              setLastAction({
                type: actionType,
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
                success: true,
              });
            } else {
              toast.error(message || "Verification failed.");
              setLastAction({
                type: actionType,
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString(),
                success: false,
              });
            }
          } catch (error) {
            const serverMessage = error.response?.data?.message;
            toast.error(serverMessage || "Request failed. Please try again.");
            setLastAction({
              type: actionType,
              time: new Date().toLocaleTimeString(),
              date: new Date().toLocaleDateString(),
              success: false,
              error: serverMessage || "Connection error",
            });
          }
          setProcessing(false);
        },
        (error) => {
          toast.error("Could not get location. Please enable GPS.");
          setProcessing(false);
          setLastAction({
            type: actionType,
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString(),
            success: false,
            error: "Location services required",
          });
        }
      );
    } catch (err) {
      toast.error("Failed to process image. Please try again.");
      setProcessing(false);
    }
  };

  const checkIn = () => {
    sendRequest("http://localhost:8000/process-checkin", "Check-In");
  };

  const checkOut = () => {
    sendRequest("http://localhost:8000/process-checkout", "Check-Out");
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
            Attendance Management System
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <AccessTime
              sx={{ mr: 0.5, verticalAlign: "middle", fontSize: 16 }}
            />
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
                    Face Recognition
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
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
                    {processing && (
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
                  <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    sx={{ mt: 1 }}
                  >
                    <Grid item xs={12} sm={5} md={4}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={checkIn}
                        disabled={processing}
                        startIcon={<CheckCircle />}
                        sx={{
                          py: 1.5,
                          bgcolor: "#2e7d32",
                          "&:hover": { bgcolor: "#1b5e20" },
                          textTransform: "none",
                        }}
                      >
                        Check-In
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={5} md={4}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={checkOut}
                        disabled={processing}
                        startIcon={<CancelOutlined />}
                        sx={{
                          py: 1.5,
                          bgcolor: "#0277bd",
                          "&:hover": { bgcolor: "#01579b" },
                          textTransform: "none",
                        }}
                      >
                        Check-Out
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

export default FaceRecognitionApp;
