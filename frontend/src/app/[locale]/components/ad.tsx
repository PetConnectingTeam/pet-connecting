"use client";

import React, { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import Cookies from "js-cookie";

const AD: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const roleId = Cookies.get("role_id");

  const images = [
    "data:image/png;base64,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",
    "data:image/png;base64,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",
  ];

  useEffect(() => {
    if (roleId === "basic") {
      const interval = setInterval(() => {
        const randomImage = images[Math.floor(Math.random() * images.length)];
        setImage(randomImage);
        setOpen(true);
      }, 30000); // Mostrar cada 30 segundos

      return () => clearInterval(interval); // Limpiar al desmontar
    }
  }, [roleId]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          p: 4,
          boxShadow: 24,
          maxWidth: "90vw",
          maxHeight: "90vh",
        }}
      >
        <img
          src={image}
          alt="Advertisement"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </Box>
    </Modal>
  );
};

export default AD;