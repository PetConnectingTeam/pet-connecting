"use client";

import React from "react";
import {
  Button,
  TextField,
  Link,
  Box,
  Card,
  Typography,
  CardContent,
} from "@mui/material";

import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

// const Logo = (props) => (
//   <SvgIcon {...props} viewBox="0 0 24 24">
//     <path d="M12,2C6.47,2,2,6.47,2,12s4.47,10,10,10s10-4.47,10-10S17.53,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8 S16.41,20,12,20z" />
//     <path d="M15.5,11c0.83,0,1.5-0.67,1.5-1.5S16.33,8,15.5,8S14,8.67,14,9.5S14.67,11,15.5,11z" />
//     <path d="M8.5,11c0.83,0,1.5-0.67,1.5-1.5S9.33,8,8.5,8S7,8.67,7,9.5S7.67,11,8.5,11z" />
//     <path d="M12,14c-2.33,0-4.31,1.46-5.11,3.5h10.22C16.31,15.46,14.33,14,12,14z" />
//   </SvgIcon>
// );

const SignInSide: React.FC = () => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const router = useRouter();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSignInButton = async () => {
    const response = await axios.post("http://127.0.0.1:5001/login", {
      email: email,
      password: password,
    });

    const expirationTime = new Date(
      new Date().getTime() + 24 * 60 * 60 * 1000 // 24 hours
    );

    Cookies.set("accessToken", response.data.access_token, {
      expires: expirationTime,
      path: "/",
    });

    Cookies.set("email", email, {
      expires: expirationTime,
      path: "/",
    });
    Cookies.set("user_id", response.data.user_id, {
      expires: expirationTime,
      path: "/",
    });

    if (response) {
      router.push("/home");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        {/* <Logo sx={{ fontSize: 40, color: "#ff3b30", mr: 1 }} /> */}
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          PetCareConnect
        </Typography>
      </Box>
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          padding: "24px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="h2"
            align="center"
            sx={{ mb: 3, fontWeight: "bold" }}
          >
            Welcome Back
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              placeholder="Enter your email"
              onChange={handleEmailChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              onChange={handlePasswordChange}
            />
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Link href="#" variant="body2" sx={{ color: "#ff3b30" }}>
                Forgot password?
              </Link>
              <Button
                type="button"
                variant="contained"
                sx={{
                  bgcolor: "#ff3b30",
                  "&:hover": {
                    bgcolor: "#ff3b30",
                  },
                }}
                onClick={handleSignInButton}
              >
                Login
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" sx={{ color: "#ff3b30" }}>
          Create account
        </Link>
      </Typography>
    </Box>
    // <Grid
    //   container
    //   component="main"
    //   sx={{ height: "100vh", backgroundColor: "white" }}
    // >
    //   <CssBaseline />
    //   <Grid
    //     item
    //     xs={12}
    //     sm={8}
    //     md={5}
    //     component={Paper}
    //     elevation={6}
    //     square
    //     sx={{
    //       display: "flex",
    //       flexDirection: "column",
    //       alignItems: "center",
    //       justifyContent: "center",
    //       padding: 4,
    //     }}
    //   >
    //     <Box
    //       sx={{
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "center",
    //         width: "100%",
    //       }}
    //     >
    //       <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
    //         <LockOutlinedIcon />
    //       </Avatar>
    //       <Typography component="h1" variant="h5">
    //         Sign in
    //       </Typography>
    //       <Box component="form" noValidate sx={{ mt: 1, width: "100%" }}>
    //         <TextField
    //           variant="outlined"
    //           margin="normal"
    //           required
    //           fullWidth
    //           id="email"
    //           label="Email Address"
    //           name="email"
    //           autoComplete="email"
    //           autoFocus
    //         />
    //         <TextField
    //           variant="outlined"
    //           margin="normal"
    //           required
    //           fullWidth
    //           name="password"
    //           label="Password"
    //           type="password"
    //           id="password"
    //           autoComplete="current-password"
    //         />
    //         <FormControlLabel
    //           control={<Checkbox value="remember" color="primary" />}
    //           label="Remember me"
    //         />
    //         <Button
    //           type="submit"
    //           fullWidth
    //           variant="contained"
    //           color="primary"
    //           sx={{ mt: 3, mb: 2 }}
    //         >
    //           Sign In
    //         </Button>
    //         <Grid container>
    //           <Grid item xs>
    //             <Link href="#" variant="body2">
    //               Forgot password?
    //             </Link>
    //           </Grid>
    //           <Grid item>
    //             <Link href="/signup" variant="body2">
    //               {"Don't have an account? Sign Up"}
    //             </Link>
    //           </Grid>
    //         </Grid>
    //       </Box>
    //     </Box>
    //   </Grid>
    // </Grid>
  );
};

export default SignInSide;
