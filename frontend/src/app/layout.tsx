import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import BarSidebar from "./pages/bar-sidebar"; // Import the BarSidebar component
// import { createTheme, ThemeProvider } from "@mui/material/styles";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Pet Connecting",
  description: "A social network for pets and their owners",
};

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#FF4040", // Rojo para botones o acciones principales
//     },
//     secondary: {
//       main: "#6C6C6C", // Gris oscuro para textos secundarios
//     },
//     background: {
//       default: "#F4F4F4", // Fondo general
//       paper: "#ECECEC", // Fondo para tarjetas y contenedores
//     },
//     text: {
//       primary: "#000000", // Texto principal en negro
//       secondary: "#6C6C6C", // Texto secundario en gris oscuro
//       disabled: "#9E9E9E", // Texto de sugerencias o descripciones
//     },
//     action: {
//       hover: "#FF4040", // Hover de botones o interacciones
//       selected: "#EDEDED", // Fondo seleccionado (por ejemplo, para tarjetas activas)
//     },
//   },
//   typography: {
//     fontFamily: "Roboto, sans-serif", // Fuente general
//     h5: {
//       fontWeight: 600, // Títulos o encabezados destacados
//     },
//   },
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <ThemeProvider theme={theme}>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BarSidebar /> {/* Bar-sidebar will load first */}
        {children} {/* Render other page content */}
      </body>
    </html>
    // </ThemeProvider>
  );
}
