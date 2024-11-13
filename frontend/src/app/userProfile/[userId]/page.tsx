"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import StarIcon from "@mui/icons-material/Star";
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
import MenuAppBar from "../../components/appBar";
import BottomBar from "@/app/components/BottomBar";

const UserProfile: React.FC<{ params: { userId: string } }> = ({
  params,
}): JSX.Element => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [userType, setUserType] = useState("petOwner");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clientLoaded, setClientLoaded] = useState(false);

  const accessToken = Cookies.get("accessToken");
  const { userId } = params;
  const roleId = Cookies.get("role_id");
  const currentUserId = Cookies.get("user_id");

  useEffect(() => {
    setClientLoaded(true);
  }, []);

  const getErrorMessage = (error: any) => {
    return (
      error?.response?.data?.msg ||
      error?.message ||
      "An unknown error occurred"
    );
  };

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5001/users?id=${userId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const userData = response.data[0];
      if (response.status === 200) {
        setName(userData.name);
        setEmail(userData.email);
        setRating(userData.rating);
        const roleResponse = await axios.get(
          `http://127.0.0.1:5001/roles?id=${roleId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const roleData = roleResponse.data[0];
        if (roleResponse.status === 200) {
          switch (roleData.id) {
            case 1:
              setUserType("basic");
              break;
            case 2:
              setUserType("premium");
              break;
            case 3:
              setUserType("petOwner");
              break;
            default:
              setUserType("petOwner");
              break;
          }
        }
      }
    } catch (error: any) {
      console.error("Error fetching user or role data:", error);
      setErrorMessage(
        error?.response?.data?.msg ||
          error?.message ||
          "An unknown error occurred"
      );
    }
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5001/users?id=${userId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const data = response.data[0];
        if (response.status === 200 && data.profile_image_base64) {
          const base64Image = `data:${data.image_mimeType};base64,${data.profile_image_base64}`;
          setProfileImageUrl(base64Image);
        }
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    };

    fetchUserInfo();
    fetchUserData();
  }, []);
  // }, [fetchUserData, userID, accessToken]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let roleId;
      switch (userType) {
        case "basic":
          roleId = 1;
          break;
        case "premium":
          roleId = 2;
          break;
        case "petOwner":
        default:
          roleId = 3;
      }

      const payload: any = {
        id: userId,
        name,
        email,
        role_id: roleId,
      };

      const response = await axios.put(
        `http://127.0.0.1:5001/user/${userId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.status === 200) {
        setIsEditing(false);
        setErrorMessage(null);
        setSuccessMessage("Profile updated successfully");

        Cookies.set("role_id", roleId.toString());

        if (profilePicture) {
          await handleProfilePictureUpload();
        }

        await fetchUserData();
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorMessage(getErrorMessage(error));
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePicture) return;

    const formData = new FormData();
    formData.append("file", profilePicture);

    try {
      const response = await axios.put(
        `http://127.0.0.1:5001/user/${userId}/profile_photo`,
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
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
        await fetchUserData();
      } else {
        throw new Error("Failed to update profile picture");
      }
    } catch (error: any) {
      console.error("Error updating profile picture:", error);
      setErrorMessage(getErrorMessage(error));
    }
  };
  useEffect(() => {
    console.log("Current Rating:", rating);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePicture(event.target.files[0]);
    }
  };

  const handleCloseSnackbar = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <MenuAppBar />
        <Container
          maxWidth={false}
          sx={{
            backgroundColor: "white",
            height: "100vh",
            padding: { xs: 2, md: 4 },
            paddingTop: { xs: 6, md: 8 },
            paddingBottom: { xs: 2, md: 4 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "flex-start",
              gap: { xs: 2, md: 4 },
              backgroundColor: "white",
              width: "100%",
              height: "100%",
              paddingTop: { xs: 2, md: 7 },
              paddingBottom: { xs: 2, md: 4 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: { xs: "100%", md: "200px" },
                paddingTop: { xs: 2, md: 10 },
              }}
            >
              <Avatar
                src={
                  profilePicture
                    ? URL.createObjectURL(profilePicture)
                    : profileImageUrl ?? "/placeholder.svg"
                }
                sx={{
                  width: { xs: 100, md: 200 },
                  height: { xs: 100, md: 200 },
                  mb: 1,
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: { xs: "1.2rem", md: "1.7rem" },
                  justifyContent: "center",
                  padding: 2.5,
                  mb: 1,
                }}
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <StarIcon
                    key={index}
                    sx={{
                      color: index < (rating || 0) ? "gold" : "gray",
                      fontSize: "inherit",
                    }}
                  />
                ))}
              </Box>

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

            <Box sx={{ flexGrow: 1, paddingTop: { xs: 2, md: 10 } }}>
              <div>
                <TextField
                  fullWidth
                  label="Name"
                  id="Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  margin="normal"
                  disabled={!isEditing}
                  sx={{
                    mt: 0.5,
                    "& .MuiOutlinedInput-root": {
                      fontSize: { xs: "0.875rem", md: "1rem" },
                      color: isEditing ? "black" : "gray",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: isEditing ? "black" : "gray",
                    },
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: "red !important",
                    },
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
                  disabled={!isEditing}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: { xs: "0.875rem", md: "1rem" },
                      color: isEditing ? "black" : "gray",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: isEditing ? "black" : "gray",
                    },
                  }}
                />

                {clientLoaded && currentUserId === userId && (
                  <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">User Type</FormLabel>
                    <RadioGroup row value={userType}>
                      <FormControlLabel
                        value="petOwner"
                        control={<Radio />}
                        label="Pet Owner"
                        disabled
                      />
                      <FormControlLabel
                        value="basic"
                        control={<Radio />}
                        label="Basic User"
                        disabled
                      />
                      <FormControlLabel
                        value="premium"
                        control={<Radio />}
                        label="Premium User"
                        disabled
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              </div>

              {clientLoaded &&
                currentUserId === userId &&
                (isEditing ? (
                  <Button
                    sx={{
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#ff7875",
                      },
                      mt: 2,
                    }}
                    variant="contained"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                ) : (
                  <Button
                    sx={{
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#ff7875",
                      },
                      mt: 2,
                    }}
                    variant="contained"
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </Button>
                ))}
            </Box>
          </Box>
        </Container>
        <Snackbar
          open={!!errorMessage || !!successMessage}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
        >
          {errorMessage ? (
            <Alert onClose={handleCloseSnackbar} severity="error">
              {errorMessage}
            </Alert>
          ) : (
            <Alert onClose={handleCloseSnackbar} severity="success">
              {successMessage}
            </Alert>
          )}
        </Snackbar>
        <BottomBar />
      </Box>
    </>
  );
};

export default UserProfile;
