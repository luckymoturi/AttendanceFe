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
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

function formatDateTime(datetime) {
  if (!datetime) return "—";
  const date = new Date(datetime);
  return date.toLocaleString(); // Format as per local settings
}

 // Set deadline for check-in (9:10 AM)
 const getCheckInStatus = (checkInTime) => {
  if (!checkInTime) return { color: "inherit", fontWeight: "normal" };
  
  const checkIn = new Date(checkInTime);
  const deadline = new Date(checkIn);
  deadline.setHours(9, 10, 0, 0); // 9:10 AM
  
  return {
    color: checkIn > deadline ? "red" : "inherit",
    fontWeight: checkIn > deadline ? "bold" : "normal",
  };
};


function UserDetails() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container sx={{ mt: 4, width: '100%', maxWidth: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        <TextField
          placeholder="Search Users"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ shrink: false }}
          sx={{
            width: 200,
            "& .MuiOutlinedInput-root": {
              borderRadius: "5px",
              backgroundColor: "#f9f9f9",
            },
            "& .MuiOutlinedInput-input": {
              paddingY: "8px",
            },
          }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Table sx={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: "10%" }}>S.No</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "30%" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "25%" }}>Check-In</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "25%" }}>Check-Out</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "10%" }} align="center">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow
                key={index}
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell sx={getCheckInStatus(user.latest_checkin)}>
  {formatDateTime(user.latest_checkin)}
</TableCell>
                <TableCell>{formatDateTime(user.latest_checkout)}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => navigate(`/attendance/${user.name}`)}
                  >
                    View Report
                  </Button>
                  {/* <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => deleteUser(user.name)}
                    disabled={deleting === user.name}
                  >
                    {deleting === user.name ? "Deleting..." : "Delete"}
                  </Button> */}
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
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
    </Container>
  );
}

export default UserDetails;
