
import React from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Typography,
} from "@mui/material";

interface PetProfileProps {
  petName: string;
  petType: string;
  petAge: number;
  petDescription: string;
  petImage: string;
}

const PetProfile: React.FC<PetProfileProps> = ({
  petName,
  petType,
  petAge,
  petDescription,
  petImage,
}) => {
  return (
    <Grid
      container
      component="main"
      sx={{ height: "100vh", backgroundColor: "white" }}
    >
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 8,
            p: 2,
            borderRadius: 2,
            boxShadow: 2,
            backgroundColor: "white",
          }}
        >
          <Avatar
            src={petImage}
            alt={petName}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography component="h1" variant="h4" color="textPrimary">
            {petName}
          </Typography>
          <Typography variant="h6" color="textPrimary">
            {petType} - {petAge} years old
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }} color="textPrimary">
            {petDescription}
          </Typography>
          <Box sx={{ mt: 3, mb: 2 }}>
            <Button variant="contained" color="primary" sx={{ mr: 1 }}>
              Edit Profile
            </Button>
            <Button variant="outlined" color="secondary">
              Delete Pet
            </Button>
          </Box>
        </Box>
      </Container>
    </Grid>
  );
};

export default PetProfile;
