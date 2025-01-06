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
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Link,
  Chip,
  ListItem,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import Rating from "@mui/material/Rating";

import axios from "axios";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import Signature from "../components/signature";
import AD from "../components/ad";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

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

interface Application {
  Signed: any;
  Accepted: boolean;
  ServiceId: number;
  UserId: number;
  ApplicationId?: number;
  userName?: string; // Optional for dynamically fetched user name
  profileImage?: string; // Optional for dynamically fetched profile image
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

interface Pet {
  ID: number;
  Name: string;
  // other pet properties
}

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabIndex, setTabIndex] = useState(0);
  const [aplications, setAplications] = useState<Application[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [serviceInfo, setServiceInfo] = useState<Service | null>(null); // Nuevo estado para almacenar la información del servicio
  const [applicationsForService, setApplicationsForService] = useState<
    Application[]
  >([]);
  const [open, setOpen] = useState(false);
  const [petRatings, setPetRatings] = useState<{ [key: number]: number }>({});
  const [openRatingModal, setOpenRatingModal] = useState<boolean>(false);
  const [selectedServiceForRating, setSelectedServiceForRating] = useState<
    number | null
  >(null);
  const [serviceRating, setServiceRating] = useState<number>(0);
  const [ratedPets, setRatedPets] = useState<Set<number>>(new Set());
  const [showPetRatings, setShowPetRatings] = useState<number | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);

  const UserId = Number(Cookies.get("user_id"));

  const searchParams = useSearchParams();
  const animal_type = searchParams.get("animal_type");
  const t = useTranslations("Home");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = Cookies.get("accessToken");
        const url = animal_type
          ? `http://127.0.0.1:5001/services?animal_type=${animal_type}`
          : `http://127.0.0.1:5001/services`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          const sortedServices = response.data.sort(
            (a, b) =>
              new Date(b.publishDate).getTime() -
              new Date(a.publishDate).getTime()
          );
          setServices(sortedServices);
        }

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

    const fetchPets = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await axios.get("http://127.0.0.1:5001/pets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          setPets(response.data);
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchServices();
    fetchAplications();
    fetchPets();
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
    console.log("Opening modal for service:", serviceId);
    setSelectedServiceId(serviceId);
    setOpenModal(true);
    try {
      const token = Cookies.get("accessToken");

      // Fetch applications for the service
      const applicationResponse = await axios.get(
        `http://127.0.0.1:5001/service/${serviceId}/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(applicationResponse.data)) {
        const applications = applicationResponse.data;
        setApplicationsForService(applications);

        // Extract unique user IDs
        const userIds = Array.from(
          new Set(applications.map((app) => app.UserId))
        );

        // Fetch user details in bulk
        const userResponse = await axios.get(
          `http://127.0.0.1:5001/users?user_ids=${userIds.join(",")}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (Array.isArray(userResponse.data)) {
          const users = userResponse.data;
          console.log("Fetched users:", users);

          // Map user details to applications
          const applicationsWithUsers = applications.map((application) => {
            const user = users.find((user) => user.id === application.UserId);
            return {
              ...application,
              userName: user?.name || "Unknown User",
              profileImage: user?.profile_image_base64
                ? `data:${user.image_mimetype};base64,${user.profile_image_base64}`
                : null,
            };
          });

          console.log("Applications with user details:", applicationsWithUsers);
          setApplicationsForService(applicationsWithUsers);
        }
      }
    } catch (error) {
      console.error("Error fetching applications or user info:", error);
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

      alert(t("application_accepted"));

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
        alert(t("application_submitted"));
      } else {
        console.error(response.data.msg);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("You have already applied for this service.");
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleDeleteApplication = async (
    serviceId: number,
    applicationId: number
  ) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.delete(
        `http://127.0.0.1:5001/service/${serviceId}/application/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Application deleted successfully!");

        // Optionally, update the state to remove the deleted application
        setApplicationsForService((prev) =>
          prev.filter((app) => app.ApplicationId !== applicationId)
        );
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application.");
    }
  };

  const fetchDeleteToService = async (serviceId: number) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.delete(
        `http://127.0.0.1:5001/service/${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Service deleted successfully!");

        // Optionally, update the state to remove the deleted service
        setServices((prev) =>
          prev.filter((service) => service.ServiceId !== serviceId)
        );
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service.");
    }
  };

  const handleRatePet = async (
    serviceId: number,
    petId: number,
    rating: number
  ) => {
    // Add confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to rate this pet with ${rating} stars?`
    );
    if (!confirmed) return;

    try {
      const token = Cookies.get("accessToken");
      const response = await axios.put(
        `http://127.0.0.1:5001/service/${serviceId}/rate_pet/${petId}`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert(`Rating saved for pet ${petId}: ${rating} stars`);
      } else {
        console.error("Failed to save rating:", response.data);
      }
    } catch (error) {
      console.error("Error saving rating:", error);
      alert("Failed to save rating.");
    }
  };

  const handleCompleteService = async (serviceId: number) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.put(
        `http://127.0.0.1:5001/service/${serviceId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Service marked as complete!");
        // Optionally update the state to reflect the change
      }
    } catch (error) {
      console.error("Error completing service:", error);
      alert("Failed to complete service.");
    }
  };

  const handleOpenRatingModal = (serviceId: number) => {
    setSelectedServiceForRating(serviceId);
    setOpenRatingModal(true);
  };

  const handleCloseRatingModal = () => {
    setOpenRatingModal(false);
    setSelectedServiceForRating(null);
    setServiceRating(0);
  };

  const handleSaveRating = async () => {
    if (selectedServiceForRating === null) return;

    // Add confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to submit this rating?"
    );
    if (!confirmed) return;

    try {
      const token = Cookies.get("accessToken");
      const response = await axios.put(
        `http://127.0.0.1:5001/service/${selectedServiceForRating}/rate`,
        { rating: serviceRating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Rating saved successfully!");
        handleCloseRatingModal();
      } else {
        console.error("Failed to save rating:", response.data);
      }
    } catch (error) {
      console.error("Error saving rating:", error);
      alert("Failed to save rating.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#eef4f1",
        paddingTop: 5,
      }}
    >
      <AD />
      <Box sx={{ width: "100%", color: "#4b887c" }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          centered
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#4b887c",
            },
            "& .Mui-selected": {
              color: "#4b887c !important",
            },
            "& .MuiTab-root": {
              color: "#4b887c",
            },
          }}
        >
          <Tab
            label={t("Services")}
            sx={{ color: "#4b887c", fontWeight: "bold", paddingTop: "20px" }}
          />
          <Tab
            label={t("Your Applications")}
            sx={{ color: "#4b887c", fontWeight: "bold", paddingTop: "20px" }}
          />
        </Tabs>
        {tabIndex === 0 && (
          <Container sx={{ marginTop: 2 }}>
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
                  <Typography variant="h6">
                    {t("services_not_found")}
                  </Typography>
                ) : (
                  services.map((service) => (
                    <Box
                      key={service.ServiceId}
                      sx={{
                        padding: 2,
                        bgcolor: "rgba(255, 255, 255, 0.8)",
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
                        <Link href={`/userProfile/${service.PublisherId}`}>
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
                        </Link>
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
                          💸 {service.cost} {t("points")}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: "bold",
                            color: service.completed ? "#17bf63" : "#e0245e",
                          }}
                        >
                          {service.completed ? t("completed") : t("pending")}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#657786" }}>
                          {t("pets")}:{" "}
                          {service.pets.map((petId) => (
                            <Link
                              key={petId}
                              href={`/petsProfile/${petId}`}
                              sx={{
                                color: "#4b887c",
                                textDecoration: "none",
                                marginRight: 1,
                              }}
                            >
                              {` ${petId}`}{" "}
                              {/* Replace with actual pet name if available */}
                            </Link>
                          ))}
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
                              <Link href={`/petsProfile/${photo.PetID}`}>
                                <img
                                  src={`data:${photo.MimeType};base64,${photo.Photo}`}
                                  alt={`Pet Image ${index + 1}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </Link>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ color: "#657786" }}>
                            No images available
                          </Typography>
                        )}
                      </Box>
                      {service.PublisherId == UserId && !service.completed && (
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            mt: 1,
                            backgroundColor: "#c74b4b",
                            color: "#fff",
                            "&:hover": {
                              backgroundColor: "#a43e3e",
                            },
                            borderRadius: 2,
                            boxShadow: "0 3px 5px rgba(0, 0, 0, 0.3)",
                            fontWeight: "bold",
                            padding: "8px 16px",
                            textTransform: "none",
                          }}
                          onClick={() => {
                            const confirmed = window.confirm(
                              "Are you sure you want to Delete this service?"
                            );
                            if (confirmed) {
                              fetchDeleteToService(service.ServiceId);
                            }
                          }}
                        >
                          {t("Delete")}
                        </Button>
                      )}

                      {service.PublisherId !== UserId && !service.completed && (
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            mt: 1,
                            backgroundColor: "#4b887c",
                            color: "#fff",
                            "&:hover": {
                              backgroundColor: "#3c6b62",
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
                          {t("apply_button")}
                        </Button>
                      )}
                    </Box>
                  ))
                )}
              </Stack>
            )}
          </Container>
        )}
        {tabIndex === 1 && (
          <Box
            sx={{
              width: "100%",
              marginTop: 2,
              paddingLeft: { xs: 2, md: 10 },
              paddingRight: { xs: 2, md: 10 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#333", mb: 1 }}
            >
              {t("services_where_you_applied")}
            </Typography>
            <Stack spacing={2} sx={{ width: "100%", maxWidth: "700px" }}>
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
                        width: "100%",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "bold", color: "#14171A" }}
                      >
                        {service.description}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#657786" }}>
                        {t("pets")}:{" "}
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
                          ? t("approved")
                          : t("pending_approval")}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "bold",
                          color: service.completed ? "#17bf63" : "#e0245e",
                        }}
                      >
                        {service.completed ? t("completed") : t("pending")}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 1, marginTop: 1 }}>
                        {application?.ApplicationId && (
                          <Chip
                            variant="filled"
                            color="primary"
                            label={t("Delete")}
                            sx={{
                              backgroundColor: "#c74b4b",
                              color: "#fff",
                              "&:hover": {
                                backgroundColor: "#a43e3e",
                              },

                              boxShadow: "0 3px 5px rgba(0, 0, 0, 0.3)",
                              fontWeight: "bold",
                              padding: "8px 16px",
                              textTransform: "none",
                            }}
                            onClick={() => {
                              const confirmed = window.confirm(
                                "Are you sure you want to delete this application?"
                              );
                              if (confirmed && application.ApplicationId) {
                                handleDeleteApplication(
                                  service.ServiceId,
                                  application.ApplicationId
                                );
                              }
                            }}
                          ></Chip>
                        )}

                        {service.completed &&
                          !ratedPets.has(service.ServiceId) && (
                            <Chip
                              label={
                                showPetRatings === service.ServiceId
                                  ? t("Close")
                                  : t("Rate")
                              }
                              color="primary"
                              onClick={() =>
                                setShowPetRatings((prev) =>
                                  prev === service.ServiceId
                                    ? null
                                    : service.ServiceId
                                )
                              }
                              sx={{
                                backgroundColor: "#4b887c",
                                "&:hover": {
                                  backgroundColor: "#3c6b62",
                                },
                              }}
                            />
                          )}
                      </Box>

                      {showPetRatings === service.ServiceId && (
                        <Box sx={{ marginTop: 2 }}>
                          {service.photos.map((photo) => {
                            const pet = pets.find((p) => p.ID === photo.PetID);
                            return (
                              <Stack key={photo.PetID} spacing={1}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  {pet ? pet.Name : `Pet ${photo.PetID}`}
                                </Typography>

                                {!ratedPets.has(photo.PetID) && (
                                  <Rating
                                    name={`rate-pet-${photo.PetID}`}
                                    value={petRatings[photo.PetID] || 0}
                                    precision={0.5}
                                    onChange={(event, newValue) => {
                                      if (newValue !== null) {
                                        setPetRatings((prev) => ({
                                          ...prev,
                                          [photo.PetID]: newValue,
                                        }));
                                        handleRatePet(
                                          service.ServiceId,
                                          photo.PetID,
                                          newValue
                                        );
                                      }
                                    }}
                                  />
                                )}
                              </Stack>
                            );
                          })}
                        </Box>
                      )}
                    </Box>
                  );
                })
              ) : (
                <Typography variant="body2" sx={{ color: "#657786" }}>
                  {t("no_services_applied")}
                </Typography>
              )}
            </Stack>

            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#333", mb: 1, mt: 4 }}
            >
              {t("services_published")}
            </Typography>
            <Stack spacing={2} sx={{ width: "100%", maxWidth: "700px" }}>
              {servicesRequested.length > 0 ? (
                servicesRequested.map((service) => (
                  <Box
                    key={service.ServiceId}
                    sx={{
                      padding: 2,
                      bgcolor: "#f9f7f4",
                      borderRadius: 2,
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      border: "1px solid #e1e8ed",
                      width: "100%",
                    }}
                  >
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
                        💸 {service.cost} {t("points")}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#657786" }}>
                        🗓{" "}
                        {new Date(service.serviceDateIni).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(service.serviceDateEnd).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#657786" }}>
                        {t("pets")}: {service.pets.join(", ")}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "bold",
                          color: service.completed ? "#17bf63" : "#e0245e",
                        }}
                      >
                        {service.completed ? t("completed") : t("pending")}
                      </Typography>

                      {service.completed && (
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            mt: 1,
                            backgroundColor: "#4b887c",
                            color: "#fff",
                            "&:hover": {
                              backgroundColor: "#3c6b62",
                            },
                            borderRadius: 2,
                            boxShadow: "0 3px 5px rgba(0, 0, 0, 0.3)",
                            fontWeight: "bold",
                            padding: "8px 16px",
                            textTransform: "none",
                          }}
                          onClick={() =>
                            handleOpenRatingModal(service.ServiceId)
                          }
                        >
                          Rate the Service
                        </Button>
                      )}

                      {!service.completed && (
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "bold",
                              color: service.completed ? "#17bf63" : "#e0245e",
                            }}
                          ></Typography>

                          {/* Nested List Component */}
                          <List
                            sx={{
                              width: "100%",
                              bgcolor: "#f9f7f4",
                              borderRadius: 1,
                              mt: 1,
                            }}
                          >
                            <ListItemButton
                              onClick={async () => {
                                if (selectedServiceId === service.ServiceId) {
                                  // Close the list if already open
                                  setSelectedServiceId(null);
                                  setApplicationsForService([]);
                                } else {
                                  // Fetch applications for this service
                                  setSelectedServiceId(service.ServiceId);
                                  try {
                                    const token = Cookies.get("accessToken");
                                    const applicationResponse = await axios.get(
                                      `http://127.0.0.1:5001/service/${service.ServiceId}/applications`,
                                      {
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      }
                                    );

                                    if (
                                      Array.isArray(applicationResponse.data)
                                    ) {
                                      const applications =
                                        applicationResponse.data;

                                      // Extract unique user IDs
                                      const userIds = Array.from(
                                        new Set(
                                          applications.map((app) => app.UserId)
                                        )
                                      );

                                      // Fetch user details in bulk
                                      const userResponse = await axios.get(
                                        `http://127.0.0.1:5001/users?user_ids=${userIds.join(
                                          ","
                                        )}`,
                                        {
                                          headers: {
                                            Authorization: `Bearer ${token}`,
                                          },
                                        }
                                      );

                                      if (Array.isArray(userResponse.data)) {
                                        const users = userResponse.data;

                                        // Map user details to applications
                                        const applicationsWithUsers =
                                          applications.map((application) => {
                                            const user = users.find(
                                              (user) =>
                                                user.id === application.UserId
                                            );
                                            return {
                                              ...application,
                                              userName:
                                                user?.name || "Unknown User",
                                              profileImage:
                                                user?.profile_image_base64
                                                  ? `data:${user.image_mimetype};base64,${user.profile_image_base64}`
                                                  : "/default-avatar.png", // Use a default image if not available
                                            };
                                          });

                                        setApplicationsForService(
                                          applicationsWithUsers
                                        );
                                      }
                                    }
                                  } catch (error) {
                                    console.error(
                                      "Error fetching applications or user info:",
                                      error
                                    );
                                  }
                                }
                              }}
                            >
                              <ListItemText primary={t("view_applications")} />
                              {selectedServiceId === service.ServiceId ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )}
                            </ListItemButton>
                            <Collapse
                              in={selectedServiceId === service.ServiceId}
                              timeout="auto"
                              unmountOnExit
                            >
                              <List component="div" disablePadding>
                                {applicationsForService.length > 0 ? (
                                  applicationsForService.map((application) => (
                                    <ListItem
                                      key={application.UserId}
                                      sx={{
                                        bgcolor: application.Accepted
                                          ? "#f6eacf"
                                          : "#eed6ce",
                                        borderRadius: 1,
                                        mb: 1,
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 2,
                                        }}
                                      >
                                        {application.profileImage && (
                                          <Link
                                            href={`/userProfile/${application.UserId}`}
                                          >
                                            <img
                                              src={application.profileImage}
                                              alt="User Profile"
                                              style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                cursor: "pointer",
                                              }}
                                            />
                                          </Link>
                                        )}
                                        <Typography>
                                          {application.userName}
                                        </Typography>
                                      </Box>

                                      <Box
                                        sx={{
                                          display: "flex",
                                          gap: 1,
                                          marginLeft: "auto",
                                        }}
                                      >
                                        {application.Signed ? (
                                          <Chip
                                            label={t("complete")}
                                            color="primary"
                                            onClick={() =>
                                              handleCompleteService(
                                                service.ServiceId
                                              )
                                            }
                                            sx={{
                                              backgroundColor: "#4b887c",
                                              color: "#fff",
                                              "&:hover": {
                                                backgroundColor: "#3c6b62",
                                              },
                                            }}
                                          />
                                        ) : (
                                          <>
                                            {!application.Accepted ? (
                                              <>
                                                <Chip
                                                  label={t("accept")}
                                                  color="primary"
                                                  onClick={() => {
                                                    const confirmed =
                                                      window.confirm(
                                                        "Are you sure you want to accept this application?"
                                                      );
                                                    if (confirmed) {
                                                      handleAcceptApplication(
                                                        application.UserId
                                                      );
                                                    }
                                                  }}
                                                  sx={{
                                                    backgroundColor: "#33524a",
                                                    color: "#fff",
                                                    "&:hover": {
                                                      backgroundColor:
                                                        "#3c6b62",
                                                    },
                                                  }}
                                                />
                                                <Chip
                                                  label={t("Delete")}
                                                  color="secondary"
                                                  onClick={() => {
                                                    const confirmed =
                                                      window.confirm(
                                                        "Are you sure you want to delete this application?"
                                                      );
                                                    if (
                                                      confirmed &&
                                                      service.ServiceId &&
                                                      application.ApplicationId
                                                    ) {
                                                      handleDeleteApplication(
                                                        service.ServiceId,
                                                        application.ApplicationId
                                                      );
                                                    }
                                                  }}
                                                  sx={{
                                                    backgroundColor: "#e74c3c",
                                                    "&:hover": {
                                                      backgroundColor:
                                                        "#d32f2f",
                                                    },
                                                  }}
                                                />
                                              </>
                                            ) : (
                                              <>
                                                {application.ApplicationId && (
                                                  <Signature
                                                    applicationId={
                                                      application.ApplicationId
                                                    }
                                                    serviceId={
                                                      service.ServiceId
                                                    }
                                                  />
                                                )}
                                                <Chip
                                                  label={t("cancel")}
                                                  color="secondary"
                                                  onClick={() => {
                                                    const confirmed =
                                                      window.confirm(
                                                        "Are you sure you want to cancel this application?"
                                                      );
                                                    if (confirmed) {
                                                      handleUnAcceptApplication(
                                                        application.UserId
                                                      );
                                                    }
                                                  }}
                                                  sx={{
                                                    backgroundColor: "#e74c3c",
                                                    "&:hover": {
                                                      backgroundColor:
                                                        "#d32f2f",
                                                    },
                                                  }}
                                                />
                                              </>
                                            )}
                                          </>
                                        )}
                                      </Box>
                                    </ListItem>
                                  ))
                                ) : (
                                  <ListItem>
                                    <ListItemText
                                      primary={t("no_applications_found")}
                                      sx={{ color: "#657786" }}
                                    />
                                  </ListItem>
                                )}
                              </List>
                            </Collapse>
                          </List>
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: "#657786" }}>
                  {t("no_services_found")}
                </Typography>
              )}
            </Stack>
          </Box>
        )}
      </Box>

      {/* Modal for viewing applications */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "400px" }, // Responsive width
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#000000" }}>
            {t("applications_for_service")} {selectedServiceId}
          </Typography>
          {applicationsForService.length > 0 ? (
            applicationsForService.map((application) => (
              <Box
                key={application.UserId}
                sx={{
                  mb: 1,
                  p: 2,
                  bgcolor: application.Accepted ? "#f6eacf" : "#eed6ce",
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: application.Accepted ? "#e74c3c" : "#E53935" }}
                >
                  {t("user")}: {serviceInfo?.publisher} -{" "}
                  {application.Accepted ? "Approved" : "Pending Approval"}
                </Typography>
                {!application.Accepted ? (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      mt: 1,
                      backgroundColor: "#33524a", //color changed
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#3c6b62",
                      },
                      borderRadius: 2,
                      boxShadow: "0 3px 5px rgba(0, 0, 0, 0.3)",
                      fontWeight: "bold",
                      padding: "8px 16px",
                      textTransform: "none",
                    }}
                    onClick={() => {
                      const confirmed = window.confirm(
                        `${t(
                          "Are you sure you want to accept this application?"
                        )}`
                      );
                      if (confirmed) {
                        handleAcceptApplication(application.UserId);
                      }
                    }}
                  >
                    {t("accept")}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, backgroundColor: "#e74c3c" }}
                    onClick={() => {
                      const confirmed = window.confirm(
                        `${t(
                          "Are you sure you want to reject this application?"
                        )}`
                      );
                      if (confirmed) {
                        handleUnAcceptApplication(application.UserId);
                      }
                    }}
                  >
                    {t("cancel")}
                  </Button>
                )}
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "#657786" }}>
              {t("no_applications_found")}
            </Typography>
          )}
          <Button
            onClick={handleCloseModal}
            sx={{ mt: 2, backgroundColor: "#3c6b62" }}
            variant="contained"
            color="secondary"
          >
            {t("close")}
          </Button>
        </Box>
      </Modal>

      {/* Rating Modal */}
      <Modal open={openRatingModal} onClose={handleCloseRatingModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "400px" },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            display: "flex",
            flexDirection: "column",
            minHeight: { xs: "200px", sm: "250px" }, // Add minimum height
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#000000" }}>
            {t("rate_service")}
          </Typography>
          <Rating
            name="service-rating"
            value={serviceRating}
            precision={0.5}
            onChange={(event, newValue) => {
              if (newValue !== null) {
                setServiceRating(newValue);
              }
            }}
          />
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-end",
              mt: "auto", // Push to bottom
              flexDirection: isMobile ? "column" : "row",
              width: "100%",
            }}
          >
            <Chip
              label={t("save_rating")}
              color="primary"
              onClick={handleSaveRating}
              sx={{
                padding: "18px 16px",
                backgroundColor: "#4b887c",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#3c6b62",
                },
                width: isMobile ? "100%" : "auto",
              }}
            />
            <Chip
              label={t("close_rating")}
              onClick={handleCloseRatingModal}
              sx={{
                padding: "18px 16px",
                backgroundColor: "#4b887c",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#3c6b62",
                },
                width: isMobile ? "100%" : "auto",
              }}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default HomePage;
