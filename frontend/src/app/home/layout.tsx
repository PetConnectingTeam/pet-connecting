"use client";

import React from "react";
import NavigationBar from "../components/appBar";
import SideBar from "../components/bar-sidebar";
import Review from "../components/review"
import { CssBaseline, Box } from "@mui/material";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Box sx={{ minHeight: "100vh" }}>
      
        <CssBaseline />
        <NavigationBar />
        <SideBar />
        
        {children}
        <Review/>

      </Box>
    </>
  );
}
