"use client";

import React, { useState, useEffect } from "react";
import NavigationBar from "../components/appBar";
import SideBar from "../components/bar-sidebar";
import BottomBar from "../components/BottomBar";
import ChatComp from "../components/chat";
import { CssBaseline, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isChatVisible, setIsChatVisible] = useState(!isMobile);

  useEffect(() => {
    if (isMobile) {
      setIsChatVisible(false);
    } else {
      setIsChatVisible(true);
    }
  }, [isMobile]);

  const toggleChat = () => {
    if (isMobile) {
      setIsChatVisible((prev) => !prev);
    }
  };

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
          paddingTop: "40px",
          overflow: "auto",
          bgcolor: "#F5F8FA",
        }}
      >
        {children}
      </Box>
      {isChatVisible && (
        <Box>
          <ChatComp />
        </Box>
      )}
      {isMobile && (
        <Box
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1400 }}
        >
          <BottomBar toggleChat={toggleChat} />
        </Box>
      )}
    </>
  );
}
