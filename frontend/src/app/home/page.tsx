import React from "react";
import { Box, Container, Paper, Stack } from "@mui/material";

const HomePage: React.FC = () => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1, // Se expande para ocupar todo el espacio restante
        bgcolor: "white", // Fondo blanco
        padding: 3, // Padding para dar espacio interno
        marginLeft: "240px", // Ajusta el espacio a la izquierda para el Sidebar
        height: "calc(100vh - 64px)", // Ajusta la altura para que respete el espacio ocupado por el AppBar
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          height: "100%",
        }}
      >
        <Stack
          spacing={5}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 1,
              width: 700,
              height: 300,
            },
          }}
        >
          <Paper elevation={1} />
          <Paper elevation={1} />
        </Stack>
      </Container>
    </Box>
  );
};

export default HomePage;
