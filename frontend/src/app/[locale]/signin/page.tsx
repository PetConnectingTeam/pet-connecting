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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import portrait from "../../../../public/portrait.png";

import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import logo from "../../../../public/Logo2.png";
import { useTranslations } from "next-intl";

const SignInSide: React.FC = () => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const router = useRouter();
  const t = useTranslations("Sigin");
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
    Cookies.set("role_id", response.data.role, {
      expires: expirationTime,
      path: "/",
    });


    if (response) {
      router.push("/home");
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        width: "100vw",
        backgroundImage: `url(${portrait.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 1,
        padding: isMobile ? "20px" : "0px",
      }}
    >
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <Image src={logo} height={85} width={85} alt="PetConnecting" />
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", color: "#000000", marginLeft: 1 }}
        >
          PetConnecting
        </Typography>
      </Box>
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          maxHeigh: 200,
          padding: "24px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
          height: isMobile ? "auto" : "100%",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="h2"
            align="center"
            sx={{ mb: 3, fontWeight: "bold", color: "#4b887c" }}
          >
            {t("welcom_back")}
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
              placeholder={t("enter_your_email")}
              onChange={handleEmailChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t("password")}
              type="password"
              id="password"
              autoComplete="current-password"
              placeholder={t("enter_your_password")}
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
                {t("forgot_password")}
              </Link>
              <Button
                type="button"
                variant="contained"
                sx={{
                  bgcolor: "#4b887c",
                  "&:hover": {
                    bgcolor: "#3c6b62",
                  },
                }}
                onClick={handleSignInButton}
              >
                {t("login")}
              </Button>
            </Box>
          </Box>
        </CardContent>
        <Typography variant="body2" sx={{ mt: 2, paddingLeft: "46px" }}>
          {t("dont_have_account")}{" "}
          <Link href="/signup" sx={{ color: "#ff3b30" }}>
            {t("create_account")}
          </Link>
        </Typography>
      </Card>
    </Box>
  );
};

export default SignInSide;
