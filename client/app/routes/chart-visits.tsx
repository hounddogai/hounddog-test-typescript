import * as Sentry from "@sentry/react-router";
import { Form, redirect, useNavigation } from "react-router";

import { Button, Fact, Field, inputClass, Panel } from "~/components/ui";
import { recordVisit } from "~/lib/api.server";
import { useChartPatient } from "~/lib/chart-context";
import { formatDate } from "~/lib/format";
import { readVisit } from "~/lib/forms";

import type { Route } from "./+types/chart-visits";

export async function action({ params, request }: Route.ActionArgs) {
  const newVisitData = readVisit(await request.formData());

  try {
    console.log("Recording visit", newVisitData);
    await recordVisit(params.patientId, newVisitData);
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        action: "record-visit",
        visitData: JSON.stringify(newVisitData),
      },
    });
    return { error: "The visit could not be saved. Please try again." };
  }

  return redirect(`/patients/${params.patientId}/visits`);
}

const visitFields = [
  { name: "vitalSigns", label: "Vital signs", placeholder: "BP 120/80, HR 72, Temp 98.6 F" },
  { name: "patientSymptoms", label: "Symptoms", placeholder: "Dry cough for three days" },
  { name: "medicalDiagnosis", label: "Diagnosis", placeholder: "Acute bronchitis" },
  { name: "medicalTreatment", label: "Treatment", placeholder: "Rest, fluids, honey for the cough" },
];

export default function ChartVisits({ actionData }: Route.ComponentProps) {
  const patient = useChartPatient();
  const navigation = useNavigation();
  const saving = navigation.state === "submitting";
  const timeline = patient.visits.toSorted((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="flex flex-col gap-4 lg:col-span-3">
        {timeline.length ? (
          timeline.map((visit, position) => (
            <article
              key={`${visit.date}-${position}`}
              className="rounded-2xl border-l-4 border-emerald-600 bg-white p-5 shadow-sm ring-1 ring-slate-200"
            >
              <h2 className="font-semibold">
                <time dateTime={visit.date}>{formatDate(visit.date)}</time>
              </h2>
              <dl className="mt-3 grid gap-4 sm:grid-cols-2">
                <Fact label="Vital signs" value={visit.vitalSigns} />
                <Fact label="Symptoms" value={visit.patientSymptoms} />
                <Fact label="Diagnosis" value={visit.medicalDiagnosis} />
                <Fact label="Treatment" value={visit.medicalTreatment} />
              </dl>
            </article>
          ))
        ) : (
          <Panel>
            <p className="text-sm text-slate-500">No visits have been recorded for this patient.</p>
          </Panel>
        )}
      </div>

      <div className="lg:col-span-2">
        <Panel title="Record a visit">
          {/* Remount after each saved visit so the fields start empty again. */}
          <Form key={patient.visits.length} method="post" className="flex flex-col gap-4">
            <Field label="Visit date">
              <input name="date" type="date" required className={inputClass} />
            </Field>
            {visitFields.map((field) => (
              <Field key={field.name} label={field.label}>
                <input name={field.name} placeholder={field.placeholder} className={inputClass} />
              </Field>
            ))}
            {actionData?.error ? <p className="text-sm text-rose-600">{actionData.error}</p> : null}
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save visit"}
            </Button>
          </Form>
        </Panel>
      </div>
    </div>
  );
}
