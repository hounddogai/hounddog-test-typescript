// Loaded with `node --import` (see package.json) so Sentry can instrument the server before React Router starts.
import * as Sentry from "@sentry/react-router";

Sentry.init({
  environment: "dev",
  tracesSampleRate: 1,
});
