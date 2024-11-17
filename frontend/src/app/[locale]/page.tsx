"use client";

import {
  Box,
  Button,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import portrait from "../../../public/illustration.png";

function App() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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
    <Grid container sx={{ minHeight: "100vh" }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{ backgroundColor: "#ff2f2f", color: "#fff", p: 4 }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          textAlign="center"
        >
          <Image src={portrait} alt="Illustration" width={512} height={512} />
          <Typography variant="h4" fontWeight="bold" mb={2}>
            PetConnecting: Connect with Pet
          </Typography>
          <Typography variant="body1">
            All your pet&apos;s needs in one place.
          </Typography>
        </Box>
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        backgroundColor="#ffffff"
      >
        <Box sx={{ maxWidth: "400px", width: "100%", p: 4 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={3}
            align="center"
            sx={{
              color: "#000000",
            }}
          >
            Log in
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={handleEmailChange}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={handlePasswordChange}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#ff2f2f",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#ff2f2f",
              },
            }}
            onClick={handleSignInButton}
          >
            Log in
          </Button>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" sx={{ mt: 2, color: "#000000", ml: 5 }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" sx={{ color: "#ff3b30" }}>
              Create account
            </Link>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default App;
