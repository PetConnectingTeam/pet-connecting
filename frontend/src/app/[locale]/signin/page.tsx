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
import Image from "next/image";
import logo from "../../../../public/logo.png";

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
        <Image src={logo} height={50} width={50} alt="PetCareConnect" />
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", color: "#000000", marginLeft: 2 }}
        >
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
  );
};

export default SignInSide;
