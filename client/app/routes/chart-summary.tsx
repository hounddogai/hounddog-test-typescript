import { Link } from "react-router";

import { Fact, Panel } from "~/components/ui";
import { useChartPatient } from "~/lib/chart-context";
import { formatDate } from "~/lib/format";

export default function ChartSummary() {
  const patient = useChartPatient();
  const latestVisit = patient.visits.toSorted((a, b) => b.date.localeCompare(a.date))[0];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Panel title="Demographics">
          <dl className="grid gap-5 sm:grid-cols-2">
            <Fact label="Medical record number" value={patient.mrn} />
            <Fact label="Date of birth" value={patient.dob ? formatDate(patient.dob) : undefined} />
            <Fact label="Phone number" value={patient.phoneNumber} />
            <Fact label="Blood type" value={patient.bloodType} />
            <div className="sm:col-span-2">
              <Fact label="Home address" value={patient.address} />
            </div>
          </dl>
        </Panel>
      </div>
      <div className="flex flex-col gap-6">
        <Panel title="Clinical notes">
          <p className="text-sm whitespace-pre-line text-slate-700">
            {patient.notes || <span className="text-slate-400">No notes yet.</span>}
          </p>
        </Panel>
        <Panel title="Latest visit">
          {latestVisit ? (
            <div className="text-sm">
              <p className="font-medium">{formatDate(latestVisit.date)}</p>
              <p className="text-slate-600">{latestVisit.medicalDiagnosis || "No diagnosis recorded"}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-400">No visits yet.</p>
          )}
          <Link to="visits" className="mt-3 inline-block text-sm font-medium text-emerald-700 hover:underline">
            Open the visit history
          </Link>
        </Panel>
      </div>
    </div>
  );
}
