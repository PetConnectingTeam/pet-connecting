"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";

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
  useMediaQuery,
} from "@mui/material";
import { Home } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";

const drawerWidth = 240;

const tips = [
  "Dogs need daily exercise. Try a 30-minute walk!",
  "Cats benefit from interactive toys to keep them active.",
  "Remember to brush your pet's teeth regularly.",
  "Ensure your pet has a comfortable, quiet place to sleep.",
  "Regular vet checkups are essential for long-term health.",
  "Avoid feeding pets table scraps to prevent digestive issues.",
  "Keep your pet hydrated by providing fresh water daily.",
  "Groom your pet regularly to reduce shedding and prevent matting.",
  "Introduce new toys and activities to stimulate your pet's mind.",
  "Protect your pet from extreme weather by keeping them cool in summer and warm in winter.",
  "Teach basic commands to improve your pet's behavior and safety.",
];

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
  const isMobile = useMediaQuery("(max-width:600px)");

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
  const router = useRouter();

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handlePetTypeSelect = (petType: string) => {
    setCustomPetInputVisible(false);
    setSelectedPet(petType);
    setFormData((prev) => ({
      ...prev,
      animal_type: petType.toLowerCase(),
    }));
  };

  const handleCustomPetIconClick = () => {
    setCustomPetInputVisible(true);
    setSelectedPet("custom");
  };

  const handleCustomPetNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setCustomPetName(value);
    setFormData((prev) => ({
      ...prev,
      animal_type: value.toLowerCase(),
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = Cookies.get("accessToken");
      const userId = Cookies.get("user_id");

      if (!userId || !token) {
        setError("User not authenticated. Please log in.");
        return;
      }

      const response = await axios.post(
        `http://127.0.0.1:5001/pets?user_id=${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      setError(err instanceof Error ? err.message : "Failed to post pet");
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

      const petIdResponse = await axios.get(
        `http://127.0.0.1:5001/pets?name=${formData.name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        petIdResponse.status === 200 &&
        petIdResponse.data &&
        petIdResponse.data[0]
      ) {
        const petId = petIdResponse.data[0].id;
        setNewPetId(petId);
        console.log("New Pet ID from follow-up request:", petId);
      } else {
        console.error(
          "No pet ID found in follow-up request response:",
          petIdResponse
        );
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
      formData.append("file", selectedImage);

      console.log("Starting image upload...");
      console.log("Form Data (file):", formData.get("file"));
      const response = await axios.post(
        `http://127.0.0.1:5001/pets/${newPetId}/photos`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      setError(err instanceof Error ? err.message : "Failed to upload image");
    }
  };

  return (
    <Box>
      {!isMobile && (
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
              <Link
                href="../home"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <Home />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem>
              <ListItemButton
                onClick={() =>
                  router.push(`/userProfile/${Cookies.get("user_id")}`)
                }
              >
                <ListItemIcon>
                  <Avatar
                    src={
                      profileImageUrl || "/placeholder.svg?height=40&width=40"
                    }
                    sx={{ width: 24, height: 24 }}
                  />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={handleClickOpen}>
                <ListItemIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-dog"
                  >
                    <path d="M11.25 16.25h1.5L12 17z" />
                    <path d="M16 14v.5" />
                    <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309" />
                    <path d="M8 14v.5" />
                    <path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
                  </svg>
                </ListItemIcon>
                <ListItemText primary="Post A Pet" />
              </ListItemButton>
            </ListItem>
            <Divider />

            <Box
              sx={{
                padding: 2,
                backgroundColor: "#f9f9f9",
                borderRadius: 1,
                margin: 2,
                color: "#ff4d4f",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Pet Care Tip
              </Typography>
              <Typography variant="body2">{currentTip}</Typography>
            </Box>

            <Divider />

            <ListItem>
              <Link
                href="/help"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <HelpIcon />
                  </ListItemIcon>
                  <ListItemText primary="Help & Support" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href=""
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Log Out" />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>

          <Divider />
        </Drawer>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle style={{ backgroundColor: "#ff4d4f", color: "white" }}>
          Post a Pet 😻
        </DialogTitle>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Pet posted successfully!
            </Alert>
          )}
          {newPetId && (
            <Alert severity="info" sx={{ mb: 2 }}>
              New Pet ID: {newPetId}
            </Alert>
          )}
          <form>
            <TextField
              label="Pet Name"
              fullWidth
              margin="dense"
              variant="outlined"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <Box display="flex" justifyContent="space-around" sx={{ my: 2 }}>
              {[
                { name: "Dog", icon: "🐶" },
                { name: "Cat", icon: "🐱" },
                { name: "Bird", icon: "🐦" },
              ].map((pet, index) => (
                <Box
                  key={index}
                  onClick={() => handlePetTypeSelect(pet.name)}
                  sx={{
                    cursor: "pointer",
                    padding: 1,
                    border:
                      selectedPet === pet.name
                        ? "2px solid green"
                        : "2px solid transparent",
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
                  border:
                    selectedPet === "custom"
                      ? "2px solid green"
                      : "2px solid transparent",
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
                label="Custom Pet Type"
                fullWidth
                margin="dense"
                variant="outlined"
                value={customPetName}
                onChange={handleCustomPetNameChange}
              />
            )}
            <TextField
              label="Breed"
              fullWidth
              margin="dense"
              variant="outlined"
              name="breed"
              value={formData.breed}
              onChange={handleInputChange}
            />
            <TextField
              label="Age"
              fullWidth
              margin="dense"
              variant="outlined"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
            />
            <TextField
              label="Weight"
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
                label="Size"
                name="size"
                value={formData.size}
                onChange={(event) =>
                  handleInputChange(
                    event as React.ChangeEvent<{
                      name?: string;
                      value: unknown;
                    }>
                  )
                }
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Allergies"
              fullWidth
              margin="dense"
              variant="outlined"
              name="allergies"
              value={formData.allergies}
              onChange={handleInputChange}
            />
            <TextField
              label="Description"
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
          <Button
            onClick={handleClose}
            style={{ backgroundColor: "#ff4d4f", color: "white" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            style={{ backgroundColor: "#ff4d4f", color: "white" }}
            disabled={!isFormValid}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image upload dialog */}
      <Dialog
        open={imageUploadOpen}
        onClose={() => setImageUploadOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Upload Pet Image</DialogTitle>
        <DialogContent>
          <TextField
            type="file"
            inputProps={{ accept: "image/*" }}
            onChange={handleImageChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setImageUploadOpen(false)}
            style={{ color: "#ff4d4f" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImageSubmit}
            style={{ backgroundColor: "#ff4d4f", color: "white" }}
            disabled={!selectedImage}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
