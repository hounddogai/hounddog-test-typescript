import { reactRouter } from "@react-router/dev/vite";
import { sentryReactRouter } from "@sentry/react-router/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig((config) => ({
  plugins: [
    tailwindcss(),
    reactRouter(),
    sentryReactRouter({ org: "avocado-doctors-portal", project: "frontend", telemetry: false }, config),
  ],
  resolve: {
    tsconfigPaths: true,
  },
}));
