"use client";
import React from "react";
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
} from "@mui/material";
import MenuAppBar from "../../components/appBar";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import TweetBox from "../../components/tweet-box";
import NotFoundPage from "@/app/[locale]/components/not-found";
import { useTranslations } from "next-intl";

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
          }}
        >
          <Box
            sx={{
              height: 200,
              backgroundImage: `url('https://plus.unsplash.com/premium_photo-1710406095492-7e62eba19745?q=80&w=2102&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
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
                  {petName} {t("owner")}
                </Typography>
              </Box>

              <Box sx={{ marginLeft: "auto", display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#ff7875",
                    },
                  }}
                >
                  Chat
                </Button>
              </Box>
            </Box>
          </CardContent>
          <Divider />

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

                      <IconButton aria-label="delete">
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
                      <Button
                        variant="contained"
                        component="label"
                        sx={{
                          backgroundColor: "#1976d2",
                          color: "white",
                          "&:hover": { backgroundColor: "#1565c0" },
                        }}
                      >
                        {t("upload")}
                        <input
                          type="file"
                          multiple
                          hidden
                          onChange={handleImageUpload}
                        />
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleImageSubmit}
                        disabled={imagesUploaded.length === 0}
                      >
                        {t("submit")}
                      </Button>
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
        </Card>
      )}
    </>
  );
};

export default PetsProfilePage;
