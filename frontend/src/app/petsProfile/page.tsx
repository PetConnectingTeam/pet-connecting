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
import MenuAppBar from "../components/appBar";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import TweetBox from "../components/tweet-box";

interface PetProfileProps {
  petName: string;
  petType: string;
  petAge: number;
  petDescription: string;
  petImage: string;
}

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

const itemData = [
  {
    img: "https://images.pexels.com/photos/2664417/pexels-photo-2664417.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Breakfast",
    rows: 2,
    cols: 2,
  },
  {
    img: "https://images.pexels.com/photos/164186/pexels-photo-164186.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Burger",
  },
  {
    img: "https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Camera",
  },
  {
    img: "https://images.pexels.com/photos/3649170/pexels-photo-3649170.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Coffee",
    cols: 2,
  },
  {
    img: "https://images.pexels.com/photos/4641833/pexels-photo-4641833.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Hats",
    cols: 2,
  },
  {
    img: "https://images.pexels.com/photos/5122188/pexels-photo-5122188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Honey",
    author: "@arwinneil",
    rows: 2,
    cols: 2,
  },
  {
    img: "https://images.pexels.com/photos/4641862/pexels-photo-4641862.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Basketball",
  },
  {
    img: "https://images.pexels.com/photos/19727177/pexels-photo-19727177/free-photo-of-resfriado-frio-nieve-nevar.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Fern",
  },
  {
    img: "https://images.pexels.com/photos/4943801/pexels-photo-4943801.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Mushrooms",
    rows: 2,
    cols: 2,
  },
  {
    img: "https://images.pexels.com/photos/976924/pexels-photo-976924.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Tomato basil",
  },
  {
    img: "https://images.pexels.com/photos/976923/pexels-photo-976923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Sea star",
  },
  {
    img: "https://images.pexels.com/photos/1846409/pexels-photo-1846409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Bike",
    cols: 2,
  },
];

const PetsProfilePage: React.FC<PetProfileProps> = (
  {
    // petName,
    // petType,
    // petAge,
    // petDescription,
    // petImage,
  }
) => {
  const userId = Cookies.get("user_id");
  const accessToken = Cookies.get("accessToken");
  const [petName, setPetName] = React.useState<string>("");
  const [petType, setPetType] = React.useState<string>("");
  const [petID, setPetID] = React.useState<number>(-1);
  const [profilePicture, setProfilePicture] = React.useState<string>("");
  const [userName, setUserName] = React.useState<string>("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5001/pets?name=&id=6&user_id=${userId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const data = response.data[0];

        if (response.status === 200) {
          setPetName(data.name);
          setPetType(data.animal_type);
          setPetID(data.id);
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
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <>
      <CssBaseline />
      <MenuAppBar />
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
                {petName} Owner
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
                      Pet Details
                    </Typography>

                    <IconButton aria-label="delete">
                      <MoreHorizIcon />
                    </IconButton>
                  </Stack>

                  <List>
                    <ListItem>
                      <ListItemText>
                        <Typography variant="body1">Name: {petName}</Typography>
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>
                        <Typography variant="body1">Type: {petType}</Typography>
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
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      marginTop: 1,
                      marginLeft: 2,
                    }}
                  >
                    Gallery
                  </Typography>

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
                    {itemData.map((item) => (
                      <ImageListItem
                        key={item.img}
                        cols={item.cols || 1}
                        rows={item.rows || 1}
                      >
                        <img
                          {...srcset(item.img, 121, item.rows, item.cols)}
                          alt={item.title}
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
    </>
  );
};

export default PetsProfilePage;
