import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

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
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: [
    "nextjs",
    "next14",
    "next-intl",
    "geist-ui",
    "mui",
    "typescript",
    "pet",
    "social",
    "network",
    "chat",
  ],
  authors: [
    {
      name: "imvinojanv",
      url: "https://www.linkedin.com/in/imvinojanv/",
    },
  ],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "/icon-128x128.png" },
    { rel: "icon", url: "/icon-128x128.png" },
  ],
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

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    // <ThemeProvider theme={theme}>
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
    // </ThemeProvider>
  );
}
