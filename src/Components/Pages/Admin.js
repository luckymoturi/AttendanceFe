import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Snackbar,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Button,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function formatDateTime(datetime) {
  if (!datetime) return "—";
  const date = new Date(datetime);
  return date.toLocaleString(); // Format as per local settings
}

function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState("");
  const [editing, setEditing] = useState(null);
  const isMounted = useRef(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/getall");
      if (isMounted.current) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      if (isMounted.current) {
        setMessage("Error fetching users. Please try again.");
        setOpen(true);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const deleteUser = async (name) => {
    setDeleting(name);
    try {
      const response = await axios.delete(
        `http://localhost:8000/delete-user/${name}`
      );
      if (response.data.status === "success") {
        setMessage(`User '${name}' deleted successfully.`);
        await fetchUsers(); // Refresh list
      } else {
        setMessage(`Error deleting user: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("Error deleting user. Please try again.");
    } finally {
      setOpen(true);
      setDeleting("");
    }
  };

  const editUser = (user) => {
    setEditing(user);
  };

  const saveUser = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/update-user/${editing.name}`,
        editing
      );
      if (response.data.status === "success") {
        setMessage(`User '${editing.name}' updated successfully.`);
        await fetchUsers(); // Refresh list
      } else {
        setMessage(`Error updating user: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setMessage("Error updating user. Please try again.");
    } finally {
      setOpen(true);
      setEditing(null);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchUsers();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Table sx={{ borderCollapse: "collapse", width: "105%", mr: 6 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>S.No</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Check-In</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Check-Out</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow
                key={index}
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell
                  sx={{
                    color: user.latest_checkin &&
                      new Date(user.latest_checkin).getHours() >= 9
                      ? "red"
                      : "inherit",
                    fontWeight: user.latest_checkin &&
                      new Date(user.latest_checkin).getHours() >= 9
                      ? "bold"
                      : "normal",
                  }}
                >
                  {formatDateTime(user.latest_checkin)}
                </TableCell>
                <TableCell>{formatDateTime(user.latest_checkout)}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => navigate(`/attendance/${user.name}`)}
                  >
                    View Report
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => editUser(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => deleteUser(user.name)}
                    disabled={deleting === user.name}
                  >
                    {deleting === user.name ? "Deleting..." : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>

      <Dialog open={!!editing} onClose={() => setEditing(null)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={editing?.name || ""}
            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={editing?.email || ""}
            onChange={(e) => setEditing({ ...editing, email: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Role"
            value={editing?.role || ""}
            onChange={(e) => setEditing({ ...editing, role: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Cancel</Button>
          <Button onClick={saveUser} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Admin;
