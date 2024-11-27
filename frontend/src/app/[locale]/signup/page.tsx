"use client";

import React from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import portrait from "../../../../public/portrait.png";
import logo from "../../../../public/Logo2.png";

const SignUp: React.FC = () => {
  const [name, setName] = React.useState<string>("");
  const [surname, setSurname] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const router = useRouter();
  const t = useTranslations("SignUp");

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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#f5f5f5",
        backgroundImage: `url(${portrait.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 1,
        padding: isMobile ? 2 : 0,
      }}
    >
      <Box sx={{ padding: isMobile ? 2 : 0 }}>
        <img src={logo.src} height={85} width={85} alt="PetConnecting" />
        <Card sx={{ maxWidth: 400, width: "100%", boxShadow: 3, zIndex: 2 }}>
          <CardContent>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              align="center"
              sx={{ fontWeight: "bold", mb: 3, color: "#4b887c" }}
            >
              {t("create_new_account")}
            </Typography>
            <Box component="form" noValidate autoComplete="off">
              <TextField
                fullWidth
                label={t("name")}
                variant="outlined"
                margin="normal"
                placeholder={t("enter_your_name")}
                onChange={handleNameChange}
              />
              <TextField
                fullWidth
                label={t("surname")}
                variant="outlined"
                margin="normal"
                placeholder={t("enter_your_surname")}
                onChange={handleSurnameChange}
              />
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                type="email"
                placeholder={t("enter_your_email")}
                onChange={handleEmailChange}
              />
              <TextField
                fullWidth
                label={t("password")}
                variant="outlined"
                margin="normal"
                type="password"
                placeholder={t("enter_your_password")}
                onChange={handlePasswordChange}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: "#4b887c",
                  "&:hover": {
                    bgcolor: "#3c6b62",
                  },
                }}
                onClick={handleSignUpButton}
              >
                {t("sign_up")}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default SignUp;
