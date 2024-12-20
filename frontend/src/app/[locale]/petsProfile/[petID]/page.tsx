"use client";
import React, { useState, useEffect } from "react";
import BottomAppBar from "../../components/BottomBar";
import Chat from "../../components/chat";

import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  Typography,
  CardContent,
  Card,
  Divider,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemText,
  ImageList,
  ImageListItem,
  IconButton,
  Tabs,
  Tab,
  TextField,
  useMediaQuery,
  Modal,
  Rating,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuAppBar from "../../components/appBar";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import Cookies from "js-cookie";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import TweetBox from "../../components/tweet-box";
import NotFoundPage from "@/app/[locale]/components/not-found";
import { useTranslations } from "next-intl";
import StarIcon from "@mui/icons-material/Star";

// Custom SVG Icon Component
const CustomIcon = () => (
  <svg
    width="50px"
    height="50px"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby="customIconTitle"
    role="img"
  >
    <title id="customIconTitle">Custom Icon</title>
    <defs>
      <style>
        {`.cls-1 { stroke-miterlimit: 10; }
          .cls-1, .cls-2 { fill: none; stroke: #808285; stroke-width: 7px; }
          .cls-2 { stroke-linecap: round; stroke-linejoin: round; }`}
      </style>
    </defs>
    <path
      className="cls-2"
      d="M391.92,173.25v172.21c0,12.12-9.83,21.94-21.95,21.94H140.03c-12.12,0-21.94-9.82-21.94-21.94V173.25c0-12.11,9.82-21.94,21.94-21.94h13.91l21.42-37.12c1.91-3.3,6.67-3.3,8.58,0l21.42,37.12h92.17l21.43-37.12c1.91-3.3,6.67-3.3,8.58,0l21.42,37.12h21.01c12.12,0,21.95,9.83,21.95,21.94Z"
    />
    <path
      className="cls-1"
      d="M436.37,183.6c-4.65,13.85-14.67,27.17-24.36,40.05-6.68,8.87-15.21,20.09-19.53,28.84v-41.73c.29-.38,.58-.77,.87-1.15,22.91-30.45,28.6-43.24,14.85-54.37-5.01-4.06-5.79-11.41-1.73-16.42,4.05-5.01,11.4-5.78,16.41-1.73,14.98,12.13,19.64,28.2,13.49,46.51Z"
    />
    <path
      className="cls-1"
      d="M391.91,296.17s-32.09-59.99-68.46-59.99c-38.39,0-74.84,52.08-81.45,60.51"
    />
    <path
      className="cls-1"
      d="M121.47,356.72s36.9-73.58,88.05-74.34c45.53-.67,75.54,85.02,75.54,85.02"
    />
    <g>
      <path
        className="cls-1"
        d="M208.68,228.75c-2.94-5.07-9.27-8.57-16.61-8.57s-13.67,3.51-16.61,8.57c-5.25,2.45-8.57,6.04-8.57,10.05,0,7.39,11.27,13.38,25.18,13.38s25.18-5.99,25.18-13.38c0-4.01-3.32-7.6-8.57-10.05Z"
      />
      <ellipse
        className="cls-1"
        cx="201.33"
        cy="201.75"
        rx="9.91"
        ry="7.61"
        transform="rotate(-76.66 201.33 201.75)"
      />
      <ellipse
        className="cls-1"
        cx="180.13"
        cy="201.75"
        rx="7.61"
        ry="9.91"
        transform="rotate(-13.34 180.13 201.75)"
      />
      <ellipse
        className="cls-1"
        cx="163.75"
        cy="218.02"
        rx="6.68"
        ry="8.71"
        transform="rotate(-30 163.75 218.02)"
      />
      <ellipse
        className="cls-1"
        cx="218.55"
        cy="215.76"
        rx="8.71"
        ry="6.68"
        transform="rotate(-60 218.55 215.76)"
      />
    </g>
  </svg>
);

