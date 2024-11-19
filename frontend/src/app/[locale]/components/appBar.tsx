"use client";
import TranslateIcon from '@mui/icons-material/Translate';
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
      if (isMobile) setSearchOpen(false); // Close the search bar after submitting on mobile
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

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: isMobile && searchOpen ? "center" : "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href="/home" passHref>
              <Typography
                variant={isMobile ? "body2" : "h6"}
                sx={{
                  display: isMobile ? "block" : "inline-block",
                  flexGrow: 0,
                  color: "black",
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

          {/* Search Icon and Input */}
          <ClickAwayListener
            onClickAway={() => isMobile && setSearchOpen(false)}
          >
            <SearchWrapper
              onClick={handleSearchIconClick}
              sx={{ width: isMobile && !searchOpen ? "auto" : "50%" }}
            >
              <SearchIcon sx={{ color: "action.active" }} />
              {(!isMobile || searchOpen) && (
                <StyledInputBase
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchKeyPress}
                  placeholder={t("search_for_pet_care_services")}
                  autoFocus={!isMobile || searchOpen}
                  inputProps={{ "aria-label": "search" }}
                />
              )}
              {searchOpen && isMobile && (
                <IconButton onClick={handleClearSearch}>
                  <CloseIcon />
                </IconButton>
              )}
            </SearchWrapper>
          </ClickAwayListener>

          {!isMobile || !searchOpen ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 1 : 2,
              }}
            >
              <CircularButton
                size="small"
                onClick={handlePetsButton}
                aria-controls={open ? "demo-positioned-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <PetsIcon fontSize="small" />
              </CircularButton>
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

              <CircularButton size="small" onClick={handlePawClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 221 228"
                  preserveAspectRatio="xMidYMid meet"
                  fill="gray"
                >
                  <g
                    transform="translate(0.000000,228.000000) scale(0.100000,-0.100000)"
                    fill="gray"
                    stroke="none"
                  >
                    <path d="M1320 2054 l0 -205 126 -60 c69 -32 128 -59 129 -59 2 0 5 19 7 43 l3 42 108 3 109 3 39 86 c22 47 39 86 37 87 -9 6 -388 186 -465 222 l-93 43 0 -205z" />
                    <path d="M510 1870 c-38 -38 -22 -65 70 -119 l65 -37 5 -333 5 -333 28 -24 c31 -26 62 -30 102 -12 46 21 55 54 55 195 l0 128 91 -153 c77 -131 96 -156 126 -169 41 -17 83 -5 108 31 29 41 18 78 -65 217 -44 73 -80 136 -80 141 0 4 79 8 175 8 l175 0 0 -178 0 -179 26 -24 c36 -34 95 -33 132 4 l27 27 3 178 c3 120 7 179 15 184 8 5 12 49 12 135 l0 128 -145 72 -145 72 -318 1 -317 0 -53 30 c-63 35 -71 36 -97 10z" />
                    <path d="M82 1715 c-62 -27 -63 -39 -60 -493 4 -519 -15 -460 228 -707 142 -144 180 -188 189 -220 6 -22 11 -93 11 -157 l0 -118 210 0 210 0 0 238 c0 253 -8 311 -53 377 -42 62 -452 465 -484 476 -81 26 -161 -68 -122 -144 6 -12 87 -99 180 -193 93 -94 169 -175 169 -180 0 -15 -22 -34 -40 -34 -21 0 -366 348 -379 383 -27 71 -5 154 55 207 l34 29 0 241 0 240 -27 30 c-34 36 -76 45 -121 25z" />
                    <path d="M2044 1720 c-12 -4 -31 -21 -43 -36 -20 -26 -21 -37 -21 -268 l0 -242 30 -22 c65 -49 88 -148 51 -220 -11 -20 -96 -113 -189 -206 -171 -170 -191 -183 -216 -144 -9 15 14 43 161 190 94 95 176 183 182 195 39 77 -41 170 -123 143 -50 -16 -478 -451 -508 -515 -21 -47 -23 -65 -26 -312 l-3 -263 210 0 211 0 0 118 c0 64 5 135 11 157 9 32 47 76 189 220 153 156 180 188 201 240 l24 60 0 420 c0 389 -1 422 -18 447 -10 14 -32 31 -49 37 -36 13 -45 13 -74 1z" />
                  </g>
                </svg>
              </CircularButton>

              <Avatar
                
                sx={{ width: 32, height: 32 }}
                onMouseEnter={handleProfileHover}
              >
                <TranslateIcon />
              </Avatar>
              
              <Menu
                anchorEl={profileAnchorEl}
                open={Boolean(profileAnchorEl)}
                onClose={handleProfileClose}
              >
                {/* Language Switch */}
                <MenuItem>
                  {" "}
                  <FormControlLabel
                    control={
                      <LanguageSwitch
                        value={locale}
                        onChange={(e) => {
                          const language = e.target.checked ? "es" : "en";
                          router.push(
                            `/${language}/${pathname
                              .split("/")
                              .slice(2)
                              .join("/")}`
                          );
                        }}
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          Language
                        </Typography>
                      </Box>
                    }
                  />
                </MenuItem>
              </Menu>
            </Box>
          ) : null}
        </Toolbar>

        <Dialog open={dialogOpen} onClose={handleDialogClose}>
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
            <Button onClick={handleDialogClose}>{t("cancel")}</Button>
            <Button
              onClick={handleSubmitService}
              variant="contained"
              sx={{
                backgroundColor: "#FF4D4F",
                color: "white",
                "&:hover": { backgroundColor: "#FF4D4F" },
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
      </StyledAppBar>
    </>
  );
}
