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
  applicationId: number; // Recibe el ApplicationId para construir la URL
}

const Signature: React.FC<SignatureProps> = ({ applicationId }) => {
  const [open, setOpen] = useState(false);
  const [signaturePadRef, setSignaturePadRef] = useState<SignaturePad | null>(null);
  const [step, setStep] = useState<"owner" | "applier">("owner");
  const [ownerSignature, setOwnerSignature] = useState<string | null>(null);
  const token = Cookies.get("accessToken");

  const t = useTranslations("signature");

  // Construir la URL de la API usando el applicationId
  const apiUrl = `http://127.0.0.1:5001/application/${applicationId}/sign`;

  const handleClickOpen = () => {
    setStep("owner");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOwnerSignature(null);
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
    if (ownerSignature && applierSignatureDataURL) {
      try {
        // Convertir ambas firmas a Blob
        const ownerBlob = await (await fetch(ownerSignature)).blob();
        const applierBlob = await (await fetch(applierSignatureDataURL)).blob();

        // Crear un FormData para enviar las dos firmas
        const formData = new FormData();
        formData.append("owner_signature", ownerBlob, "owner_signature.png");
        formData.append("applier_signature", applierBlob, "applier_signature.png");

        // Enviar a la API
        await axios.post(apiUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        // Cerrar el diálogo después de enviar las firmas
        handleClose();
      } catch (error) {
        console.error("Error al enviar las firmas:", error);
      }
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
          "&:hover": {
            backgroundColor: "#3c6b62",
          },
        }}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {step === "owner" ? t("dialog_title_owner") : t("dialog_title_applier")}
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
          <Button onClick={clearSignature} color="secondary">
            {t("clear")}
          </Button>
          <Button onClick={handleClose} color="error">
            {t("cancel")}
          </Button>
          <Button onClick={saveCurrentSignature} color="primary">
            {step === "owner" ? t("next") : t("save")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Signature;
