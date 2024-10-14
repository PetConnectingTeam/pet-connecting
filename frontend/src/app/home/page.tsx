import React from "react";
import { Box, Container, Paper, Stack } from "@mui/material";

const HomePage: React.FC = () => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: "white",
        padding: 3,
        marginLeft: "240px",
        height: "calc(100vh - 64px)",
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
