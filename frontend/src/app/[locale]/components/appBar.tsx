"use client";
import TranslateIcon from "@mui/icons-material/Translate";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
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
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";

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
  const roleId = Cookies.get("role_id");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false); // Controls visibility of search input on mobile
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [petList, setPetList] = useState<Pet[]>([]);
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
    setPetDialogOpen(false);
  };

  const handlePetChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedPets(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };

  const handleLanguageToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLocale = event.target.checked ? "es" : "en";
    router.push(`/${newLocale}/${pathname.split("/").slice(2).join("/")}`);
  };

  function handleDeletePet(id: number): void {
    throw new Error("Function not implemented.");
  }

  const [userProfileData, setUserProfileData] = useState<{
    profile_image_base64: string | null;
  }>({ profile_image_base64: null });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5001/users?user_id=${userId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (response.status === 200) {
          setUserProfileData(response.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (userId && accessToken) {
      fetchUserProfile();
    }
  }, [userId, accessToken]);

  return (
    <>
      <StyledAppBar
        position="fixed"
        sx={{ background: "rgba(255, 255, 255, 0.8)" }}
      >
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
                  fontSize: isMobile ? "1 rem" : "1.25rem",
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
                sx={{ width: "50%", marginRight: "0" }}
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
              gap: isMobile ? 0 : 2,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
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
                <Button
                  size="small"
                  sx={{ color: "#4b887c", width: "100%" }}
                  onClick={() => router.push("/veterinarianChat")}
                  disabled={roleId != "premium"}
                >
                  <LocalPharmacyIcon></LocalPharmacyIcon>
                </Button>
                <IconButton onClick={handleBoneClick}>
                  <Avatar
                    src={userProfileData?.profile_image_base64 || ""}
                    sx={{
                      width: 32,
                      height: 32,
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.8,
                      },
                    }}
                  />
                </IconButton>
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
                  <MenuItem
                    onClick={() =>
                      router.push(`/userProfile/${Cookies.get("user_id")}`)
                    }
                  >
                    <Button sx={{ color: "#4b887c", width: "100%" }}>
                      <AccountCircleIcon />
                      <ListItemText sx={{ color: "#000000" }}>
                        {t("profile")}
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
function setSelectedPets(arg0: string[]) {
  throw new Error("Function not implemented.");
}
