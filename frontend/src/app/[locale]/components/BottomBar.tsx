// BottomBar.tsx
import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ChatIcon from "@mui/icons-material/Chat";
import AddBoxIcon from "@mui/icons-material/AddBoxOutlined";
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
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useTranslations } from "next-intl";

import { breedMaxAges, breedMinWeights, breedWeights } from "../../../api/api";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface BottomBarProps {
  toggleChat: () => void;
}

const BottomBar: React.FC<BottomBarProps> = ({ toggleChat }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const t = useTranslations("Bottom");

  const [selectedPet, setSelectedPet] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [customPetName, setCustomPetName] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [customPetInputVisible, setCustomPetInputVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    animal_type: "",
    breed: "",
    description: "",
    allergies: "",
    weight: 0,
    size: "small",
    age: 0,
  });

  const handlePetTypeSelect = (petType: string) => {
    setCustomPetInputVisible(false);
    setSelectedPet(petType);
    setFormData((prev) => ({
      ...prev,
      animal_type: petType.toLowerCase(),
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const handleCustomPetIconClick = () => {
    setCustomPetInputVisible((prev) => !prev);
    setSelectedPet("custom");
  };

  const [formOpen, setFormOpen] = useState(false);
  const [imageUploadOpen, setImageUploadOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [newPetId, setNewPetId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();

  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [cost, setCost] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [petList, setPetList] = useState<any[]>([]);

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
    if (serviceDialogOpen) fetchPetList();
  }, [serviceDialogOpen]);

  const handleServiceDialogOpen = () => {
    setServiceDialogOpen(true);
  };

  const handleServiceDialogClose = () => {
    setServiceDialogOpen(false);
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
      setError("User ID or Auth Token is not available");
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
      setError("Please fill in all required fields");
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
        setDescription("");
        setLocation("");
        setCost("");
        setStartDate("");
        setEndDate("");
        setSelectedPets([]);
        handleServiceDialogClose();
      }
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

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
      console.log("Token:", token);
      const userId = Cookies.get("user_id");

      if (!userId || !token) {
        setError("User not authenticated. Please log in.");
        return;
      }

      console.log("Form Data:", formData);

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
      if (axios.isAxiosError(err)) {
        console.error("Axios error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to post pet");
      } else {
        console.error("Unexpected error:", err);
        setError("Failed to post pet");
      }
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
  function determineSize(weight: number, breed: string): string {
    const maxWeight = breedWeights[breed.toLowerCase()] || 100; // Default to 100 if breed not found
    const weightPercentage = (weight / maxWeight) * 100;

    if (weightPercentage < 40) {
      return "small";
    } else if (weightPercentage >= 30 && weightPercentage <= 70) {
      return "medium";
    } else {
      return "large";
    }
  }

  const handleAgeChange = (event: Event, newValue: number | number[]) => {
    setFormData((prev) => ({
      ...prev,
      age: newValue as number,
    }));
  };

  const handleWeightChange = (event: Event, newValue: number | number[]) => {
    const weight = newValue as number;
    setFormData((prev) => ({
      ...prev,
      weight: weight,
      size: determineSize(weight, prev.breed), // Set size based on weight and breed
    }));
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
          label={t("Pet")}
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
          label={t("Profile")}
          icon={<AccountCircleIcon />}
          component="a"
          onClick={() => router.push(`/userProfile/${Cookies.get("user_id")}`)}
        />
        <BottomNavigationAction
          label={t("add")}
          icon={<AddBoxIcon />}
          onClick={handleServiceDialogOpen}
        />
        <BottomNavigationAction
          label={t("Home")}
          component="a"
          href="/home"
          icon={<HomeIcon />}
        />
        <BottomNavigationAction
          label={t("Chat")}
          icon={<ChatIcon />}
          onClick={toggleChat}
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
              {t("Pet posted successfully!")}
            </Alert>
          )}
          <TextField
            label={t("petName")}
            fullWidth
            margin="dense"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            size="small"
          />
          <Box display="flex" justifyContent="space-around" sx={{ my: 2 }}>
            {[
              { name: t("Dog"), icon: "🐶" },
              { name: t("Cat"), icon: "🐱" },
              { name: t("Bird"), icon: "🐦" },
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
              <Typography variant="caption">{t("Custom")}</Typography>
            </Box>
          </Box>
          {customPetInputVisible && (
            <TextField
              label={t("custompetname")}
              fullWidth
              margin="dense"
              variant="outlined"
              value={customPetName}
              onChange={handleCustomPetNameChange}
              size="small"
            />
          )}
          <TextField
            label={t("Breed")}
            fullWidth
            margin="dense"
            variant="outlined"
            name="breed"
            value={formData.breed}
            onChange={handleInputChange}
          />

          <Typography gutterBottom>{t("age")}</Typography>

          <Slider
            value={formData.age}
            onChange={handleAgeChange}
            aria-labelledby="age-slider"
            valueLabelDisplay="auto"
            sx={{ color: "#4b887c", width: "50%", marginLeft: "25%" }}
            step={1}
            marks
            min={0}
            max={breedMaxAges[formData.breed.toLowerCase()]} // Use breedMaxAges
          />

          <Box>
            <Typography gutterBottom>{t("weight")}</Typography>

            <Slider
              value={formData.weight}
              onChange={handleWeightChange}
              aria-labelledby="weight-slider"
              valueLabelDisplay="auto"
              sx={{ color: "#4b887c", width: "50%", marginLeft: "25%" }}
              step={1}
              marks
              // ... existing code ...

              // Assuming you have a similar setup for the min weight
              min={breedMinWeights[formData.breed.toLowerCase()]}
              // ... existing code ...
              max={breedWeights[formData.breed.toLowerCase()] || 100}
            />
          </Box>
          <TextField
            label={t("size")}
            fullWidth
            margin="dense"
            variant="outlined"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            label={t("allergies")}
            fullWidth
            margin="dense"
            variant="outlined"
            name="allergies"
            value={formData.allergies}
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            label={t("description")}
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
            disabled={!isFormValid}
            sx={{ mt: 2, backgroundColor: "#4b887c" }}
          >
            {t("Submit")}
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
        <DialogTitle>{t("uploadpetimage")}</DialogTitle>
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
            sx={{ color: "#4b887c" }}
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleImageSubmit}
            disabled={!selectedImage}
            color="primary"
            variant="contained"
            sx={{ backgroundColor: "#4b887c" }}
          >
            {t("upload")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Service Posting Dialog */}
      <Dialog
        open={serviceDialogOpen}
        onClose={handleServiceDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t("Post_a_Service")}</DialogTitle>
        <DialogContent
          sx={{
            padding: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            maxHeight: "50vh",
            overflowY: "auto",
          }}
        >
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel id="pet-select-label">{t("select_pets")}</InputLabel>
            <Select
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
            sx={{
              "& .MuiInputBase-root": {
                overflow: "hidden",
              },
            }}
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
            sx={{
              "& .MuiInputBase-root": {
                overflow: "hidden",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleServiceDialogClose} sx={{ color: "#4b887c" }}>
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleSubmitService}
            variant="contained"
            sx={{ backgroundColor: "#4b887c", color: "white" }}
            disabled={
              !description ||
              !location ||
              !cost ||
              !startDate ||
              !endDate ||
              selectedPets.length === 0
            }
          >
            {t("Submit")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BottomBar;
