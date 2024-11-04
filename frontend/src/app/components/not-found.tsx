import React from "react";
import { Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";

const NotFoundPage: React.FC = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        textAlign: "center",
        backgroundColor: "white",
      }}
    >
      <Typography
        variant="h1"
        sx={{ fontSize: "6rem", fontWeight: "bold", color: "primary.main" }}
      >
        404
      </Typography>
      <Typography
        variant="h5"
        sx={{ marginBottom: 2, color: "text.secondary" }}
      >
        Oops! Page not found
      </Typography>
      <Typography
        variant="body1"
        sx={{ marginBottom: 4, color: "text.secondary" }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/home")}
        sx={{
          paddingX: 3,
          paddingY: 1,
          fontSize: "1rem",
        }}
      >
        Go Back to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
