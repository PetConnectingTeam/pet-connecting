// BottomBar.tsx
import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ChatIcon from '@mui/icons-material/Chat';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  TextField,
  Button,
  Collapse,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Cookies from "js-cookie";

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

const BottomBar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formOpen, setFormOpen] = useState(false);
  const [imageUploadOpen, setImageUploadOpen] = useState(false);
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [newPetId, setNewPetId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
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
          console.error("Failed to get new Pet ID from response.");
        }

        setTimeout(() => {
          setFormOpen(false);
          setImageUploadOpen(true);
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

  const handleImageSubmit = async () => {
    if (!newPetId || !selectedImage) {
      setError("Pet ID or image file is missing.");
      return;
    }

    try {
      const token = Cookies.get("accessToken");
      const formData = new FormData();
      formData.append("file", selectedImage);

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
        setImageUploadOpen(false);
        setSelectedImage(null);
        setSuccess(true);
        setError(null);
      } else {
        setError("Failed to upload the image.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Axios error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to upload image");
      } else {
        console.error("Unexpected error:", err);
        setError("Failed to upload image");
      }
    }
  };

  if (!isMobile) {
    return null;
  }

  return (
    <Box sx={{ paddingBottom: "56px" }}>
      <BottomNavigation
        className="bottom-navigation"
        showLabels
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1400,
          backgroundColor: "white",
          boxShadow: "0px -2px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <BottomNavigationAction
          label="Pet"
          icon={
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
          }
          onClick={() => setFormOpen(!formOpen)}
        />
        <BottomNavigationAction
          label="Profile"
          icon={<AccountCircleIcon />}
          component="a"
          href="/userProfile"
        />
        <BottomNavigationAction
          label="Search"
          component="a"
          href="/home"
          icon={<HomeIcon />}
        />
        <BottomNavigationAction
          label="Chat"
          component="a"
          href="/home"
          icon={<ChatIcon />}
        />
      </BottomNavigation>

      <Collapse in={formOpen}>
        <Box
          sx={{
            position: "fixed",
            bottom: 64,
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: "350px",
            maxHeight: "60vh",
            backgroundColor: "white",
            padding: 2,
            zIndex: 1300,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: 4,
            overflowY: "auto",
          }}
        >
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={() => setFormOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 1 }}>
              Pet posted successfully!
            </Alert>
          )}
          <TextField
            label="Pet Name"
            fullWidth
            margin="dense"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            label="Animal Type"
            fullWidth
            margin="dense"
            variant="outlined"
            name="animal_type"
            value={formData.animal_type}
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            label="Breed"
            fullWidth
            margin="dense"
            variant="outlined"
            name="breed"
            value={formData.breed}
            onChange={handleInputChange}
            size="small"
          />
          <Box display="flex" gap={1} sx={{ my: 1 }}>
            <TextField
              label="Age"
              type="number"
              fullWidth
              variant="outlined"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              size="small"
            />
            <TextField
              label="Weight"
              type="number"
              fullWidth
              variant="outlined"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              size="small"
            />
          </Box>
          <TextField
            label="Size"
            fullWidth
            margin="dense"
            variant="outlined"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            label="Allergies"
            fullWidth
            margin="dense"
            variant="outlined"
            name="allergies"
            value={formData.allergies}
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            variant="outlined"
            multiline
            rows={2}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            size="small"
          />
          <Button
            onClick={handleSubmit}
            fullWidth
            variant="contained"
            color="primary"
            disabled={!isFormValid}
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Collapse>

      {/* Image Upload Dialog */}
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
          <Button onClick={() => setImageUploadOpen(false)}>Cancel</Button>
          <Button
            onClick={handleImageSubmit}
            disabled={!selectedImage}
            color="primary"
            variant="contained"
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BottomBar;
