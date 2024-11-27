"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
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
  useMediaQuery,
  SelectChangeEvent,
} from "@mui/material";
import { Home } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

interface Pet {
  ID: number;
  Name: string;
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
  const [serviceDialogOpen, setDialogOpen] = useState(false);
  const [customPetInputVisible, setCustomPetInputVisible] = useState(false);
  const [customPetName, setCustomPetName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [newPetId, setNewPetId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // State for selected image file
  const router = useRouter();
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

  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [cost, setCost] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [petList, setPetList] = useState<Pet[]>([]); // Add state for pet list

  // Function to fetch pet list
  const fetchPetList = async () => {
    const token = Cookies.get("accessToken");
    const userId = Cookies.get("user_id");

    if (!userId || !token) {
      console.error("User ID or Auth Token is not available in cookies");
      return;
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:5001/pets?name=&id=&user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPetList(response.data);
    } catch (error) {
      console.error("Error fetching pet list", error);
    }
  };

  useEffect(() => {
    fetchPetList(); // Fetch pet list when component mounts
  }, []);

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

      console.log("Pet creation response:", response.data);

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);

        if (response.data && response.data.id) {
          setNewPetId(response.data.id);
          console.log("New Pet ID from response:", response.data.id);
        } else {
          await fetchNewPetId();
        }

        setOpen(false);
        setImageUploadOpen(true);
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

  const handlePetChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedPets(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };

  const handleSubmitService = async () => {
    const token = Cookies.get("accessToken");
    const userId = Cookies.get("user_id");

    if (!userId || !token) {
      console.error("User ID or Auth Token is not available");
      return;
    }

    if (
      !description ||
      !location ||
      !cost ||
      !startDate ||
      !endDate ||
      selectedPets.length === 0
    ) {
      console.error("Please fill in all required fields");
      return;
    }

    try {
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}/${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
      };

      const serviceData = {
        description: description,
        serviceDateIni: formatDate(startDate),
        serviceDateFin: formatDate(endDate),
        address: location,
        cost: cost,
        pets: selectedPets.map(String),
      };

      const response = await axios.post(
        "http://127.0.0.1:5001/service",
        serviceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Service created successfully");
        setDescription("");
        setLocation("");
        setCost("");
        setStartDate("");
        setEndDate("");
        setSelectedPets([]);
        handleDialogClose();
      } else {
        console.error("Failed to create service");
      }
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const handleDialogOpen = () => {
    setDialogOpen(true);
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
              backgroundColor: "#f9f7f4",
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
                  <ListItemText primary={t("home")} />
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
                    style={{ color: "#4b887c" }}
                  >
                    <path d="M11.25 16.25h1.5L12 17z" />
                    <path d="M16 14v.5" />
                    <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309" />
                    <path d="M8 14v.5" />
                    <path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
                  </svg>
                </ListItemIcon>
                <ListItemText primary={t("post_a_pet")} />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={() => setDialogOpen(true)}>
                <ListItemIcon>
                  <svg
                    width="40px"
                    height="40px"
                    style={{ paddingRight: "10px" }}
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M382.6,279.11v147.07c0,8.79-7.13,15.93-15.93,15.93H140.33c-8.8,0-15.93-7.14-15.93-15.93V111.82c0-8.56,6.75-15.52,15.21-15.9l20.08-34.78c1.65-2.85,5.77-2.85,7.42,0l20.06,34.75h130l20.06-34.75c1.65-2.85,5.77-2.85,7.42,0l20.06,34.75h1.96c8.8,0,15.93,7.13,15.93,15.93v107.22"
                      stroke="#4b887c"
                      strokeWidth="10"
                      fill="none"
                    />
                    <g>
                      <path
                        d="M463.1,200.95c-5.74,5.58-17.11,3.16-25.39-5.37-8.3-8.55-10.37-19.98-4.63-25.56,.69-.67,1.48-1.23,2.32-1.66,6.13-3.25,15.79-.47,23.09,7.05,7.28,7.5,9.78,17.24,6.35,23.27-.46,.83-1.04,1.6-1.73,2.27Z"
                        fill="#4b887c"
                      />
                      <path
                        d="M435.4,168.37c-.84,.43-1.63,.99-2.32,1.66l2.02-1.97,.3,.3Z"
                        fill="#4b887c"
                      />
                      <path
                        d="M465.13,198.99l-2.02,1.97c.69-.67,1.27-1.44,1.73-2.27l.3,.3Z"
                        fill="#4b887c"
                      />
                      <path
                        d="M463.1,200.95l-98.33,95.46c-16.76-3.76-26.77-14.07-30.02-30.93l98.33-95.46c-5.74,5.58-3.67,17.01,4.63,25.56,8.29,8.54,19.65,10.95,25.39,5.37Z"
                        fill="#4b887c"
                      />
                      <path
                        d="M364.78,296.41l-62.14,30.31,32.12-61.23c3.26,16.86,13.27,27.17,30.02,30.93Z"
                        fill="#4b887c"
                      />
                      <path
                        d="M320.17,317.83l-16.87,8.23,8.72-16.62c.88,4.58,3.6,7.38,8.15,8.4Z"
                        fill="#4b887c"
                      />
                      <line
                        x1="423.25"
                        x2="365.98"
                        y1="209.6"
                        y2="265.2"
                        stroke="#4b887c"
                        strokeWidth="10"
                      />
                      <line
                        x1="416.61"
                        x2="359.34"
                        y1="202.76"
                        y2="258.36"
                        stroke="#4b887c"
                        strokeWidth="10"
                      />
                      <line
                        x1="429.01"
                        x2="371.74"
                        y1="217.31"
                        y2="272.91"
                        stroke="#4b887c"
                        strokeWidth="10"
                      />
                    </g>
                    <g>
                      <path
                        d="M273.02,387.35c-3.24-5.58-10.21-9.44-18.29-9.44s-15.05,3.86-18.29,9.44c-5.79,2.7-9.44,6.66-9.44,11.07,0,8.14,12.42,14.73,27.73,14.73s27.73-6.6,27.73-14.73c0-4.41-3.66-8.37-9.44-11.07Z"
                        stroke="#4b887c"
                        strokeWidth="10"
                        fill="none"
                      />
                      <ellipse
                        cx="264.92"
                        cy="357.62"
                        rx="10.92"
                        ry="8.38"
                        transform="translate(-144.17 532.89) rotate(-76.66)"
                        stroke="#4b887c"
                        strokeWidth="10"
                        fill="none"
                      />
                      <ellipse
                        cx="241.57"
                        cy="357.62"
                        rx="8.38"
                        ry="10.92"
                        transform="translate(-75.99 65.38) rotate(-13.34)"
                        stroke="#4b887c"
                        strokeWidth="10"
                        fill="none"
                      />
                      <ellipse
                        cx="223.53"
                        cy="375.53"
                        rx="7.36"
                        ry="9.6"
                        transform="translate(-157.82 162.08) rotate(-30)"
                        stroke="#4b887c"
                        strokeWidth="10"
                        fill="none"
                      />
                      <ellipse
                        cx="283.9"
                        cy="373.04"
                        rx="9.6"
                        ry="7.36"
                        transform="translate(-181.12 432.39) rotate(-60)"
                        stroke="#4b887c"
                        strokeWidth="10"
                        fill="none"
                      />
                    </g>
                    <line
                      x1="176.59"
                      x2="330.84"
                      y1="140.92"
                      y2="140.92"
                      stroke="#4b887c"
                      strokeWidth="10"
                    />
                    <line
                      x1="176.59"
                      x2="330.84"
                      y1="176.97"
                      y2="176.97"
                      stroke="#4b887c"
                      strokeWidth="10"
                    />
                    <line
                      x1="176.59"
                      x2="330.84"
                      y1="213.02"
                      y2="213.02"
                      stroke="#4b887c"
                      strokeWidth="10"
                    />
                    <line
                      x1="176.59"
                      x2="330.84"
                      y1="249.06"
                      y2="249.06"
                      stroke="#4b887c"
                      strokeWidth="10"
                    />
                    <line
                      x1="176.59"
                      x2="293.95"
                      y1="285.11"
                      y2="285.11"
                      stroke="#4b887c"
                      strokeWidth="10"
                    />
                    <line
                      x1="176.59"
                      x2="277.19"
                      y1="321.16"
                      y2="321.16"
                      stroke="#4b887c"
                      strokeWidth="10"
                    />
                  </svg>
                </ListItemIcon>
                <ListItemText primary={t("post_a_service")} />
              </ListItemButton>
            </ListItem>
            <Divider />

            <Box
              sx={{
                padding: 2,
                backgroundColor: "#ffffff",
                borderRadius: 1,
                margin: 2,
                color: "#3c6b62", //#ff4d4f
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {t("pet_care_tip")}
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
                  <ListItemText primary={t("help_support")} />
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
                  <ListItemText primary={t("log_out")} />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>

          <Divider />
        </Drawer>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle style={{ backgroundColor: "#4b887c", color: "white" }}>
          {t("post_a_pet")}
        </DialogTitle>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {t("pet_posted_successfully")}
            </Alert>
          )}
          {newPetId && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {t("new_pet_id")}: {newPetId}
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
                { name: t("dog"), icon: "🐶" },
                { name: t("cat"), icon: "🐱" },
                { name: t("bird"), icon: "🐦" },
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
            style={{ backgroundColor: "#4b887c", color: "white" }}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            style={{ backgroundColor: "#4b887c", color: "white" }}
            disabled={!isFormValid}
          >
            {t("submit")}
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
          <Button
            onClick={() => setImageUploadOpen(false)}
            style={{ color: "#4b887c" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImageSubmit}
            style={{ backgroundColor: "#4b887c", color: "white" }}
            disabled={!selectedImage}
          >
            {t("uplaod")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Service Dialog */}
      <Dialog open={serviceDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{t("pet_care_services")}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel id="pet-select-label">Select Pets</InputLabel>
            <Select
              labelId="pet-select-label"
              multiple
              value={selectedPets}
              onChange={handlePetChange}
              label={t("select_pets")}
            >
              {petList.map((pet) => (
                <MenuItem key={pet.ID} value={pet.ID.toString()}>
                  {pet.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label={t("description")}
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label={t("location")}
            fullWidth
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label={t("cost")}
            fullWidth
            variant="outlined"
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label={t("start_date_time")}
            fullWidth
            variant="outlined"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            margin="dense"
            label={t("end_date_time")}
            fullWidth
            variant="outlined"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} sx={{ color: "#4b887c" }}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmitService}
            variant="contained"
            sx={{
              backgroundColor: "#4b887c",
              color: "white",
              "&:hover": { backgroundColor: "#3c6b62" },
            }}
            disabled={
              !description ||
              !location ||
              !cost ||
              !startDate ||
              !endDate ||
              selectedPets.length === 0
            }
          >
            {t("submit")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
