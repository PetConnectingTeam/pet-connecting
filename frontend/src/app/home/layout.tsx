"use client";

import React from "react";
import MenuAppBar from "../components/appBar";
import SideBar from "../components/bar-sidebar";
import { CssBaseline, Box } from "@mui/material";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Box sx={{ minHeight: "100vh" }}>
        <CssBaseline />
        <MenuAppBar />
        <SideBar />
        {children}
      </Box>
    </>
  );
}
