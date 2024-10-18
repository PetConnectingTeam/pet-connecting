"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import MenuAppBar from "../components/appBar";

export default function UserProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("petOwner");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accessToken = Cookies.get("accessToken");
  const userId = Cookies.get("user_id");

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5001/users?id=${userId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const userData = response.data[0];
      setName(userData.name);
      setEmail(userData.email);
      setProfileImageUrl(userData.profile_image_base64 || null);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      setErrorMessage(error.response?.data?.msg || error.message);
    }
  }, [userId, accessToken]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: any = { id: userId, name };

      if (email !== email) {
        payload.email = email;
      }

      const response = await axios.put(
        `http://127.0.0.1:5001/user/1?id=${userId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.status === 200) {
        setIsEditing(false);
        setErrorMessage(null);
        setSuccessMessage("Profile updated successfully");

        if (profilePicture) {
          await handleProfilePictureUpload();
        }

        await fetchUserData();
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorMessage(
        error.response?.data?.msg ||
          error.message ||
          "An error occurred while updating the profile"
      );
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePicture) return;

    const formData = new FormData();
    formData.append("file", profilePicture);

    try {
      const response = await axios.put(
        `http://127.0.0.1:5001/user/3/profile_photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Profile picture updated successfully");
        // Fetch updated user data to get the new profile picture
        await fetchUserData();
      } else {
        throw new Error("Failed to update profile picture");
      }
    } catch (error: any) {
      console.error("Error updating profile picture:", error);
      setErrorMessage(
        error.response?.data?.msg ||
          error.message ||
          "An error occurred while updating the profile picture"
      );
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePicture(event.target.files[0]);
    }
  };

  const handleCloseSnackbar = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

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
                src={
                  profilePicture
                    ? URL.createObjectURL(profilePicture)
                    : profileImageUrl || "/placeholder.svg?height=200&width=200"
                }
                sx={{ width: 200, height: 200, mb: 2 }}
              />
              {isEditing && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
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
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Picture
                  </Button>
                </>
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
                    gap: 2,
                  }}
                >
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
      <Snackbar
        open={!!errorMessage || !!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={errorMessage ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {errorMessage || successMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
