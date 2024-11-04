"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  CircularProgress,
  Divider,
  Button,
  Modal
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

interface Aplication {
  Accepted: boolean;
  ServiceId: number;
  UserId: number;
}

interface PhotoState {
  ID: number;
  MimeType: string;
  PetID: number;
  Photo: string;
}

const HomePage: React.FC = () => {
  const [aplications, setAplications] = useState<Aplication[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [applicationsForService, setApplicationsForService] = useState<Aplication[]>([]);
  const [NotapplicationsForService, setNotApplicationsForService] = useState<Aplication[]>([]);

  const UserId = Number(Cookies.get("user_id"));

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

    const fetchAplications = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await axios.get("http://127.0.0.1:5001/service/applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (Array.isArray(response.data)) {
          setAplications(response.data);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
    fetchAplications();
  }, []);

  // Filtrar servicios por aceptar y servicios solicitados
  const servicesToAccept = services.filter((service) =>
    aplications.some((aplication) => aplication.ServiceId === service.ServiceId && aplication.UserId === UserId)
  );

  const servicesRequested = services.filter((service) => service.PublisherId === UserId);

  const handleOpenModal = async (serviceId: number) => {
    setSelectedServiceId(serviceId);
    setOpenModal(true);
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`http://127.0.0.1:5001/service/${serviceId}/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (Array.isArray(response.data)) {
        setApplicationsForService(response.data);

        // Verificar si hay alguna aplicación aceptada
        const accepted = response.data.some((app: Aplication) => app.Accepted);

      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };
    // Función para cerrar el modal
    const handleCloseModal = () => {
      setOpenModal(false);
      setApplicationsForService([]);
    };

// Función para aceptar una solicitud
const handleAcceptApplication = async (userId: number) => {
  if (!selectedServiceId) return;
  
  try {
    const token = Cookies.get("accessToken");
    await axios.put(
      `http://127.0.0.1:5001/service/${selectedServiceId}/assign`,
      { taker_id: userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    alert("Application accepted successfully!");

    // Opcional: actualizar el estado de aplicaciones o recargar la lista
    setApplicationsForService((prev) =>
      prev.map((app) => (app.UserId === userId ? { ...app, Accepted: true } : app))
    );
  } catch (error) {
    console.error("Error accepting application:", error);
    alert("Failed to accept application.");
  }
};
// Función para cancelar una solicitud
const handleUnAcceptApplication = async (userId: number) => {
  if (!selectedServiceId) return;
  
  try {
    const token = Cookies.get("accessToken");
    await axios.put(
      `http://127.0.0.1:5001/service/${selectedServiceId}/unassign`,
      { taker_id: userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    alert("Application unaccepted successfully!");

    // Opcional: actualizar el estado de aplicaciones o recargar la lista
    setApplicationsForService((prev) =>
      prev.map((app) => (app.UserId === userId ? { ...app, Accepted: false } : app))
    );
  } catch (error) {
    console.error("Error cancel application:", error);
    alert("Failed to cancel application.");
  }
};
  

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
          padding: 2,
        }}
      >
        <Container sx={{ flex: 1, marginRight: 2 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Stack
              spacing={3}
              paddingTop={5}
              sx={{
                flexDirection: "column",
                alignItems: "center",
                "& > :not(style)": {
                  width: "100%",
                  maxWidth: "700px",
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
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
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
                        <Typography variant="body1" sx={{ fontWeight: "bold", color: "#14171A" }}>
                          Amelie Shiba
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#657786" }}>
                          {new Date(service.publishDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
  
                    <Typography variant="body1" sx={{ color: "#14171A", fontWeight: "bold", marginBottom: 2 }}>
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
                        🗓 {new Date(service.serviceDateIni).toLocaleDateString()} -{" "}
                        {new Date(service.serviceDateEnd).toLocaleDateString()}
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
  
                    <Box
                      sx={{
                        display: "flex",
                        overflowX: "auto",
                        gap: 1,
                        padding: 1,
                      }}
                    >
                      {service.photos.length > 0 ? (
                        service.photos.map((photo, index) => (
                          <Box
                            key={index}
                            sx={{
                              minWidth: "100px",
                              height: "100px",
                              borderRadius: "8px",
                              overflow: "hidden",
                              flexShrink: 0,
                              border: "1px solid #ddd",
                            }}
                          >
                            <a href={`/pets/${photo.PetID}`} target="_blank" rel="noopener noreferrer">
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
  
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <button style={{ border: "none", background: "transparent" }}>👍 Like 18</button>
                        <button style={{ border: "none", background: "transparent", marginLeft: 15 }}>💬 Comment 2</button>
                        <button style={{ border: "none", background: "transparent", marginLeft: 15 }}>🔄 Share 0</button>
                      </Box>
                      <Typography variant="body2" sx={{ color: "#657786" }}>...</Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Stack>
          )}
        </Container>
  
        <Box sx={{ width: "300px", marginLeft: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 1 }}>
            Services where you applied
          </Typography>
          <Stack spacing={2}>
            {servicesToAccept.length > 0 ? (
              servicesToAccept.map((service) => {
                const application = aplications.find(
                  (aplication) =>
                    aplication.ServiceId === service.ServiceId &&
                    aplication.UserId === UserId
                );
  
                return (
                  <Box
                    key={service.ServiceId}
                    sx={{
                      padding: 2,
                      bgcolor: application?.Accepted ? "#b1fcb2" : "#ffebee",
                      borderRadius: 2,
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      border: "1px solid #e1e8ed",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: "bold", color: "#14171A" }}>
                      {service.description}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#657786" }}>
                      🐾 Pets: {Array.isArray(service.pets) ? service.pets.join(", ") : "N/A"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: application?.Accepted ? "#4caf50" : "#e0245e",
                        fontWeight: "bold",
                      }}
                    >
                      {application?.Accepted ? "Approved" : "Application pending approval"}
                    </Typography>
                  </Box>
                );
              })
            ) : (
              <Typography variant="body2" sx={{ color: "#657786" }}>
                No hay servicios por aceptar.
              </Typography>
            )}
          </Stack>
          <Divider sx={{ my: 3 }} />
  
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 1 }}>
            Services published
          </Typography>
          <Stack spacing={2}>
            {servicesRequested.length > 0 ? (
              servicesRequested.map((service) => (
                <Box
                  key={service.ServiceId}
                  sx={{
                    padding: 2,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #e1e8ed",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: "#14171A" }}>
                    {service.description}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#657786" }}>
                    🐾 Pets: {service.pets.join(", ")}
                  </Typography>
  
                  {/* Botón para ver aplicaciones */}
                  {!service.completed &&   (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenModal(service.ServiceId)}
                  sx={{ marginTop: 2 }}
                >
                  View Applications
                </Button>
              )}
                </Box>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: "#657786" }}>
                No has solicitado ningún servicio.
              </Typography>
            )}
          </Stack>
  
          {/* Modal para mostrar las aplicaciones */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Applications for Service {selectedServiceId}
          </Typography>
          {applicationsForService.length > 0 ? (
          applicationsForService.map((application) => (
            <Box
              key={application.UserId}
              sx={{
                mb: 1,
                p: 2,
                bgcolor: application.Accepted ? "#e8f5e9" : "#ffebee",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" sx={{ color: application.Accepted ? "#4caf50" : "#e0245e" }}>
                User ID: {application.UserId} - {application.Accepted ? "Approved" : "Pending Approval"}
              </Typography>
              {!application.Accepted ? (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    const confirmed = window.confirm("Are you sure you want to accept this application?");
                    if (confirmed) {
                      handleAcceptApplication(application.UserId);
                    }
                  }}
                >
                  Accept
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    const confirmed = window.confirm("Are you sure you want to cancel this application?");
                    if (confirmed) {
                      handleUnAcceptApplication(application.UserId);
                    }
                  }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          ))
        ) : (
          <Typography variant="body2" sx={{ mt: 2 }}>
            No applications available for this service.
          </Typography>
        )}
          <Button onClick={handleCloseModal} sx={{ mt: 2 }} variant="contained" color="secondary">
            Close
          </Button>
        </Box>
      </Modal>
        </Box>
      </Box>
    );
  };

export default HomePage;
