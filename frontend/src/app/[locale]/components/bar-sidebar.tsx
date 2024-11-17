'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslations } from "next-intl";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";
import { Home, Pets } from "@mui/icons-material";
import Link from "next/link";

const drawerWidth = 240;

interface PetFormData {
  name: string;
  animal_type: string;
  breed: string;
  description: string;
  allergies: string;
  weight: number;
  size: string;
  age: number;
}

export default function Component() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [currentTip, setCurrentTip] = useState("");
  const [open, setOpen] = useState(false);
  const [imageUploadOpen, setImageUploadOpen] = useState(false); // New state for image upload dialog
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [formData, setFormData] = useState<PetFormData>({
    name: "",
    animal_type: "",
    breed: "",
    description: "",
    allergies: "",
    weight: 0,
    size: "small",
    age: 0,
  });
  const [customPetInputVisible, setCustomPetInputVisible] = useState(false);
  const [customPetName, setCustomPetName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [newPetId, setNewPetId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // State for selected image file
  const t = useTranslations("Sidebar");
  const tips = [
    t("tip_1"),
    t("tip_2"),
    t("tip_3"),
    t("tip_4"),
    t("tip_5"),
    t("tip_6"),
    t("tip_7"),
    t("tip_8"),
    t("tip_9"),
    t("tip_10"),
    t("tip_11"),
  ];
  useEffect(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setCurrentTip(randomTip);
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = Cookies.get("accessToken");
      const userId = Cookies.get("user_id");

      if (!userId || !token) {
        console.error("User ID or Auth Token is not available in cookies");
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:5001/users?id=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200 && response.data && response.data[0]) {
          const data = response.data[0];
          const base64Image = `data:${data.image_mimeType};base64,${data.profile_image_base64}`;
          setProfileImageUrl(base64Image);
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const isValid =
      formData.name.trim() !== "" &&
      formData.animal_type.trim() !== "" &&
      formData.breed.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.allergies.trim() !== "" &&
      formData.weight > 0 &&
      formData.size.trim() !== "" &&
      formData.age > 0;

    setIsFormValid(isValid);
  }, [formData]);

  const handleClickOpen = () => {
    setOpen(true);
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    setOpen(false);
    setImageUploadOpen(false); // Close image upload dialog if open
    setFormData({
      name: "",
      animal_type: "",
      breed: "",
      description: "",
      allergies: "",
      weight: 0,
      size: "small",
      age: 0,
    });
    setSelectedPet(null);
    setCustomPetInputVisible(false);
    setCustomPetName("");
    setNewPetId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handlePetTypeSelect = (petType: string) => {
    setCustomPetInputVisible(false);
    setSelectedPet(petType);
    setFormData(prev => ({
      ...prev,
      animal_type: petType.toLowerCase(),
    }));
  };

  const handleCustomPetIconClick = () => {
    setCustomPetInputVisible(true);
    setSelectedPet("custom");
  };

  const handleCustomPetNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomPetName(value);
    setFormData(prev => ({
      ...prev,
      animal_type: value.toLowerCase(),
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = Cookies.get("accessToken");
      const userId = Cookies.get("user_id");
  
      if (!userId || !token) {
        setError('User not authenticated. Please log in.');
        return;
      }
  
      const response = await axios.post(`http://127.0.0.1:5001/pets?user_id=${userId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      console.log("Pet creation response:", response.data); // Log response to inspect its structure
  
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
  
        // Assuming the backend returns the new pet ID in the response data
        if (response.data && response.data.id) {
          setNewPetId(response.data.id); // Set newPetId directly if available in response
          console.log("New Pet ID from response:", response.data.id);
        } else {
          // If pet ID isn't directly in the response, fetch it with a follow-up request
          await fetchNewPetId();
        }
  
        setTimeout(() => {
          setOpen(false);
          setImageUploadOpen(true); // Open image upload dialog after successful pet submission
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post pet');
      console.error("Error in pet creation:", err);
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };
  const fetchNewPetId = async () => {
    try {
      const token = Cookies.get("accessToken");
  
      const petIdResponse = await axios.get(`http://127.0.0.1:5001/pets?name=${formData.name}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (petIdResponse.status === 200 && petIdResponse.data && petIdResponse.data[0]) {
        const petId = petIdResponse.data[0].id;
        setNewPetId(petId);
        console.log("New Pet ID from follow-up request:", petId);
      } else {
        console.error("No pet ID found in follow-up request response:", petIdResponse);
        setError("Failed to retrieve pet ID after creation.");
      }
    } catch (error) {
      console.error("Error fetching new pet ID:", error);
      setError("Failed to retrieve pet ID.");
    }
  };
  
  
  const handleImageSubmit = async () => {
    if (!newPetId || !selectedImage) {
      setError("Pet ID or image file is missing.");
      return;
    }
  
    try {
      const token = Cookies.get("accessToken");
  
      const formData = new FormData();
      formData.append("file", selectedImage); // Try different keys like "file", "image", etc.
  
      console.log("Starting image upload...");
      console.log("Form Data (file):", formData.get("file")); // Check if the file is attached
  
      const response = await axios.post(`http://127.0.0.1:5001/pets/${newPetId}/photos`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status === 200 || response.status === 201) {
        console.log("Image uploaded successfully");
        setImageUploadOpen(false);
        setSelectedImage(null);
        setSuccess(true);
        setError(null);
      } else {
        setError("Failed to upload the image.");
      }
    } catch (err) {
      console.error("Error in image upload:", err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    }
  };
  


  return (
    <Box>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f0f0f0",
            height: `calc(100% - 60px)`,
            marginTop: 8,
          },
        }}
        variant="permanent"
      >
        <List>
          <ListItem>
            <Link href="../home" style={{ textDecoration: "none", color: "inherit" }}>
              <ListItemButton>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary={t("home")} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="/userProfile" style={{ textDecoration: "none", color: "inherit" }}>
              <ListItemButton>
                <ListItemIcon>
                  <Avatar src={profileImageUrl || "/placeholder.svg?height=40&width=40"} sx={{ width: 24, height: 24 }} />
                </ListItemIcon>
                <ListItemText primary={t("profile")} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={handleClickOpen}>
              <ListItemIcon>
                <Pets />
              </ListItemIcon>
              <ListItemText primary={t("post_a_pet")} />
            </ListItemButton>
          </ListItem>
          <Divider />

          <Box sx={{ padding: 2, backgroundColor: "#f9f9f9", borderRadius: 1, margin: 2 ,color:"#ff4d4f"}}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {t("pet_care_tip")}
            </Typography>
            <Typography variant="body2">{currentTip}</Typography>
          </Box>

          <Divider />

          <ListItem>
            <Link href="/help" style={{ textDecoration: "none", color: "inherit" }}>
              <ListItemButton>
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText primary={t("help_support")} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="" style={{ textDecoration: "none", color: "inherit" }}>
              <ListItemButton>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={t("log_out")} />
              </ListItemButton>
            </Link>
          </ListItem>
        </List>

        <Divider />
      </Drawer>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle style={{ backgroundColor: "#ff4d4f", color: "white" }}>{t("post_a_pet")} 😻</DialogTitle>
        <DialogContent dividers>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{t("pet_posted_successfully")}</Alert>}
          {newPetId && <Alert severity="info" sx={{ mb: 2 }}>{t("new_pet_id")}: {newPetId}</Alert>}
          <form>
            <TextField
              label={t("pet_name")}
              fullWidth
              margin="dense"
              variant="outlined"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <Box display="flex" justifyContent="space-around" sx={{ my: 2 }}>
              {[{ name: t("dog"), icon: "🐶" }, { name: t("cat"), icon: "🐱" }, { name: t("bird"), icon: "🐦" }].map((pet, index) => (
                <Box
                  key={index}
                  onClick={() => handlePetTypeSelect(pet.name)}
                  sx={{
                    cursor: "pointer",
                    padding: 1,
                    border: selectedPet === pet.name ? "2px solid green" : "2px solid transparent",
                    borderRadius: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4">{pet.icon}</Typography>
                  <Typography variant="caption">{pet.name}</Typography>
                </Box>
              ))}
              <Box
                onClick={handleCustomPetIconClick}
                sx={{
                  cursor: "pointer",
                  padding: 1,
                  border: selectedPet === "custom" ? "2px solid green" : "2px solid transparent",
                  borderRadius: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h4">🐾</Typography>
                <Typography variant="caption">Custom</Typography>
              </Box>
            </Box>
            {customPetInputVisible && (
              <TextField
                label={t("custom_pet_type")}
                fullWidth
                margin="dense"
                variant="outlined"
                value={customPetName}
                onChange={handleCustomPetNameChange}
              />
            )}
            <TextField
              label={t("breed")}
              fullWidth
              margin="dense"
              variant="outlined"
              name="breed"
              value={formData.breed}
              onChange={handleInputChange}
            />
            <TextField
              label={t("age")}
              fullWidth
              margin="dense"
              variant="outlined"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
            />
            <TextField
              label={t("weight")}
              fullWidth
              margin="dense"
              variant="outlined"
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel>Size</InputLabel>
              <Select
                label={t("size")}
                name="size"
                value={formData.size}
                onChange={(event) => handleInputChange(event as React.ChangeEvent<{ name?: string; value: unknown }>)}
              >
                <MenuItem value="small">{t("small")}</MenuItem>
                <MenuItem value="medium">{t("medium")}</MenuItem>
                <MenuItem value="large">{t("large")}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={t("allergies")}
              fullWidth
              margin="dense"
              variant="outlined"
              name="allergies"
              value={formData.allergies}
              onChange={handleInputChange}
            />
            <TextField
              label={t("description")}
              fullWidth
              margin="dense"
              variant="outlined"
              multiline
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ backgroundColor: "#ff4d4f", color: "white" }}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} style={{ backgroundColor: "#ff4d4f", color: "white" }} disabled={!isFormValid}>
            {t("submit")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image upload dialog */}
      <Dialog open={imageUploadOpen} onClose={() => setImageUploadOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t("upload_pet_image")}</DialogTitle>
        <DialogContent>
          <TextField
            type="file"
            inputProps={{ accept: "image/*" }}
            onChange={handleImageChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageUploadOpen(false)} style={{ color: "#ff4d4f" }}>
            {t("cancel")}
          </Button>
          <Button onClick={handleImageSubmit} style={{ backgroundColor: "#ff4d4f", color: "white" }} disabled={!selectedImage}>
            {t("uplaod")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
