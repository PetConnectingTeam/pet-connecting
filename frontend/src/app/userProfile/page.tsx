"use client";
import React from "react";
import {
  Avatar,
  Button,
  Container,
  TextField,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CssBaseline,
} from "@mui/material";
import MenuAppBar from "../components/appBar";

interface UserProfileProps {
  username: string;
  bio: string;
  email: string;
  profilePhoto: string;
  petPhotos: string[];
  reviews: { rating: number; comment: string }[];
}

const UserProfile: React.FC<UserProfileProps> = (
  {
    // username,
    // bio,
    // email,
    // profilePhoto,
    // petPhotos,
    // reviews,
  }
) => {
  // const [newPetPhotos, setNewPetPhotos] = useState<string[]>(petPhotos);

  // const handleAddPetPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     const file = URL.createObjectURL(event.target.files[0]);
  //     setNewPetPhotos([...newPetPhotos, file]);
  //   }
  // };

  return (
    <>
      <CssBaseline />
      <MenuAppBar></MenuAppBar>
      <Box sx={{ flexGrow: 1 }}>
        <Container
          maxWidth={false}
          sx={{ backgroundColor: "white", height: "100vh" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "flex-start",
              gap: 4,
              backgroundColor: "white",
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: { xs: "100%", md: "200px" },
                paddingTop: 10,
              }}
            >
              <Avatar
                src="/placeholder.svg?height=200&width=200"
                sx={{ width: 200, height: 200, mb: 2 }}
              />
              <Button
                sx={{
                  backgroundColor: "#ff4d4f",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#ff7875",
                  },
                }}
                variant="contained"
              >
                Change Picture
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, paddingTop: 10 }}>
              <form>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  defaultValue="Alex Johnson"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  defaultValue="alex.johnson@example.com"
                  margin="normal"
                />
                <FormControl component="fieldset" margin="normal">
                  <FormLabel component="legend">User Type</FormLabel>
                  <RadioGroup defaultValue="petOwner" name="userType">
                    <FormControlLabel
                      value="petOwner"
                      control={<Radio />}
                      label="Pet Owner"
                    />
                    <FormControlLabel
                      value="veterinarian"
                      control={<Radio />}
                      label="Veterinarian"
                    />
                  </RadioGroup>
                </FormControl>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
                    gap: 2,
                  }}
                >
                  <Button variant="outlined">Edit Profile</Button>
                  <Button
                    sx={{
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#ff7875",
                      },
                    }}
                    variant="contained"
                  >
                    Save Changes
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
    // <>
    //   <MenuAppBar></MenuAppBar>
    //   <Grid
    //     container
    //     component="main"
    //     sx={{ height: "100vh", backgroundColor: "white" }}
    //   >
    //     <Container maxWidth="md">
    //       <Box sx={{ textAlign: "center", mb: 4 }}>
    //         <Typography
    //           variant="h4"
    //           component="h1"
    //           gutterBottom
    //           color="textPrimary"
    //         >
    //           User Profile
    //         </Typography>
    //       </Box>

    //       <Grid container spacing={3}>
    //         <Grid item xs={12} md={4} textAlign="center">
    //           <Avatar
    //             alt={username}
    //             src={profilePhoto}
    //             sx={{ width: 120, height: 120, margin: "auto" }}
    //           />
    //           <Typography
    //             variant="h6"
    //             component="h2"
    //             sx={{ mt: 2 }}
    //             color="textPrimary"
    //           >
    //             {username}
    //           </Typography>
    //           <Typography variant="body1" color="textPrimary">
    //             {email}
    //           </Typography>

    //           <Button
    //             variant="outlined"
    //             color="primary"
    //             onClick={() => setEditMode(!editMode)}
    //             sx={{ mt: 2 }}
    //           >
    //             {editMode ? "Save Changes" : "Edit Profile"}
    //           </Button>
    //         </Grid>

    //         <Grid item xs={12} md={8}>
    //           <Card>
    //             <CardContent>
    //               <Typography variant="h6" gutterBottom color="textPrimary">
    //                 Bio
    //               </Typography>
    //               {editMode ? (
    //                 <TextField
    //                   fullWidth
    //                   multiline
    //                   minRows={3}
    //                   defaultValue={bio}
    //                   variant="outlined"
    //                   label="Your bio"
    //                 />
    //               ) : (
    //                 <Typography variant="body1" color="textPrimary">
    //                   {bio}
    //                 </Typography>
    //               )}
    //             </CardContent>
    //           </Card>

    //           <Card sx={{ mt: 3 }}>
    //             <CardContent>
    //               <Typography variant="h6" gutterBottom color="textPrimary">
    //                 Pet Photos
    //               </Typography>
    //               <Grid container spacing={2}>
    //                 {newPetPhotos?.map((photo, index) => (
    //                   <Grid item xs={4} key={index}>
    //                     <img
    //                       src={photo}
    //                       alt={`pet-${index}`}
    //                       style={{ width: "100%", borderRadius: "8px" }}
    //                     />
    //                   </Grid>
    //                 ))}

    //                 {editMode && (
    //                   <Grid item xs={4}>
    //                     <IconButton
    //                       color="primary"
    //                       aria-label="upload picture"
    //                       component="label"
    //                       ne
    //                     >
    //                       <input
    //                         hidden
    //                         accept="image/*"
    //                         type="file"
    //                         onChange={handleAddPetPhoto}
    //                       />
    //                       <PhotoCamera />
    //                     </IconButton>
    //                   </Grid>
    //                 )}
    //               </Grid>
    //             </CardContent>
    //           </Card>

    //           <Card sx={{ mt: 3 }}>
    //             <CardContent>
    //               <Typography variant="h6" gutterBottom color="textPrimary">
    //                 Reviews
    //               </Typography>
    //               {reviews?.length === 0 ? (
    //                 <Typography variant="body1" color="textPrimary">
    //                   No reviews yet.
    //                 </Typography>
    //               ) : (
    //                 reviews?.map((review, index) => (
    //                   <Box key={index} sx={{ mb: 2 }}>
    //                     <Typography variant="body2" color="textPrimary">
    //                       Rating: {review.rating} / 5
    //                     </Typography>
    //                     <Typography variant="body1" color="textPrimary">
    //                       {review.comment}
    //                     </Typography>
    //                   </Box>
    //                 ))
    //               )}
    //             </CardContent>
    //           </Card>
    //         </Grid>
    //       </Grid>
    //     </Container>
    //   </Grid>
    // </>
  );
};

export default UserProfile;
