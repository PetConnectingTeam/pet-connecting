import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Button,
  Chip,
} from "@mui/material";
import SignaturePad from "react-signature-canvas";
import { useTranslations } from "next-intl";
import axios from "axios";
import Cookies from "js-cookie";

interface SignatureProps {
  applicationId: number;
  serviceId: number; // Añadir serviceId
}

const Signature: React.FC<SignatureProps> = ({ applicationId, serviceId }) => {
  const [open, setOpen] = useState(false);
  const [signaturePadRef, setSignaturePadRef] = useState<SignaturePad | null>(
    null
  );
  const [step, setStep] = useState<"owner" | "applier">("owner");
  const [ownerSignature, setOwnerSignature] = useState<string | null>(null);
  const token = Cookies.get("accessToken");

  const t = useTranslations("signature");

  // Construir la URL de la API usando el serviceId y applicationId
  const apiUrl = `http://127.0.0.1:5001/service/${serviceId}/application/${applicationId}/sign`;

  const handleClickOpen = () => {
    setStep("owner");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOwnerSignature(null);
    clearSignature();
  };

  const clearSignature = () => signaturePadRef?.clear();

  const saveCurrentSignature = async () => {
    if (signaturePadRef && !signaturePadRef.isEmpty()) {
      const dataURL = signaturePadRef.getTrimmedCanvas().toDataURL("image/png");

      if (step === "owner") {
        setOwnerSignature(dataURL);
        setStep("applier");
        clearSignature();
      } else if (step === "applier") {
        await sendSignaturesToApi(dataURL);
      }
    } else {
      console.error("No hay firma para guardar.");
    }
  };

  const sendSignaturesToApi = async (applierSignatureDataURL: string) => {
    if (!ownerSignature) return;

    try {
      const formData = new FormData();

      // Convertir las URLs en blobs y agregarlas al FormData
      formData.append(
        "owner_signature",
        await (await fetch(ownerSignature)).blob()
      );
      formData.append(
        "applier_signature",
        await (await fetch(applierSignatureDataURL)).blob()
      );

      // Enviar el FormData a la API
      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        handleClose(); // Cerrar diálogo al enviar correctamente
      }
    } catch (error) {
      console.error("Error al enviar las firmas:", error);
    }
  };

  return (
    <div>
      <Chip
        label={t("open")}
        onClick={handleClickOpen}
        sx={{
          backgroundColor: "#33524a",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#3c6b62",
          },
        }}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", color: "#33524a" }}>
          {step === "owner"
            ? t("dialog_title_owner")
            : t("dialog_title_applier")}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              width: "100%",
              height: { xs: 300, sm: 400 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #ccc",
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
            }}
          >
            <SignaturePad
              ref={(ref) => setSignaturePadRef(ref)}
              canvasProps={{
                style: {
                  width: "100%",
                  height: "100%",
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={clearSignature}
            sx={{
              color: "#33524a",
              "&:hover": {
                backgroundColor: "#e0f2f1",
              },
            }}
          >
            {t("clear")}
          </Button>
          <Button
            onClick={handleClose}
            sx={{
              color: "#33524a",
              "&:hover": {
                backgroundColor: "#e0f2f1",
              },
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={saveCurrentSignature}
            sx={{
              color: "#ff4081",
              "&:hover": {
                backgroundColor: "#f8bbd0",
              },
            }}
          >
            {step === "owner" ? t("next") : t("save")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Signature;
