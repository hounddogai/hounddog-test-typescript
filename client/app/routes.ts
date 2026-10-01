import { index, prefix, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/dashboard.tsx"),
  ...prefix("patients", [
    index("routes/roster.tsx"),
    route("new", "routes/register-patient.tsx"),
    route(":patientId", "routes/chart.tsx", [
      index("routes/chart-summary.tsx"),
      route("visits", "routes/chart-visits.tsx"),
      route("edit", "routes/chart-edit.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
