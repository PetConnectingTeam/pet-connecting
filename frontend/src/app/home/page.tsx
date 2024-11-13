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
  Modal,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

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
  publisher: string;
  profilePhotoMimeType: string | undefined;
  profilePhotoBase64: string | undefined;
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
interface User {
  email: string;
  id: number;
  image_mimetype: string | null;
  name: string;
  profile_image_base64: string | null;
  rating: number;
}

const HomePage: React.FC = () => {
  const [aplications, setAplications] = useState<Aplication[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [serviceInfo, setServiceInfo] = useState<Service | null>(null); // Nuevo estado para almacenar la información del servicio
  const [applicationsForService, setApplicationsForService] = useState<
    Aplication[]
  >([]);

  const UserId = Number(Cookies.get("user_id"));

  const searchParams = useSearchParams();
  const animal_type = searchParams.get("animal_type");

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

        // Obtener usuarios
        const usersResponse = await axios.get("http://127.0.0.1:5001/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(usersResponse.data)) {
          response.data.forEach((service: Service) => {
            const user = usersResponse.data.find(
              (user: User) => user.id === service.PublisherId
            );

            setServices((prev) =>
              prev.map((prevService) =>
                prevService.ServiceId === service.ServiceId
                  ? {
                      ...prevService,
                      profilePhotoMimeType: user?.image_mimetype,
                      profilePhotoBase64: user?.profile_image_base64,
                    }
                  : prevService
              )
            );
          });
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
        const response = await axios.get(
          "http://127.0.0.1:5001/service/applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
    aplications.some(
      (aplication) =>
        aplication.ServiceId === service.ServiceId &&
        aplication.UserId === UserId
    )
  );

  const servicesRequested = services.filter(
    (service) => service.PublisherId === UserId
  );

  const handleOpenModal = async (serviceId: number) => {
    setSelectedServiceId(serviceId);
    setOpenModal(true);
    try {
      const token = Cookies.get("accessToken");

      // Obtener las aplicaciones para el servicio
      const applicationResponse = await axios.get(
        `http://127.0.0.1:5001/service/${serviceId}/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (Array.isArray(applicationResponse.data)) {
        setApplicationsForService(applicationResponse.data);
      }

      // Obtener todos los servicios y encontrar el que coincide con `serviceId`
      const servicesResponse = await axios.get(
        "http://127.0.0.1:5001/services",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(servicesResponse.data)) {
        const selectedService = servicesResponse.data.find(
          (service: Service) => service.ServiceId === serviceId
        );
        setServiceInfo(selectedService || null); // Almacenar el servicio específico o null si no se encuentra
      }
    } catch (error) {
      console.error("Error fetching applications or service info:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setApplicationsForService([]);
    setServiceInfo(null); // Resetear la información del servicio
  };

  // Función para aceptar una solicitud
  const handleAcceptApplication = async (userId: number) => {
    if (!selectedServiceId) return;

    try {
      const token = Cookies.get("accessToken");

      // Realizar la solicitud y configurar la respuesta como `blob`
      const response = await axios.put(
        `http://127.0.0.1:5001/service/${selectedServiceId}/assign`,
        { taker_id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          responseType: "blob", // Importante para recibir el archivo como blob
        }
      );

      // Crear un objeto `blob` para el archivo PDF
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Crear un enlace de descarga temporal
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `application_${userId}.pdf`; // Nombre del archivo

      // Añadir el enlace al documento y simular el clic para descargar
      document.body.appendChild(link);
      link.click();

      // Limpiar el enlace después de descargar
      document.body.removeChild(link);

      alert("Application accepted and file donwload successfully!");

      // Opcional: actualizar el estado de aplicaciones o recargar la lista
      setApplicationsForService((prev) =>
        prev.map((app) =>
          app.UserId === userId ? { ...app, Accepted: true } : app
        )
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
        prev.map((app) =>
          app.UserId === userId ? { ...app, Accepted: false } : app
        )
      );
    } catch (error) {
      console.error("Error cancel application:", error);
      alert("Failed to cancel application.");
    }
  };
  const fetchAplicationToService = async (serviceId: number) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.put(
        `http://127.0.0.1:5001/service/${serviceId}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Application submitted successfully!");
      } else {
        console.error(response.data.msg);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("You have already applied for this service.");
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <a
                      href={`/userProfile/${service.PublisherId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        key={service.PublisherId}
                        src={`data:${service.profilePhotoMimeType};base64,${service.profilePhotoBase64}`}
                        alt="Profile"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          marginRight: "10px",
                        }}
                      />
                    </a>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", color: "#14171A" }}
                      >
                        {service.publisher}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#657786" }}>
                        {new Date(service.publishDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

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
                          <a
                            href={`/pets/${photo.PetID}`}
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
                  {service.PublisherId !== UserId && !service.completed && (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        mt: 1,
                        backgroundColor: "#e53935",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#d32f2f",
                        },
                        borderRadius: 2,
                        boxShadow: "0 3px 5px rgba(0, 0, 0, 0.3)",
                        fontWeight: "bold",
                        padding: "8px 16px",
                        textTransform: "none",
                      }}
                      onClick={() => {
                        const confirmed = window.confirm(
                          "Are you sure you want to apply for this service?"
                        );
                        if (confirmed) {
                          fetchAplicationToService(service.ServiceId);
                        }
                      }}
                    >
                      Apply
                    </Button>
                  )}
                </Box>
              ))
            )}
          </Stack>
        )}
      </Container>

      <Box sx={{ width: "300px", marginLeft: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#333", mb: 1 }}
        >
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
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "#14171A" }}
                  >
                    {service.description}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#657786" }}>
                    🐾 Pets:{" "}
                    {Array.isArray(service.pets)
                      ? service.pets.join(", ")
                      : "N/A"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: application?.Accepted ? "#4caf50" : "#e0245e",
                      fontWeight: "bold",
                    }}
                  >
                    {application?.Accepted
                      ? "Approved"
                      : "Application pending approval"}
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

        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#333", mb: 1 }}
        >
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
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#14171A" }}
                >
                  {service.description}
                </Typography>
                <Typography variant="body2" sx={{ color: "#657786" }}>
                  🐾 Pets: {service.pets.join(", ")}
                </Typography>

                {/* Botón para ver aplicaciones */}
                {!service.completed && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(service.ServiceId)}
                    sx={{
                      mt: 1,
                      backgroundColor: "#e53935", // Rojo
                      color: "##ff4d4f",
                      "&:hover": {
                        backgroundColor: "#d32f2f", // Un rojo más oscuro en hover
                      },
                      borderRadius: 2,
                      boxShadow: "0 3px 5px rgba(0, 0, 0, 0.3)",
                      fontWeight: "bold",
                      padding: "8px 16px",
                      textTransform: "none",
                    }}
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
            <Typography variant="h6" sx={{ mb: 2, color: "#000000" }}>
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
                  <Typography
                    variant="body2"
                    sx={{ color: application.Accepted ? "#4caf50" : "#e0245e" }}
                  >
                    User: {serviceInfo?.publisher} -{" "}
                    {application.Accepted ? "Approved" : "Pending Approval"}
                  </Typography>
                  {!application.Accepted ? (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        mt: 1,
                        backgroundColor: "#e53935", // Rojo
                        color: "##ff4d4f",
                        "&:hover": {
                          backgroundColor: "#d32f2f", // Un rojo más oscuro en hover
                        },
                        borderRadius: 2,
                        boxShadow: "0 3px 5px rgba(0, 0, 0, 0.3)",
                        fontWeight: "bold",
                        padding: "8px 16px",
                        textTransform: "none",
                      }}
                      onClick={() => {
                        const confirmed = window.confirm(
                          "Are you sure you want to accept this application?"
                        );
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
                        const confirmed = window.confirm(
                          "Are you sure you want to cancel this application?"
                        );
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
            <Button
              onClick={handleCloseModal}
              sx={{ mt: 2 }}
              variant="contained"
              color="secondary"
            >
              Close
            </Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default HomePage;
