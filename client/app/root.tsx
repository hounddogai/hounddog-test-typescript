import * as Sentry from "@sentry/react-router";
import { type ReactNode, useEffect } from "react";
import { isRouteErrorResponse, Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import SiteHeader from "./components/site-header";
import { buttonClass } from "./components/ui";
import stylesheetHref from "./tailwind.css?url";

const doctorEmail = "john.doe@advocadohealth.com";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico" },
  { rel: "stylesheet", href: stylesheetHref },
];

export const meta: Route.MetaFunction = () => [{ title: "Avocado Doctors Portal" }];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // Tag every Sentry event with the signed-in doctor.
  useEffect(() => {
    Sentry.setUser({
      doctor_id: "1234",
      doctor_email: doctorEmail,
    });
  }, []);

  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let heading = "Something went wrong";
  let detail = "The portal hit an unexpected error. Try again in a moment.";

  if (isRouteErrorResponse(error)) {
    heading = error.status === 404 ? "Not found" : `Error ${error.status}`;
    detail = error.status === 404 ? "There is no page or patient at this address." : error.statusText || detail;
  } else if (error instanceof Error) {
    Sentry.captureException(error);
    if (import.meta.env.DEV) {
      detail = error.message;
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
      <h1 className="text-2xl font-semibold">{heading}</h1>
      <p className="mt-2 text-slate-600">{detail}</p>
      <Link to="/" className={`${buttonClass("secondary")} mt-6`}>
        Back to the dashboard
      </Link>
    </div>
  );
}
