"use client";

import React from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";

import { useRouter } from "next/navigation";

const SignUp: React.FC = () => {
  const [name, setName] = React.useState<string>("");
  const [surname, setSurname] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const router = useRouter();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSurnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSurname(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSignUpButton = async () => {
    const response = axios.post("http://127.0.0.1:5001/register", {
      name: name,
      surname: surname,
      email: email,
      password: password,
    });

    if (await response) {
      router.push("/signin");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", boxShadow: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            Create a New Account
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              margin="normal"
              placeholder="Enter your name"
              onChange={handleNameChange}
            />
            <TextField
              fullWidth
              label="Surname"
              variant="outlined"
              margin="normal"
              placeholder="Enter your surname"
              onChange={handleSurnameChange}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              type="email"
              placeholder="Enter your email"
              onChange={handleEmailChange}
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              placeholder="Create a password"
              onChange={handlePasswordChange}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: "#ff3b30",
                "&:hover": {
                  bgcolor: "#ff3b30",
                },
              }}
              onClick={handleSignUpButton}
            >
              Sign Up
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
    // <Box
    //   sx={{
    //     minHeight: "100vh",
    //     backgroundColor: "white",
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >
    //   <Container component="main" maxWidth="xs">
    //     <CssBaseline />
    //     <Box
    //       sx={{
    //         marginTop: 8,
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "center",
    //       }}
    //     >
    //       <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
    //         <LockOutlinedIcon />
    //       </Avatar>
    //       <Typography component="h1" variant="h5">
    //         Sign up
    //       </Typography>
    //       <Box component="form" noValidate sx={{ mt: 3 }}>
    //         <Grid container spacing={2}>
    //           <Grid item xs={12} sm={6}>
    //             <TextField
    //               autoComplete="fname"
    //               name="firstName"
    //               variant="outlined"
    //               required
    //               fullWidth
    //               id="firstName"
    //               label="First Name"
    //               autoFocus
    //             />
    //           </Grid>
    //           <Grid item xs={12} sm={6}>
    //             <TextField
    //               variant="outlined"
    //               required
    //               fullWidth
    //               id="lastName"
    //               label="Last Name"
    //               name="lastName"
    //               autoComplete="lname"
    //             />
    //           </Grid>
    //           <Grid item xs={12}>
    //             <TextField
    //               variant="outlined"
    //               required
    //               fullWidth
    //               id="email"
    //               label="Email Address"
    //               name="email"
    //               autoComplete="email"
    //             />
    //           </Grid>
    //           <Grid item xs={12}>
    //             <TextField
    //               variant="outlined"
    //               required
    //               fullWidth
    //               name="password"
    //               label="Password"
    //               type="password"
    //               id="password"
    //               autoComplete="current-password"
    //             />
    //           </Grid>
    //           <Grid item xs={12}>
    //             <FormControlLabel
    //               control={
    //                 <Checkbox value="allowExtraEmails" color="primary" />
    //               }
    //               label="I want to receive inspiration, marketing promotions, and updates via email."
    //             />
    //           </Grid>
    //         </Grid>
    //         <Button
    //           type="submit"
    //           fullWidth
    //           variant="contained"
    //           color="primary"
    //           sx={{ mt: 3, mb: 2 }}
    //         >
    //           Sign Up
    //         </Button>
    //         <Grid container justifyContent="flex-end">
    //           <Grid item>
    //             <Link href="/" variant="body2">
    //               Already have an account? Sign in
    //             </Link>
    //           </Grid>
    //         </Grid>
    //       </Box>
    //     </Box>
    //   </Container>
    // </Box>
  );
};

export default SignUp;
