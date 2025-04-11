import React from "react";
import { Box, Typography, Container } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build"; // or use ConstructionIcon

const UnderProgress = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Box>
        <BuildIcon sx={{ fontSize: 80, color: "#ff9800", mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Page Under Progress
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We’re working hard to bring this page to life. Please check back soon!
        </Typography>
      </Box>
    </Container>
  );
};

export default UnderProgress;
