"use client";
import TranslateIcon from "@mui/icons-material/Translate";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Avatar,
  Box,
  styled,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  useMediaQuery,
  useTheme,
  ClickAwayListener,
  Switch,
  Chip,
  ListItemText,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Pets as PetsIcon,
} from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { FormControlLabel } from "@mui/material";
import logo from "../../../../public/Logo2.png";

const LanguageSwitch = styled(Switch)(({ theme }) => ({
  width: 60,
  height: 34,
  padding: 0,
  display: "flex",
  "& .MuiSwitch-switchBase": {
    padding: 1,
    "&.Mui-checked": {
      transform: "translateX(26px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#001e3c", // Dark color for the thumb
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#aab4be", // Light grey for the background
    borderRadius: 17,
    position: "relative",
  },
  "& .MuiSwitch-track:before": {
    content: '"EN"', // Text on the left (default/off state)
    position: "absolute",
    left: 8,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 12,
    color: theme.palette.text.primary,
  },
  "& .MuiSwitch-track:after": {
    content: '"ES"', // Text on the right (checked/on state)
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 12,
    color: theme.palette.text.primary,
  },
}));
interface Pet {
  ID: number;
  Name: string;
}

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "white",
  boxShadow: "none",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const SearchWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: theme.palette.grey[200],
  borderRadius: "20px",
  padding: "5px 10px",
  cursor: "pointer",
  transition: "width 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.grey[300],
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
  width: "100%",
  transition: "width 0.3s ease",
}));

const CircularButton = styled(Button)(({ theme }) => ({
  borderRadius: "50%",
  width: 32,
  height: 32,
  padding: 0,
  minWidth: 0,
  backgroundColor: theme.palette.grey[100],
  "&:hover": {
    backgroundColor: theme.palette.grey[400],
  },
}));

