import * as Sentry from "@sentry/react-router";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

Sentry.init({
  environment: "dev",
  tracesSampleRate: 1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.reactRouterTracingIntegration(), Sentry.replayIntegration()],
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter onError={Sentry.sentryOnError} />
    </StrictMode>,
  );
});
