import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";

// Helper to format datetime
const formatDateTime = (datetime) => {
  if (!datetime) return "—";
  return new Date(datetime).toLocaleString();
};

// Helper to check if check-in is after 9:10 AM
const isLateCheckIn = (eventTime) => {
  const time = new Date(eventTime);
  const deadline = new Date(time);
  deadline.setHours(9, 10, 0, 0); // 9:10 AM
  return time > deadline;
};

function UserReport() {
  const { username } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/attendance/${username}`)
      .then((res) => {
        setAttendance(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching attendance:", err);
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Attendance Report for {username}
      </Typography>
      {attendance.length === 0 ? (
        <Typography>No attendance records found.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Check-In</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Check-Out</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>
                  {new Date(entry.event_time).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  {entry.event_type === "checkin" ? (
                    <span
                      style={{
                        color: isLateCheckIn(entry.event_time) ? "red" : "inherit",
                      }}
                    >
                      {formatDateTime(entry.event_time)}
                    </span>
                  ) : (
                    "—"
                  )}
                </TableCell>

                <TableCell>
                  {entry.event_type === "checkout"
                    ? formatDateTime(entry.event_time)
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
}

export default UserReport;
