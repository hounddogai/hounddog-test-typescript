import { Form, Link } from "react-router";

import { PlusIcon, SearchIcon, StarIcon } from "~/components/icons";
import { buttonClass, inputClass } from "~/components/ui";
import { listPatients } from "~/lib/api.server";
import { useIsFavorite } from "~/lib/favorites";
import { displayName, formatDate } from "~/lib/format";
import type { Patient } from "~/lib/types";

import type { Route } from "./+types/roster";

export const meta: Route.MetaFunction = () => [{ title: "Patients | Avocado Doctors Portal" }];

export async function loader({ request }: Route.LoaderArgs) {
  const search = new URL(request.url).searchParams.get("search") ?? "";
  const patients = await listPatients(search);
  console.log("Patient roster loaded", patients);
  return { patients, search };
}

function RosterRow({ patient }: { patient: Patient }) {
  const isFavorite = useIsFavorite(patient.mrn);

  return (
    <tr className="hover:bg-emerald-50/50">
      <td className="py-3 pl-4">
        {isFavorite ? (
          <span title="Favorite patient" className="text-amber-500">
            <StarIcon filled className="size-4" />
          </span>
        ) : null}
      </td>
      <td className="px-3 py-3">
        <Link to={`/patients/${patient.id}`} className="font-medium text-slate-900 hover:text-emerald-700">
          {displayName(patient)}
        </Link>
      </td>
      <td className="px-3 py-3 font-mono text-xs text-slate-600">{patient.mrn}</td>
      <td className="px-3 py-3 text-slate-600">{formatDate(patient.dob)}</td>
      <td className="px-3 py-3 text-slate-600">{patient.phoneNumber}</td>
      <td className="px-3 py-3 text-slate-600">{patient.bloodType}</td>
      <td className="px-3 py-3 pr-4 text-right text-slate-600">{patient.visits.length}</td>
    </tr>
  );
}

export default function Roster({ loaderData }: Route.ComponentProps) {
  const { patients, search } = loaderData;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Patients</h1>
        <Link to="/patients/new" className={buttonClass()}>
          <PlusIcon />
          Register a patient
        </Link>
      </div>

      <Form method="get" role="search" className="flex max-w-lg gap-2">
        <input
          key={search}
          type="search"
          name="search"
          defaultValue={search}
          aria-label="Search by name or MRN"
          placeholder="Search by name or MRN"
          className={inputClass}
        />
        <button type="submit" className={buttonClass("secondary")}>
          <SearchIcon />
          Search
        </button>
      </Form>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="w-8 py-3 pl-4">
                <span className="sr-only">Favorite</span>
              </th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">MRN</th>
              <th className="px-3 py-3">Date of birth</th>
              <th className="px-3 py-3">Phone</th>
              <th className="px-3 py-3">Blood type</th>
              <th className="px-3 py-3 pr-4 text-right">Visits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.map((patient) => (
              <RosterRow key={patient.id} patient={patient} />
            ))}
          </tbody>
        </table>
        {patients.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-slate-500">
            {search ? `No patients match "${search}".` : "No patients are registered yet."}
          </p>
        ) : null}
      </div>
    </div>
  );
}
