import withPWA from "next-pwa";
import composePlugins from "next-compose-plugins"; // Import next-compose-plugins
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for improved error handling
  swcMinify: true, // Enable SWC minification for improved performance
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
};

const withPWAConfig = withPWA({
  dest: "public", // Destination directory for the PWA files
  disable: process.env.NODE_ENV === "development", // Disable PWA in the development environment
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
});

export default composePlugins([withNextIntl, withPWAConfig], nextConfig);
