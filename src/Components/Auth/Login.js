import React, { useState } from "react";
import { TextField, Button, Container, Typography, Paper, CircularProgress, Alert, Box, Avatar, CssBaseline } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { auth } from "../Firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      alert("Login Successful!");
      navigate("/enroll");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" sx={{ mt: 20 }}>
        <CssBaseline />
        <Paper elevation={6} sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center", borderRadius: 2 }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleLogin}
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
