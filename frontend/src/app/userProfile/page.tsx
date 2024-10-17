"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
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
import axios from "axios";
import MenuAppBar from "../components/appBar";

export default function UserProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("petOwner");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const accessToken = Cookies.get("accessToken");
  const userId = Cookies.get("user_id");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5001/users?id=${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const userData = response.data[0];
        setName(userData.name);
        setEmail(userData.email);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        setErrorMessage(error.response?.data || error.message);
      }
    };

    fetchUserData();
  }, [userId, accessToken]);

  const handleSaveChanges = async () => {
   
    try {
      
      const userId = Cookies.get("user_id");
          
      const response = await axios.put(`http://127.0.0.1:5001/user?id=${userId}`, {
        name,
        email,
      });

      if (response.status === 200) {
        alert("Profile updated successfully!");
        setIsEditing(false);
      } else {
        alert("Failed to update profile.");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorMessage(error.response?.data || error.message);
    }
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <MenuAppBar />
        <Container maxWidth={false} sx={{ backgroundColor: "white", height: "100vh" }}>
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
              <Avatar src="/placeholder.svg?height=200&width=200" sx={{ width: 200, height: 200, mb: 2 }} />
              {isEditing && (
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
              )}
            </Box>
            <Box sx={{ flexGrow: 1, paddingTop: 10 }}>
              <form>
                <TextField
                  fullWidth
                  label="Name"
                  id="Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  margin="normal"
                  InputProps={{
                    readOnly: !isEditing,
                    style: { color: "black" },
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  id="Email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  InputProps={{
                    readOnly: !isEditing,
                    style: { color: "black" },
                  }}
                />
                <FormControl component="fieldset" margin="normal">
                  <FormLabel component="legend">User Type</FormLabel>
                  <RadioGroup
                    value={userType}
                    name="userType"
                    onChange={(e) => setUserType(e.target.value)}
                    sx={{ color: "black" }}
                  >
                    <FormControlLabel
                      value="petOwner"
                      control={<Radio />}
                      label="Pet Owner"
                      disabled={!isEditing}
                    />
                    <FormControlLabel
                      value="veterinarian"
                      control={<Radio />}
                      label="Veterinarian"
                      disabled={!isEditing}
                    />
                  </RadioGroup>
                </FormControl>
                {errorMessage && <Box sx={{ color: "red", mt: 2 }}>{errorMessage}</Box>}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
                  {!isEditing ? (
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Button
                      sx={{
                        backgroundColor: "#ff4d4f",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#ff7875",
                        },
                      }}
                      variant="contained"
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </Button>
                  )}
                </Box>
              </form>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}