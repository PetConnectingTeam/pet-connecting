"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Avatar,
  Box,
  styled,
  Badge,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Pets as PetsIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axios from "axios";

// Define types for pet list and events
interface Pet {
  ID: number;
  Name: string;
}

// Add this interface near the top of your file with other interfaces
interface UserProfile {
  email: string;
  id: number;
  image_mimetype: string | null;
  name: string;
  profile_image_base64: string | null;
}

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "white",
  boxShadow: "none",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "20px",
  backgroundColor: theme.palette.grey[200],
  marginRight: theme.spacing(2),
  width: "100%",
  maxWidth: "400px",
  "&:hover": {
    backgroundColor: theme.palette.grey[300],
  },
}));

const SearchIconWrapper = styled("div")({
  padding: "10px",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledInputBase = styled(InputBase)(({ }) => ({
  color: "inherit",
  paddingLeft: "40px",
  paddingRight: "10px",
  borderRadius: "20px",
  width: "100%",
  "& .MuiInputBase-input": {
    borderRadius: "20px",
    padding: "10px 10px",
    color: "red",
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  borderRadius: "20px",
  backgroundColor: theme.palette.grey[100],
  "&:hover": {
    backgroundColor: theme.palette.grey[400],
  },
}));

export default function NavigationBar() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [messagesCount, setMessagesCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState("");
  const [petList, setPetList] = useState<Pet[]>([]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [cost, setCost] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const fetchPetList = async () => {
    const token = Cookies.get("accessToken");
    const userId = Cookies.get("user_id");

    console.log("accessToken:", token);
    console.log("User ID:", userId);

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

  const handleSearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
    try {
      const response = await axios.get(`/api/search?q=${event.target.value}`);
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error fetching search results", error);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleChatClick = () => {
    router.push("/messages");
  };

  const handlePawClick = () => {
    setDialogOpen(true);
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setAnchorEl(null);
  };

  const handleProfileHover = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handlePetChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedPets(typeof event.target.value === 'string'
      ? event.target.value.split(',')
      : event.target.value);
  };

  const handleSubmitService = async () => {
    const token = Cookies.get("accessToken");
    const userId = Cookies.get("user_id");

    console.log("accessToken:", token);
    console.log("User ID:", userId);

    if (!userId || !token) {
      console.error("User ID or Auth Token is not available");
      return;
    }

    if (!description || !location || !cost || !startDate || !endDate || selectedPets.length === 0) {
      console.error("Please fill in all required fields");
      return;
    }

    try {
      // Format dates properly
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      };

      const serviceData = {
        description: description,
        serviceDateIni: formatDate(startDate),
        serviceDateFin: formatDate(endDate),
        address: location,
        cost: cost,
        pets: selectedPets.map(String) // Ensure all pet IDs are strings
      };

      console.log('Submitting service data:', serviceData);

      const response = await axios.post(
        'http://127.0.0.1:5001/service',
        serviceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('API Response:', response);

      if (response.status === 200 || response.status === 201) {
        console.log("Service created successfully");
        // Clear form fields
        setDescription("");
        setLocation("");
        setCost("");
        setStartDate("");
        setEndDate("");
        setSelectedPets([]);
        handleDialogClose();
      }
    } catch (error) {
      console.error("Error creating service:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Status code:", error.response?.status);
      }
    }
  };

  useEffect(() => {
    if (dialogOpen) fetchPetList();
  }, [dialogOpen]);

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
  }, []);

  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 0,
            color: "black",
            fontWeight: "bold",
            marginRight: 2,
          }}
          onClick={() => router.push("/home")}
        >
          Find Pet Care
        </Typography>
        <SearchWrapper>
          <SearchIconWrapper>
            <SearchIcon sx={{ color: "action.active" }} />
          </SearchIconWrapper>
          <StyledInputBase
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for Pet Care Services"
            inputProps={{ "aria-label": "search" }}
          />
          {searchTerm && (
            <IconButton
              onClick={handleClearSearch}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </SearchWrapper>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ActionButton size="small" onClick={handleChatClick}>
            <Badge
              badgeContent={messagesCount}
              color="error"
              overlap="circular"
              variant="dot"
            >
              <ChatIcon fontSize="small" />
            </Badge>
          </ActionButton>
          <ActionButton size="small" onClick={handlePawClick}>
            <PetsIcon fontSize="small" />
          </ActionButton>
          <ActionButton size="small" onClick={handleNotificationsClick}>
            <Badge
              badgeContent={notificationsCount}
              color="error"
              overlap="circular"
              variant="dot"
            >
              <NotificationsIcon fontSize="small" />
            </Badge>
          </ActionButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleNotificationsClose}
          >
            {notifications.map((notification, index) => (
              <MenuItem key={index}>{notification}</MenuItem>
            ))}
          </Menu>
          <Typography
            variant="body2"
            sx={{ color: "black", marginLeft: 1, marginRight: 1 }}
          >
            Pet Care
          </Typography>
          <Avatar
            src={profileImageUrl ?? "/placeholder.svg"}
            sx={{ width: 32, height: 32 }}
            onMouseEnter={handleProfileHover}
          />
          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleProfileClose}
          >
            <MenuItem onClick={() => router.push("/settings")}>
              <SettingsIcon fontSize="small" sx={{ marginRight: 1 }} /> Settings
            </MenuItem>
            <MenuItem onClick={() => router.push("/profile-pictures")}>
              <PhotoLibraryIcon fontSize="small" sx={{ marginRight: 1 }} />{" "}
              Profile Pictures
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {/* Dialog Popup */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="service-dialog-title"
        aria-describedby="service-dialog-description"
      >
        <DialogTitle id="service-dialog-title">Pet Care Services</DialogTitle>
        <DialogContent id="service-dialog-description">
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel id="pet-select-label">Select Pets</InputLabel>
            <Select
              labelId="pet-select-label"
              multiple
              value={selectedPets}
              onChange={handlePetChange}
              label="Select Pets"
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
            label="Description"
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Cost"
            fullWidth
            variant="outlined"
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Start Date & Time"
            fullWidth
            variant="outlined"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            margin="dense"
            label="End Date & Time"
            fullWidth
            variant="outlined"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitService}
            variant="contained"
            sx={{
              backgroundColor: "#FF4D4F",
              color: "white",
              "&:hover": {
                backgroundColor: "#FF4D4F",
              },
            }}
            disabled={!description || !location || !cost || !startDate || !endDate || selectedPets.length === 0}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </StyledAppBar>
  );
}