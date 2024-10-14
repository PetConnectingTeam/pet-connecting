"use client";
import React from "react";
import {
  Avatar,
  Button,
  Container,
  TextField,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CssBaseline,
} from "@mui/material";

import MenuAppBar from "../components/appBar";

interface UserProfileProps {
  username: string;
  bio: string;
  email: string;
  profilePhoto: string;
  petPhotos: string[];
  reviews: { rating: number; comment: string }[];
}

const UserProfile: React.FC<UserProfileProps> = () => {
  return (
    <>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <MenuAppBar />
        <Container
          maxWidth={false}
          sx={{ backgroundColor: "white", height: "100vh" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "flex-start",
              gap: 4,
              backgroundColor: "white",
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: { xs: "100%", md: "200px" },
                paddingTop: 10,
              }}
            >
              <Avatar
                src="/placeholder.svg?height=200&width=200"
                sx={{ width: 200, height: 200, mb: 2 }}
              />
              <Button
                sx={{
                  backgroundColor: "#ff4d4f",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#ff7875",
                  },
                }}
                variant="contained"
              >
                Change Picture
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, paddingTop: 10 }}>
              <form>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  defaultValue="Alex Johnson"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  defaultValue="alex.johnson@example.com"
                  margin="normal"
                />
                <FormControl component="fieldset" margin="normal">
                  <FormLabel component="legend">User Type</FormLabel>
                  <RadioGroup defaultValue="petOwner" name="userType">
                    <FormControlLabel
                      value="petOwner"
                      control={<Radio />}
                      label="Pet Owner"
                    />
                    <FormControlLabel
                      value="veterinarian"
                      control={<Radio />}
                      label="Veterinarian"
                    />
                  </RadioGroup>
                </FormControl>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
                    gap: 2,
                  }}
                >
                  <Button variant="outlined">Edit Profile</Button>
                  <Button
                    sx={{
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#ff7875",
                      },
                    }}
                    variant="contained"
                  >
                    Save Changes
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default UserProfile;