// New Custom SVG Icon Component for Pet Details
const PetDetailsIcon = () => (
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width="50px"
    height="50px"
    viewBox="0 0 768 768"
    preserveAspectRatio="xMidYMid meet"
  >
    <g
      transform="translate(0,768) scale(0.1,-0.1)"
      fill="#000000"
      stroke="none"
    >
      <path d="M2557 5733 c-65 -22 -138 -90 -168 -155 l-24 -53 0 -1755 0 -1755 23 -46 c28 -56 83 -113 137 -142 l40 -22 1239 -3 c1371 -3 1303 -6 1382 62 22 18 53 58 69 87 l30 54 3 948 c2 650 -1 954 -8 967 -12 23 -52 27 -69 7 -7 -10 -11 -289 -13 -953 l-3 -939 -27 -45 c-16 -28 -43 -55 -70 -70 l-43 -25 -1200 -3 c-855 -2 -1213 0 -1245 8 -60 15 -108 53 -131 104 -18 39 -19 100 -19 1643 l0 1602 53 -24 c30 -14 77 -29 107 -35 30 -6 235 -10 481 -10 375 0 429 2 443 16 22 22 20 50 -6 68 -20 14 -80 16 -458 16 -491 0 -517 3 -577 66 -75 80 -48 224 52 281 35 20 54 23 152 23 88 0 115 3 127 16 22 21 20 61 -3 74 -31 16 -219 11 -274 -7z" />
      <path d="M2938 5739 c-25 -14 -24 -65 1 -79 13 -7 364 -10 1064 -10 730 0 1053 -3 1073 -10 36 -14 81 -56 102 -95 10 -20 17 -70 21 -149 7 -133 16 -151 66 -128 l27 12 -4 133 c-3 126 -4 134 -34 187 -17 30 -50 70 -73 87 -85 66 -37 63 -1185 63 -689 -1 -1047 -4 -1058 -11z" />
      <path d="M3640 5260 c-24 -24 -25 -29 -4 -58 l15 -22 700 0 c759 0 726 2 787 -54 58 -52 57 -41 60 -551 2 -316 6 -473 14 -482 14 -18 43 -16 63 3 14 14 15 66 13 498 -3 476 -3 481 -25 523 -30 55 -83 106 -141 135 l-47 23 -707 3 c-700 3 -708 2 -728 -18z" />
      <path d="M3443 4629 c-89 -44 -139 -155 -131 -290 13 -216 182 -329 313 -208 61 56 87 123 88 224 2 137 -48 235 -138 276 -52 24 -81 24 -132 -2z m126 -108 c92 -99 53 -341 -55 -341 -66 0 -109 75 -108 190 1 141 93 226 163 151z" />
      <path d="M4087 4635 c-52 -18 -82 -48 -114 -114 -56 -114 -38 -289 38 -376 37 -42 106 -70 155 -62 114 19 201 182 176 333 -18 109 -64 182 -137 215 -47 22 -67 23 -118 4z m94 -95 c10 -6 29 -30 41 -53 30 -57 32 -183 4 -241 -43 -85 -115 -90 -162 -11 -81 139 5 364 117 305z" />
      <path d="M3045 4184 c-81 -45 -111 -107 -102 -215 14 -169 126 -303 252 -303 67 0 131 35 159 89 29 55 28 168 -3 247 -27 69 -79 139 -126 168 -48 29 -139 37 -180 14z m108 -88 c73 -30 127 -132 127 -238 0 -64 -31 -98 -87 -98 -62 1 -121 67 -149 167 -24 87 -12 141 36 165 42 21 34 21 73 4z" />
      <path d="M4455 4181 c-55 -26 -109 -84 -142 -156 -25 -53 -28 -72 -28 -157 0 -82 3 -101 21 -124 100 -135 289 -90 369 88 41 91 47 214 13 277 -44 82 -145 113 -233 72z m143 -108 c47 -51 15 -200 -59 -274 -32 -32 -46 -39 -78 -39 -23 0 -48 8 -62 19 -21 17 -24 28 -24 88 2 173 137 299 223 206z" />
      <path d="M3756 4086 c-92 -34 -125 -86 -158 -249 -12 -62 -30 -123 -42 -140 -14 -22 -53 -48 -119 -82 -155 -80 -197 -131 -204 -245 -8 -113 45 -181 165 -216 88 -26 209 -15 302 26 99 43 149 43 255 -1 74 -31 89 -34 185 -34 117 0 173 16 223 63 44 42 57 75 57 148 0 124 -43 178 -206 259 -51 25 -102 57 -113 71 -11 14 -25 51 -31 82 -45 216 -67 266 -141 303 -49 26 -126 32 -173 15z m133 -101 c38 -19 56 -62 76 -174 29 -170 55 -204 219 -288 97 -50 110 -60 127 -97 45 -98 11 -164 -96 -186 -78 -16 -146 -7 -236 32 -106 45 -193 45 -304 -2 -66 -28 -93 -34 -155 -34 -144 -2 -209 45 -194 140 9 64 45 101 139 145 160 74 189 111 224 284 23 118 32 144 57 166 37 32 98 38 143 14z" />
      <path d="M3246 2744 c-20 -19 -21 -48 -3 -63 11 -8 701 -15 1149 -11 29 0 42 37 23 66 l-15 24 -570 0 c-504 0 -570 -2 -584 -16z" />
      <path d="M3493 2440 c-26 -10 -32 -57 -11 -78 9 -9 99 -12 344 -12 289 0 335 2 348 16 22 22 20 50 -6 68 -19 14 -68 16 -338 15 -173 0 -325 -4 -337 -9z" />
    </g>
  </svg>
);