export default function NavigationBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // True on mobile screens
  const t = useTranslations("AppBar");
  const router = useRouter();
  const locale = useLocale();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false); // Controls visibility of search input on mobile
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [petList, setPetList] = useState<Pet[]>([]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [cost, setCost] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const pathname = usePathname();

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
  const [boneDropdownOpen, setBoneDropdownOpen] = useState(false); // State for dropdown visibility
  const [boneAnchorEl, setBoneAnchorEl] = useState<null | HTMLElement>(null); // Anchor element for dropdown

  const handleBoneClick = (event: React.MouseEvent<HTMLElement>) => {
    setBoneAnchorEl(event.currentTarget); // Set the anchor element
    setBoneDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  const handleCloseBoneMenu = () => {
    setBoneDropdownOpen(false); // Close the dropdown
  };
  const handleSearchIconClick = () => {
    if (isMobile) {
      // Toggle search input visibility on mobile
      setSearchOpen((prev) => !prev);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      router.push(`/home?animal_type=${searchTerm}`);
      if (isMobile) setSearchOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    if (isMobile) setSearchOpen(false);
  };

  const handlePawClick = () => {
    setDialogOpen(true);
  };

  const handleProfileHover = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const userId = Cookies.get("user_id");
  const accessToken = Cookies.get("accessToken");

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

  const [petDialogOpen, setPetDialogOpen] = useState(false); // State for pet dialog visibility

  const handlePetsButton = () => {
    setPetDialogOpen(true); // Open the pet dialog
  };

  const handlePetDialogClose = () => {
    setPetDialogOpen(false); // Close the pet dialog
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

  const handleDialogClose = () => {
    setDialogOpen(false);
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

  const handleDeletePet = async (petId: number) => {
    const token = Cookies.get("accessToken");

    if (!token) {
      console.error("Auth Token is not available");
      return;
    }

    try {
      // Call the API to handle the pet deletion and associated data
      const response = await axios({
        method: "DELETE",
        url: `http://127.0.0.1:5001/pets/${petId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 204) {
        console.log("Pet deleted successfully");
        // Update the state to remove the deleted pet
        setPetsData((prevState) =>
          prevState?.filter((pet) => pet.id !== petId)
        );
      }
    } catch (error: any) {
      if (error.response) {
        console.error(
          "Error deleting pet. Status:",
          error.response.status,
          "Message:",
          error.response.data
        );
      } else {
        console.error("Unexpected error deleting pet:", error);
      }
    }
  };

  const handleLanguageToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLocale = event.target.checked ? "es" : "en";
    router.push(`/${newLocale}/${pathname.split("/").slice(2).join("/")}`);
  };

  return (
    <>
      <StyledAppBar position="fixed" sx={{ background: "#f9f7f4" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href="/home" passHref>
              <Typography
                variant={isMobile ? "body2" : "h6"}
                sx={{
                  display: isMobile ? "block" : "inline-block",
                  flexGrow: 0,
                  color: "#4b887c",
                  fontWeight: "bold",
                  mr: isMobile ? 1 : 2,
                  fontSize: isMobile ? "0.8rem" : "1.25rem",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                PetConnecting
              </Typography>
            </Link>
          </Box>

          {!isMobile && (
            <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
              <SearchWrapper
                onClick={handleSearchIconClick}
                sx={{ width: "50%" }}
              >
                <SearchIcon sx={{ color: "action.active" }} />
                <StyledInputBase
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchKeyPress}
                  placeholder={t("search_for_pet_care_services")}
                  inputProps={{ "aria-label": "search" }}
                />
              </SearchWrapper>
            </ClickAwayListener>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 1 : 2,
              backgroundColor: "#f9f7f4",
            }}
          >
            {isMobile && (
              <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
                <SearchWrapper
                  onClick={handleSearchIconClick}
                  sx={{ width: searchOpen ? "50%" : "auto" }}
                >
                  <SearchIcon sx={{ color: "action.active" }} />
                  {searchOpen && (
                    <StyledInputBase
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onKeyPress={handleSearchKeyPress}
                      placeholder={t("search_for_pet_care_services")}
                      autoFocus
                      inputProps={{ "aria-label": "search" }}
                    />
                  )}
                  {searchOpen && (
                    <IconButton onClick={handleClearSearch}></IconButton>
                  )}
                </SearchWrapper>
              </ClickAwayListener>
            )}

            {!isMobile || !searchOpen ? (
              <>
                <CircularButton size="small" onClick={handleBoneClick}>
                  <svg
                    width="32"
                    height="32px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.1374 2.73779C13.3942 3.48102 13.0092 4.77646 13.2895 5.7897C13.438 6.32603 13.4622 6.97541 13.0687 7.3689L11.7892 8.64837C11.7196 8.71805 11.7423 8.83608 11.8329 8.8749C13.3123 9.50892 14.4911 10.6877 15.1251 12.1671C15.1639 12.2577 15.2819 12.2804 15.3516 12.2108L16.6311 10.9313C17.0246 10.5378 17.674 10.562 18.2103 10.7105C19.2235 10.9908 20.519 10.6058 21.2622 9.86257C22.2459 8.87884 22.2459 7.28391 21.2622 6.30018C20.2785 5.31646 18.6835 5.31646 17.6998 6.30018C18.6835 5.31646 18.6835 3.72152 17.6998 2.73779C16.7161 1.75407 15.1212 1.75407 14.1374 2.73779Z"
                      fill="#4b887c"
                    />
                    <path
                      d="M2.73779 17.6998C3.72152 18.6835 5.31646 18.6835 6.30018 17.6998C5.31646 18.6835 5.31645 20.2785 6.30018 21.2622C7.28391 22.2459 8.87884 22.2459 9.86257 21.2622C10.6058 20.519 10.9908 19.2235 10.7105 18.2103C10.562 17.674 10.5378 17.0246 10.9313 16.6311L12.2108 15.3516C12.2804 15.2819 12.2577 15.1639 12.1671 15.1251C10.6877 14.4911 9.50892 13.3123 8.8749 11.8329C8.83608 11.7423 8.71805 11.7196 8.64837 11.7892L7.3689 13.0687C6.97541 13.4622 6.32603 13.438 5.7897 13.2895C4.77646 13.0092 3.48101 13.3942 2.73779 14.1374C1.75407 15.1212 1.75407 16.7161 2.73779 17.6998Z"
                      fill="#4b887c"
                    />
                    <path
                      d="M8.25 5C8.25 5.41421 8.58579 5.75 9 5.75C9.41421 5.75 9.75 5.41421 9.75 5L9.75 4C9.75 3.58579 9.41421 3.25 9 3.25C8.58579 3.25 8.25 3.58579 8.25 4L8.25 5Z"
                      fill="#c6aa59"
                    />
                    <path
                      d="M6.87359 5.81293C7.16649 6.10582 7.16649 6.5807 6.87359 6.87359C6.5807 7.16649 6.10582 7.16649 5.81293 6.87359L4.39872 5.45938C4.10582 5.16648 4.10582 4.69161 4.39872 4.39872C4.69161 4.10582 5.16648 4.10582 5.45938 4.39872L6.87359 5.81293Z"
                      fill="#c6aa59"
                    />
                    <path
                      d="M18.1876 17.1264C17.8947 16.8335 17.4198 16.8335 17.1269 17.1264C16.834 17.4193 16.834 17.8942 17.1269 18.1871L18.5411 19.6013C18.834 19.8942 19.3089 19.8942 19.6018 19.6013C19.8947 19.3084 19.8947 18.8335 19.6018 18.5406L18.1876 17.1264Z"
                      fill="#c6aa59"
                    />
                    <path
                      d="M15 18.25C15.4142 18.25 15.75 18.5858 15.75 19V20C15.75 20.4142 15.4142 20.75 15 20.75C14.5858 20.75 14.25 20.4142 14.25 20V19C14.25 18.5858 14.5858 18.25 15 18.25Z"
                      fill="#c6aa59"
                    />
                    <path
                      d="M5 9.75C5.41421 9.75 5.75 9.41421 5.75 9C5.75 8.58579 5.41421 8.25 5 8.25H4C3.58579 8.25 3.25 8.58579 3.25 9C3.25 9.41421 3.58579 9.75 4 9.75H5Z"
                      fill="#c6aa59"
                    />
                    <path
                      d="M18.25 15C18.25 14.5858 18.5858 14.25 19 14.25H20C20.4142 14.25 20.75 14.5858 20.75 15C20.75 15.4142 20.4142 15.75 20 15.75H19C18.5858 15.75 18.25 15.4142 18.25 15Z"
                      fill="#c6aa59"
                    />
                  </svg>
                </CircularButton>
                <Menu
                  anchorEl={boneAnchorEl}
                  open={boneDropdownOpen}
                  onClose={handleCloseBoneMenu}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  {/* Add MenuItems here */}
                  <MenuItem onClick={handlePawClick}>
                    <Button sx={{ color: "#4b887c", width: "100%" }}>
                      <PetsIcon />

                      <ListItemText sx={{ color: "#000000" }}>
                        {t("Post a Service")}
                      </ListItemText>
                    </Button>
                  </MenuItem>
                  <MenuItem onClick={handlePetsButton}>
                    <Button sx={{ color: "#4b887c", width: "100%" }}>
                      <PetsIcon />
                      <ListItemText sx={{ color: "#000000" }}>
                        {t("Pet's Profile")}
                      </ListItemText>
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <ListItemText>
                      <FormControlLabel
                        sx={{
                          paddingLeft: "14px",
                          width: "100%",
                          color: "#000000",
                          fontWeight: "bold",
                        }}
                        control={
                          <LanguageSwitch
                            checked={locale === "es"}
                            onChange={handleLanguageToggle}
                          />
                        }
                        label={
                          <Box display="flex" alignItems="center">
                            <Typography
                              variant="body2"
                              sx={{
                                ml: 1,
                                color: "#00000",
                                fontWeight: "bold",
                              }}
                            >
                              {t("Language")}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItemText>
                  </MenuItem>
                </Menu>
              </>
            ) : null}
          </Box>
        </Toolbar>

        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          sx={{
            "& .MuiDialog-paper": {
              width: "500px",
              backgroundColor: "#f9f7f4",
              height: isMobile ? "70%" : "auto",
            },
          }}
        >
          <DialogTitle variant="h5" sx={{ color: "#4b887c" }}>
            <img src={logo.src} alt="logo" width={50} height={50} />
            {t("pet_care_services")}
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel id="pet-select-label">{t("select_pets")}</InputLabel>
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

        {/* Pet Selection Dialog */}
        <Dialog
          open={petDialogOpen}
          onClose={handlePetDialogClose}
          sx={{
            "& .MuiDialog-paper": {
              width: isMobile ? "90%" : "500px",
              height: isMobile ? "50%" : "auto",

              backgroundColor: "#f9f7f4",
            },
          }}
        >
          <DialogTitle
            id="modal-title"
            variant="h5"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#4b887c",
              alignSelf: "center",
            }}
          >
            <img src={logo.src} alt="logo" width={50} height={50} />
            Pet Names
          </DialogTitle>
          <DialogContent>
            {petsData?.map((pet) => (
              <div
                key={pet.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",

                  alignItems: "center",
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #e0e0e0",
                  marginBottom: "8px",
                }}
              >
                <Link
                  href={`/petsProfile/${pet.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {pet.name}
                </Link>
                <Chip
                  label={t("Delete")}
                  color="secondary"
                  onClick={() => handleDeletePet(pet.id)}
                  sx={{
                    backgroundColor: "#e74c3c",
                    "&:hover": {
                      backgroundColor: "#d32f2f",
                    },
                  }}
                />
              </div>
            ))}
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              size="small"
              onClick={handlePetDialogClose}
              sx={{ backgroundColor: "#4b887c", color: "white" }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </StyledAppBar>
    </>
  );
}
