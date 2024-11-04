"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

interface Service {
  PublisherId: number;
  ServiceId: number;
  address: string;
  completed: boolean;
  cost: string;
  description: string;
  pets: number[];
  publishDate: string;
  serviceDateEnd: string;
  serviceDateIni: string;
  photos: PhotoState[];
}

interface PhotoState {
  ID: number;
  MimeType: string;
  PetID: number;
  Photo: string;
}

const HomePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await axios.get("http://127.0.0.1:5001/services", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (Array.isArray(response.data)) {
          setServices(response.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <Box
      sx={{
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <Container>
        {loading ? (
          <CircularProgress />
        ) : (
          <Stack
            spacing={3}
            paddingTop={5}
            sx={{
              flexDirection: "column", // Cambiado para apilar servicios verticalmente
              alignItems: "center",
              "& > :not(style)": {
                width: "100%",
                maxWidth: "700px", // Ajustar ancho máximo de cada servicio
              },
            }}
          >
            {services.length === 0 ? (
              <Typography variant="h6">No se encontraron servicios.</Typography>
            ) : (
              services.map((service) => (
                <Box
                  key={service.ServiceId}
                  sx={{
                    padding: 2,
                    bgcolor: "#f5f8fa",
                    borderRadius: 2,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #e1e8ed",
                    width: "100%",
                  }}
                >
                  {/* Encabezado del servicio */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <img
                      src="profile_picture_url"
                      alt="Profile"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    />
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", color: "#14171A" }}
                      >
                        Amelie Shiba
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#657786" }}>
                        Thursday, 17 August 10:40 AM
                      </Typography>
                    </Box>
                  </Box>

                  {/* Descripción y detalles del servicio */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#14171A",
                      fontWeight: "bold",
                      marginBottom: 2,
                    }}
                  >
                    {service.description}
                  </Typography>
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body2" sx={{ color: "#657786" }}>
                      📍 {service.address}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#657786" }}>
                      💸 {service.cost} Points
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#657786" }}>
                      🗓 {new Date(service.serviceDateIni).toLocaleDateString()}{" "}
                      - {new Date(service.serviceDateEnd).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#657786" }}>
                      🐾 Pets: {service.pets.join(", ")}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        color: service.completed ? "#17bf63" : "#e0245e",
                      }}
                    >
                      {service.completed ? "✅ Completado" : "⏳ Pendiente"}
                    </Typography>
                  </Box>

                  {/* Galería de fotos */}
                  <Box
                    sx={{
                      display: "flex",
                      overflowX: "auto", // Añadido para permitir desplazamiento horizontal
                      gap: 1,
                      padding: 1,
                    }}
                  >
                    {service.photos.length > 0 ? (
                      service.photos.map((photo, index) => (
                        <Box
                          key={index}
                          sx={{
                            minWidth: "100px", // Tamaño de cada imagen
                            height: "100px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            flexShrink: 0,
                            border: "1px solid #ddd",
                          }}
                        >
                          <a
                            href={`/petsProfile/${photo.PetID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={`data:${photo.MimeType};base64,${photo.Photo}`}
                              alt={`Pet Image ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </a>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ color: "#657786" }}>
                        No images available
                      </Typography>
                    )}
                  </Box>

                  {/* Sección de interacciones */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#000000",
                      }}
                    >
                      <button
                        style={{
                          border: "none",
                          background: "transparent",
                        }}
                      >
                        👍 Like
                      </button>
                      <button
                        style={{
                          border: "none",
                          background: "transparent",
                          marginLeft: 15,
                        }}
                      >
                        💬 Comment
                      </button>
                      <button
                        style={{
                          border: "none",
                          background: "transparent",
                          marginLeft: 15,
                        }}
                      >
                        🔄 Share
                      </button>
                    </Box>
                    <Typography variant="body2" sx={{ color: "#657786" }}>
                      ...
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
