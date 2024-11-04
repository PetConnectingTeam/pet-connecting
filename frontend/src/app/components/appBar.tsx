"use client"; // Make sure this is the first line

import React, { useState, useEffect } from "react";
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
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  PhotoLibrary as PhotoLibraryIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axios from "axios";
import PetsIcon from "@mui/icons-material/Pets";
import Cookies from "js-cookie";
import Link from "next/link";

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

const StyledInputBase = styled(InputBase)(({}) => ({
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
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const fetchRecentSearches = async () => {
    try {
      const response = await axios.get("/api/recent-searches");
      setRecentSearches(response.data.recentSearches);
    } catch (error) {
      console.error("Error fetching recent searches", error);
    }
  };

  const fetchMessagesCount = async () => {
    try {
      const response = await axios.get("/api/messages-count");
      setMessagesCount(response.data.count);
    } catch (error) {
      console.error("Error fetching messages count", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/notifications");
      setNotifications(response.data.notifications);
      setNotificationsCount(response.data.count);
    } catch (error) {
      console.error("Error fetching notifications", error);
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

  const handleProfileHover = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const userId = Cookies.get("user_id");
  const accessToken = Cookies.get("accessToken");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [petAnchorEl, setPetAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const open = Boolean(petAnchorEl);
  const [petsData, setPetsData] = useState<
    {
      animal_type: string;
      id: number;
      name: string;
    }[]
  >();

  const handlePetsButton = (event: React.MouseEvent<HTMLElement>) => {
    setPetAnchorEl(event.currentTarget);
  };

  const handleClosePetMenu = () => {
    setPetAnchorEl(null);
  };

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5001/pets?name=&id=&user_id=${userId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.status === 200) {
          for (const pet of response.data) {
            setPetsData((prevState) => [
              ...(prevState ?? []),
              {
                animal_type: pet.AnimalType,
                id: pet.ID,
                name: pet.Name,
              },
            ]);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPetData();
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
          <Button
            size="small"
            onClick={handlePetsButton}
            aria-controls={open ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <PetsIcon fontSize="small" />
            <Typography
              variant="body2"
              sx={{ color: "black", marginLeft: 1, marginRight: 1 }}
            >
              Pets list
            </Typography>
          </Button>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={petAnchorEl}
            open={open}
            onClose={handleClosePetMenu}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {petsData?.map((pet) => (
              <MenuItem key={pet.id} onClick={handleClosePetMenu}>
                <Link href={`/petsProfile/${pet.id}`}>{pet.name}</Link>
              </MenuItem>
            ))}
          </Menu>

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
          <ActionButton size="small">
            <Badge
              badgeContent={notificationsCount}
              color="error"
              overlap="circular"
              variant="dot"
            >
              <NotificationsIcon fontSize="small" />
            </Badge>
          </ActionButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)}>
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
            src="https://via.placeholder.com/32"
            alt="User Avatar"
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
    </StyledAppBar>
  );
}
