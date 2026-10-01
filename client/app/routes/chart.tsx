import { useEffect } from "react";
import { data, NavLink, Outlet } from "react-router";

import { StarIcon } from "~/components/icons";
import { getPatient } from "~/lib/api.server";
import type { ChartContext } from "~/lib/chart-context";
import { toggleFavoriteMrn, useIsFavorite } from "~/lib/favorites";
import { ageInYears, displayName, initials } from "~/lib/format";

import type { Route } from "./+types/chart";

export async function loader({ params }: Route.LoaderArgs) {
  const patient = await getPatient(params.patientId);
  if (!patient) {
    throw data("Patient not found", { status: 404 });
  }
  return { patient };
}

export const meta: Route.MetaFunction = ({ loaderData }) => [
  { title: `${loaderData ? displayName(loaderData.patient) : "Patient"} | Avocado Doctors Portal` },
];

const tabClass = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 px-1 pb-3 text-sm font-medium ${
    isActive ? "border-emerald-700 text-emerald-800" : "border-transparent text-slate-500 hover:text-slate-800"
  }`;

export default function Chart({ loaderData }: Route.ComponentProps) {
  const { patient } = loaderData;
  const isFavorite = useIsFavorite(patient.mrn);
  const age = ageInYears(patient.dob);

  // Report every chart view to Google Tag Manager.
  useEffect(() => {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({
      event: "patient_chart_view",
      patientFirstName: patient.firstName,
      patientLastName: patient.lastName,
      patientMrn: patient.mrn,
      patientDob: patient.dob,
      patientAddress: patient.address,
      patientPhoneNumber: patient.phoneNumber,
      patientBloodType: patient.bloodType,
    });
  }, [patient]);

  const context: ChartContext = { patient };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-white px-6 pt-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-xl font-semibold text-emerald-800">
            {initials(patient)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">{displayName(patient)}</h1>
            <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              <span>
                MRN <span className="font-mono">{patient.mrn || "pending"}</span>
              </span>
              {age !== null ? <span>{age} years old</span> : null}
              {patient.bloodType ? (
                <span className="rounded-full bg-rose-50 px-2 text-rose-700 ring-1 ring-rose-200">
                  {patient.bloodType}
                </span>
              ) : null}
            </p>
          </div>
          <button
            type="button"
            aria-pressed={isFavorite}
            disabled={!patient.mrn}
            onClick={() => patient.mrn && toggleFavoriteMrn(patient.mrn)}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-amber-600 ring-1 ring-amber-200 hover:bg-amber-50 disabled:opacity-50"
          >
            <StarIcon filled={isFavorite} />
            {isFavorite ? "Favorite" : "Add to favorites"}
          </button>
        </div>
        <nav aria-label="Patient chart" className="mt-6 flex gap-6">
          <NavLink to="." end className={tabClass}>
            Summary
          </NavLink>
          <NavLink to="visits" className={tabClass}>
            Visits ({patient.visits.length})
          </NavLink>
          <NavLink to="edit" className={tabClass}>
            Edit details
          </NavLink>
        </nav>
      </div>
      <Outlet context={context} />
    </div>
  );
}
