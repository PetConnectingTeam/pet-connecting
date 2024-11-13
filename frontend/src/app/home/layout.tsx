"use client";

import React from "react";
import NavigationBar from "../components/appBar";
import SideBar from "../components/bar-sidebar";
import BottomBar from "../components/BottomBar";
import { CssBaseline, Box } from "@mui/material";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CssBaseline />

      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1300 }}>
        <NavigationBar />
      </Box>

      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <SideBar />
      </Box>

      <Box
        sx={{
          minHeight: "100vh",
          pt: "64px",
          pb: "56px",
          overflow: "auto",
        }}
      >
        {children}
      </Box>
      <Box
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1400 }}
      >
        <BottomBar />
      </Box>
    </>
  );
}