const PetsProfilePage: React.FC<{ params: { petID: string } }> = ({
  params,
}): JSX.Element => {
  const userId = Cookies.get("user_id");
  const accessToken = Cookies.get("accessToken");
  const [petName, setPetName] = React.useState<string>("");
  const [petType, setPetType] = React.useState<string>("");
  const { petID } = params;
  const [profilePicture, setProfilePicture] = React.useState<string>("");
  const [userName, setUserName] = React.useState<string>("");
  const [petInfo, setPetInfo] = React.useState<
    {
      id: string;
      mimetype: number;
      petID: string;
      photo: string;
    }[]
  >([]);
  const [notFound, setNotFound] = React.useState<boolean>(false);
  const [imagesUploaded, setImagesUploaded] = React.useState<File[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabValue, setTabValue] = React.useState(0);
  const [isChatVisible, setIsChatVisible] = useState(!isMobile);
  const [backgroundImage, setBackgroundImage] = React.useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petDetails, setPetDetails] = useState<any>(null);
  const [averageRating, setAverageRating] = React.useState<number | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const t = useTranslations("petsProfile");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5001/pets?name=&id=${petID}&user_id=`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.status === 200) {
          setPetName(response.data[0].Name);
          setPetType(response.data[0].AnimalType);

          const petResponse = await axios.get(
            `http://127.0.0.1:5001/pets/${petID}/photos`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );

          if (petResponse.status === 200) {
            const firstPhoto = petResponse.data[0];
            if (firstPhoto) {
              setBackgroundImage(
                `data:image/${firstPhoto.MimeType};base64,${firstPhoto.Photo}`
              );
            }

            petResponse.data.forEach(
              (photo: {
                ID: string;
                MimeType: number;
                PetID: string;
                Photo: string;
              }) => {
                setPetInfo((prevState) => [
                  ...(prevState ?? []),
                  {
                    id: photo.ID,
                    mimetype: photo.MimeType,
                    petID: photo.PetID,
                    photo: photo.Photo,
                  },
                ]);
              }
            );
          }
        } else {
          setNotFound(true);
        }

        const response2 = await axios.get(
          `http://127.0.0.1:5001/users?id=${userId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const data2 = response2.data[0];

        if (response2.status === 200) {
          const base64Image = `data:${data2.image_mimetype};base64,${data2.profile_image_base64}`;
          setProfilePicture(base64Image);
          setUserName(data2.name);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5001/pets/${userId}/photos`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        response.data[0].forEach(
          (photo: {
            ID: string;
            MimeType: number;
            PetID: string;
            Photo: string;
          }) => {
            setPetInfo((prevState) => [
              ...(prevState ?? []),
              {
                id: photo.ID,
                mimetype: photo.MimeType,
                petID: photo.PetID,
                photo: photo.Photo,
              },
            ]);
          }
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchPetData();
  });

  useEffect(() => {
    if (isMobile) {
      setIsChatVisible(false);
    } else {
      setIsChatVisible(true);
    }
  }, [isMobile]);

  const toggleChat = () => {
    if (isMobile) {
      setIsChatVisible((prev) => !prev);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImagesUploaded((prevState) => [...(prevState ?? []), ...fileArray]);
    }
  };

  const handleImageSubmit = async () => {
    const formData = new FormData();
    imagesUploaded.forEach((image) => {
      formData.append("file", image);
    });

    try {
      const response = await axios.post(
        `http://127.0.0.1:5001/pets/${petID}/photos`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        setImagesUploaded([]);
      }
    } catch (error) {
      console.error("Error uploading images", error);
    }
  };

  const handleOpenModal = async () => {
    setIsModalOpen(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:5001/pets?name=&id=${params.petID}&user_id=`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status === 200) {
        setPetDetails(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching pet details", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPetDetails(null);
  };

  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5001/pets?user_id=${userId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.status === 200) {
          const { TotalRating, RatingCount } = response.data[0];
          if (RatingCount > 0) {
            const total = parseFloat(TotalRating);
            setAverageRating(total / RatingCount);
          } else {
            setAverageRating(0);
          }
        }
      } catch (error) {
        console.error("Error fetching rating data", error);
      }
    };

    fetchRatingData();
  }, [userId, accessToken]);

  return (
    <>
      <CssBaseline />
      <MenuAppBar />
      {notFound ? (
        <NotFoundPage />
      ) : (
        <Card
          sx={{
            width: "100%",
            boxShadow: 3,
            backgroundColor: "white",
            height: "100vh",
            paddingTop: 7,
            overflow: "hidden", // Hide overflow for the card
          }}
        >
          <Box
            sx={{
              height: 200,
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          />

          <CardContent sx={{ position: "relative", padding: "16px 24px" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={profilePicture}
                alt="Owner Profile Picture"
                sx={{
                  width: 80,
                  height: 80,
                  border: "3px solid white",
                  position: "absolute",
                  top: -40,
                  left: 24,
                  boxShadow: 2,
                }}
              />

              <Box sx={{ marginLeft: "100px" }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: "bold" }}
                >
                  {userName}
                </Typography>
                <Typography variant="subtitle1" component="div">
                  {petName} Owner
                </Typography>
                {averageRating !== null && (
                  <Rating
                    name="pet-rating"
                    value={averageRating}
                    readOnly
                    precision={0.5}
                    emptyIcon={
                      <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                    }
                  />
                )}
              </Box>
            </Box>
          </CardContent>
          <Divider />

          {isMobile ? (
            // Mobile layout with tabs
            <Box
              sx={{
                padding: 2,
                overflow: "auto",
                height: "calc(100vh - 400px)",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{ indicatorColor: "#4b887c", textColor: "#4b887c" }}
              >
                <Tab
                  sx={{ color: "#4b887c" }}
                  label="Pet Details"
                  icon={<PetDetailsIcon />}
                />
                <Tab
                  sx={{ color: "#4b887c" }}
                  label="Gallery"
                  icon={<CustomIcon />}
                />
              </Tabs>

              {tabValue === 0 && (
                <Paper
                  sx={{
                    boxShadow: 2,
                    backgroundColor: "#f0f0f0",
                    marginTop: 2,
                    padding: 2,
                    height: "calc(100vh - 200px)",
                    overflow: "auto",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ marginTop: 1, marginLeft: 2 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#4b887c",
                      }}
                    >
                      {t("pet_details")}
                    </Typography>

                    <IconButton aria-label="Details" onClick={handleOpenModal}>
                      <MoreHorizIcon />
                    </IconButton>
                  </Stack>

                  <List>
                    <ListItem>
                      <ListItemText>
                        <Typography variant="body1">
                          {t("name")} {petName}
                        </Typography>
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>
                        <Typography variant="body1">
                          {t("type")} {petType}
                        </Typography>
                      </ListItemText>
                    </ListItem>
                  </List>

                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <Avatar
                      src={profilePicture}
                      alt="Profile"
                      sx={{ width: 40, height: 40, mr: 2 }}
                    />
                    <TextField
                      fullWidth
                      placeholder="What's new with your pet?"
                      variant="outlined"
                      size="small"
                    />
                    <Button variant="contained" sx={{ ml: 2 }} disabled>
                      Share
                    </Button>
                  </Box>
                </Paper>
              )}

              {tabValue === 1 && (
                <Paper
                  sx={{
                    boxShadow: 2,
                    backgroundColor: "#f0f0f0",
                    marginTop: 2,
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ padding: "8px 16px" }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      Gallery
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        component="label"
                        sx={{
                          backgroundColor: "#4b887c",
                          color: "white",
                          "&:hover": { backgroundColor: "#3c6b62" },
                        }}
                      >
                        Upload
                        <input
                          type="file"
                          multiple
                          hidden
                          onChange={handleImageUpload}
                        />
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "#90b3ac" }}
                        onClick={handleImageSubmit}
                        disabled={imagesUploaded.length === 0}
                      >
                        Submit
                      </Button>
                    </Stack>
                  </Stack>

                  <ImageList
                    sx={{
                      width: "100%",
                      height: "85%",
                      paddingTop: 1,
                      paddingLeft: 2,
                      paddingRight: 2,
                      paddingBottom: 1,
                    }}
                    variant="quilted"
                    cols={2}
                    rowHeight={121}
                  >
                    {petInfo?.map((item) => (
                      <ImageListItem key={item.id} cols={1} rows={1}>
                        <img
                          src={`data:image/${item.mimetype};base64,${item.photo}`}
                          alt={item.petID}
                          loading="lazy"
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Paper>
              )}
              {isChatVisible && <Chat />}
            </Box>
          ) : (
            // Desktop layout
            <Box sx={{ flexGlow: 1 }}>
              <Grid container spacing={2} columns={16}>
                <Grid size={7}>
                  <Stack direction="column" spacing={2} ml={5} mt={3}>
                    <Paper
                      sx={{
                        marginLeft: 2,
                        boxShadow: 2,
                        width: 650,
                        height: 150,
                        backgroundColor: "#f0f0f0",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ marginTop: 1, marginLeft: 2 }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {t("pet_details")}
                        </Typography>

                        <IconButton
                          aria-label="Details"
                          onClick={handleOpenModal}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                      </Stack>

                      <List>
                        <ListItem>
                          <ListItemText>
                            <Typography variant="body1">
                              {t("name")} {petName}
                            </Typography>
                          </ListItemText>
                        </ListItem>
                        <ListItem>
                          <ListItemText>
                            <Typography variant="body1">
                              {t("type")} {petType}
                            </Typography>
                          </ListItemText>
                        </ListItem>
                      </List>
                    </Paper>
                    <Paper
                      sx={{
                        marginLeft: 2,
                        boxShadow: 2,
                        width: 650,
                        height: 340,
                        backgroundColor: "#f0f0f0",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ padding: "8px 16px" }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {t("gallery")}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            component="label"
                            sx={{
                              backgroundColor: "#4b887c",
                              color: "white",
                              "&:hover": { backgroundColor: "#3c6b62" },
                            }}
                          >
                            Upload
                            <input
                              type="file"
                              multiple
                              hidden
                              onChange={handleImageUpload}
                            />
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ backgroundColor: "#90b3ac" }}
                            onClick={handleImageSubmit}
                            disabled={imagesUploaded.length === 0}
                          >
                            Submit
                          </Button>
                        </Stack>
                      </Stack>

                      <ImageList
                        sx={{
                          width: "100%",
                          height: "85%",
                          paddingTop: 1,
                          paddingLeft: 2,
                          paddingRight: 2,
                          paddingBottom: 1,
                        }}
                        variant="quilted"
                        cols={4}
                        rowHeight={121}
                      >
                        {petInfo?.map((item) => (
                          <ImageListItem key={item.id} cols={1} rows={1}>
                            <img
                              src={`data:image/${item.mimetype};base64,${item.photo}`}
                              alt={item.petID}
                              loading="lazy"
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Paper>
                  </Stack>
                </Grid>
                <Grid size={9}>
                  <Stack direction="column" spacing={2} mt={3}>
                    <Paper
                      sx={{
                        boxShadow: 2,
                        width: "95%",
                        height: 140,
                        backgroundColor: "#f0f0f0",
                      }}
                    >
                      <TweetBox profilePicture={profilePicture}></TweetBox>
                    </Paper>
                    <Paper
                      sx={{
                        boxShadow: 2,
                        width: "95%",
                        height: 300,
                        backgroundColor: "#f0f0f0",
                      }}
                    ></Paper>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          )}
          <BottomAppBar toggleChat={toggleChat} />
        </Card>
      )}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
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
            <svg
              width="50px"
              height="50px"
              viewBox="0 0 35 48"
              xmlns="http://www.w3.org/2000/svg"
              aria-labelledby="customIconTitle"
              role="img"
            >
              <title id="customIconTitle">Custom Icon</title>
              <defs>
                <style>
                  {`.b {
          fill: none;
          stroke: #000000;
          stroke-linecap: round;
          stroke-linejoin: round;
        }`}
                </style>
              </defs>
              <path
                className="b"
                d="M26.1227,43.5c.5641-15.2541-5.5775-20.398-10.4257-23.5907,1.1825-5.7942,5.4274-8.9252,5.4274-8.9252"
              />
              <path
                className="b"
                d="M25.0978,10.3312s-1.9733,3.1927-3.747,3.2592c0,0-.5765-5.8312-.3547-7.0063,1.4412-1.685,4.5452-2.0841,6.3189-2.0841s3.1927,1.1973,3.4366,3.8135c1.685,.0222,3.2814,.7982,3.614,1.5298-.1109,1.8624-1.6185,2.8158-3.0819,3.3701s-2.6606,1.4633-2.6606,2.3502,.3991,4.2348,2.8823,4.7004,6.4076,1.685,6.4076,5.6981-1.3525,3.3479-1.3525,7.2797,.4139,3.0449,.4139,5.0551-.6504,3.784-1.3007,4.9665"
              />
              <path
                className="b"
                d="M32.3332,42.9088s.7391-3.4292,.7391-5.0551-1.3816-3.7392-2.838-5.5725c-1.2564-1.5816-4.5337-.2037-4.4144,3.9035"
              />
              <path
                className="b"
                d="M36.1235,22.1417c3.3046,.3395,5.6105-2.5576,3.6593-6.0459"
              />
              <path
                className="b"
                d="M15.697,19.9093c.2069,.9164,.3769,2.7493,.3769,2.7493-1.1314,0-2.1587,.9578-2.8017,1.3791-1.312,.8596-2.6858,1.1485-2.6378,2.7005,.473,1.2416,2.5941,1.382,4.1313,1.3525l-.0333,.8647c-1.5314,1.4637-4.4233,4.7455-4.4233,8.78,0,4.7004,3.4366,5.5281,5.3877,5.5281s11.6804-4.9184,8.4888-13.5099"
              />
              <path
                className="b"
                d="M7.7078,30.1379c.9164,.0887,1.9215,.2365,1.9215,1.685s-2.1285,2.8084-2.1285,6.2081,2.2837,5.2325,8.1961,5.2325"
              />
              <path
                className="b"
                d="M36.8827,37.0506c-.5586-2.1828-3.101-4.5774-3.8105-4.9321s-.7506,3.236-.2349,4.4486"
              />
            </svg>{" "}
            Pet Details
          </Typography>
          {petDetails ? (
            <Box id="modal-description" sx={{ lineHeight: 1.6 }}>
              <Typography variant="body1">
                <strong>🦴 Name:</strong> {petDetails.Name}
              </Typography>
              <Typography variant="body1">
                <strong>🐾 Type:</strong> {petDetails.AnimalType}
              </Typography>
              <Typography variant="body1">
                <strong>🐶 Breed:</strong> {petDetails.Breed}
              </Typography>
              <Typography variant="body1">
                <strong>🎂 Age:</strong> {petDetails.Age}
              </Typography>
              <Typography variant="body1">
                <strong>📏 Size:</strong> {petDetails.Size}
              </Typography>
              <Typography variant="body1">
                <strong>📝 Description:</strong> {petDetails.Description}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              Loading...
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={handleCloseModal}
            sx={{
              alignSelf: "center",
              mt: 2,
              backgroundColor: "#4b887c",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#3c6b62",
              },
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default PetsProfilePage;
