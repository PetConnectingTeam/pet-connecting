import React from "react";
import {
  Button,
  TextField,
  FormControlLabel,
  Box,
  Typography,
  FormControl,
  Card,
  CardContent,
  RadioGroup,
  Radio,
} from "@mui/material";

const SignUp: React.FC = () => {
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
              label="Full Name"
              variant="outlined"
              margin="normal"
              placeholder="Enter your name"
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              type="email"
              placeholder="Enter your email"
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              placeholder="Create a password"
            />
            <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                I am a:
              </Typography>
              <RadioGroup row>
                <FormControlLabel
                  value="petOwner"
                  control={<Radio />}
                  label="Pet Owner"
                />
                <FormControlLabel
                  value="serviceProvider"
                  control={<Radio />}
                  label="Service Provider"
                />
              </RadioGroup>
            </FormControl>
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
