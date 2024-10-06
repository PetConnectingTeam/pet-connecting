"use client";
import React, { useState } from "react";
import {
  Avatar,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Box,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

interface UserProfileProps {
  username: string;
  bio: string;
  email: string;
  profilePhoto: string;
  petPhotos: string[];
  reviews: { rating: number; comment: string }[];
}

const UserProfile: React.FC<UserProfileProps> = ({
  username,
  bio,
  email,
  profilePhoto,
  petPhotos,
  reviews,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [newPetPhotos, setNewPetPhotos] = useState<string[]>(petPhotos);

  const handleAddPetPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = URL.createObjectURL(event.target.files[0]);
      setNewPetPhotos([...newPetPhotos, file]);
    }
  };

  return (
    <Grid
      container
      component="main"
      sx={{ height: "100vh", backgroundColor: "white" }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            color="textPrimary"
          >
            User Profile
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4} textAlign="center">
            <Avatar
              alt={username}
              src={profilePhoto}
              sx={{ width: 120, height: 120, margin: "auto" }}
            />
            <Typography
              variant="h6"
              component="h2"
              sx={{ mt: 2 }}
              color="textPrimary"
            >
              {username}
            </Typography>
            <Typography variant="body1" color="textPrimary">
              {email}
            </Typography>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => setEditMode(!editMode)}
              sx={{ mt: 2 }}
            >
              {editMode ? "Save Changes" : "Edit Profile"}
            </Button>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="textPrimary">
                  Bio
                </Typography>
                {editMode ? (
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    defaultValue={bio}
                    variant="outlined"
                    label="Your bio"
                  />
                ) : (
                  <Typography variant="body1" color="textPrimary">
                    {bio}
                  </Typography>
                )}
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="textPrimary">
                  Pet Photos
                </Typography>
                <Grid container spacing={2}>
                  {newPetPhotos.map((photo, index) => (
                    <Grid item xs={4} key={index}>
                      <img
                        src={photo}
                        alt={`pet-${index}`}
                        style={{ width: "100%", borderRadius: "8px" }}
                      />
                    </Grid>
                  ))}

                  {editMode && (
                    <Grid item xs={4}>
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="label"
                      >
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={handleAddPetPhoto}
                        />
                        <PhotoCamera />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="textPrimary">
                  Reviews
                </Typography>
                {reviews.length === 0 ? (
                  <Typography variant="body1" color="textPrimary">
                    No reviews yet.
                  </Typography>
                ) : (
                  reviews.map((review, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textPrimary">
                        Rating: {review.rating} / 5
                      </Typography>
                      <Typography variant="body1" color="textPrimary">
                        {review.comment}
                      </Typography>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
};

export default UserProfile;
