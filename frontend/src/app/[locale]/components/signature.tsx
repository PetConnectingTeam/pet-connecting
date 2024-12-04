import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";
import SignaturePad from "react-signature-canvas";
import { useTranslations } from "next-intl"; // Para traducciones
import axios from "axios"; // Importar Axios

interface SignatureProps {
  apiUrl: string; // URL de la API a la cual enviar las firmas
  onSuccess?: () => void; // Callback en caso de éxito
  onError?: (error: any) => void; // Callback en caso de error
}

const Signature: React.FC<SignatureProps> = ({ apiUrl, onSuccess, onError }) => {
  const [open, setOpen] = useState(false);
  const [signaturePadRef, setSignaturePadRef] = useState<SignaturePad | null>(null);
  const [step, setStep] = useState<"owner" | "applier">("owner"); // Paso actual: propietario o applier
  const [ownerSignature, setOwnerSignature] = useState<string | null>(null); // Firma del propietario
  const [applierSignature, setApplierSignature] = useState<string | null>(null); // Firma del applier

  const t = useTranslations("signature");

  const handleClickOpen = () => {
    setStep("owner"); // Iniciar con la firma del propietario
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOwnerSignature(null);
    setApplierSignature(null);
  };

  const clearSignature = () => signaturePadRef?.clear();

  const saveCurrentSignature = async () => {
    if (signaturePadRef && !signaturePadRef.isEmpty()) {
      const dataURL = signaturePadRef.getTrimmedCanvas().toDataURL("image/png");

      if (step === "owner") {
        setOwnerSignature(dataURL);
        setStep("applier"); // Pasar al siguiente paso (firma del applier)
        clearSignature(); // Limpiar el canvas para la siguiente firma
      } else if (step === "applier") {
        setApplierSignature(dataURL);
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
          },
        });

        if (onSuccess) onSuccess(); // Llamar al callback en caso de éxito
        handleClose(); // Cerrar el diálogo después de guardar
      } catch (error) {
        console.error("Error al enviar las firmas:", error);
        if (onError) onError(error); // Llamar al callback en caso de error
      }
    }
  };

  return (
    <div>
      {/* Botón que abre el diálogo */}
      <Button variant="contained" onClick={handleClickOpen}>
        {t("open")}
      </Button>

      {/* Diálogo con SignaturePad */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {step === "owner" ? t("dialog_title_owner") : t("dialog_title_applier")}
        </DialogTitle>
        <DialogContent>
          {/* Contenedor del Canvas con ajuste responsivo */}
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
