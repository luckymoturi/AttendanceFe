import React, { useState } from "react";
import { TextField, Button, Container, Paper, Box, Tab, Tabs, Snackbar, Alert, Typography, MenuItem } from "@mui/material";
import { auth, db } from "../Firebase/firebase";
import { sendSignInLinkToEmail } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';

const branches = ["CSE", "ECE", "ME", "Civil"];

export default function AuthPage() {
  const [tab, setTab] = useState(0); // 0 for Register, 1 for Sign In
  const [formData, setFormData] = useState({ name: "", email: "", branch: "" });
  const [message, setMessage] = useState({ text: "", severity: "success" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  // Register & Send Email Link
  const handleRegister = async () => {
    try {
      await addDoc(collection(db, "users"), {
        name: formData.name,
        email: formData.email,
        branch: formData.branch,
      });

      await sendSignInLinkToEmail(auth, formData.email, {
        url: "http://localhost:3000/home", // Adjust based on deployment
        handleCodeInApp: true,
      });

      setMessage({ text: "Verification link sent to email!", severity: "success" });
      setOpenSnackbar(true);
    } catch (error) {
      setMessage({ text: error.message, severity: "error" });
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundImage: 'url(/path-to-your-image.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Paper elevation={6} sx={{ p: 4, mt: 5, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Typography variant="h4" align="center" gutterBottom>
          {tab === 1 ? "Sign Up" : "Login"}
        </Typography>
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} variant="fullWidth" sx={{ mb: 3 }}>
          <Tab label="Login" icon={<AccountCircleIcon />} />
          <Tab label="Sign Up" icon={<EmailIcon />} />
        </Tabs>

        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
          {tab === 1 && (
            <TextField label="Name" fullWidth required
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              InputProps={{
                startAdornment: <AccountCircleIcon position="start" />,
              }}
            />
          )}

          <TextField label="Email" fullWidth required type="email"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            InputProps={{
              startAdornment: <EmailIcon position="start" />,
            }}
          />

          {tab === 1 && (
            <TextField select label="Branch" fullWidth required
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              InputProps={{
                startAdornment: <SchoolIcon position="start" />,
              }}
            >
              {branches.map((branch) => (
                <MenuItem key={branch} value={branch}>{branch}</MenuItem>
              ))}
            </TextField>
          )}

          <Button variant="contained" fullWidth sx={{ mt: 2, py: 1, backgroundColor: '#007BFF', '&:hover': { backgroundColor: '#0056b3' } }}
            onClick={tab === 1 ? handleRegister : () => navigate("/home")}
          >
            {tab === 1 ? "Sign Up" : "Login"}
          </Button>
        </Box>
      </Paper>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={message.severity} onClose={() => setOpenSnackbar(false)}>
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
}
