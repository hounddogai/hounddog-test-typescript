import { Form, Link, redirect } from "react-router";

import PatientForm from "~/components/patient-form";
import { Button, buttonClass, Panel } from "~/components/ui";
import { removePatient, updatePatient } from "~/lib/api.server";
import { useChartPatient } from "~/lib/chart-context";
import { readPatientFields } from "~/lib/forms";

import type { Route } from "./+types/chart-edit";

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();

  if (formData.get("intent") === "remove") {
    await removePatient(params.patientId);
    console.log("Patient removed", params.patientId);
    return redirect("/patients");
  }

  const updates = readPatientFields(formData);
  console.log("Updating patient", updates);
  await updatePatient(params.patientId, updates);
  return redirect(`/patients/${params.patientId}`);
}

export default function ChartEdit() {
  const patient = useChartPatient();

  return (
    <div className="flex flex-col gap-6">
      <Panel title="Patient details">
        <PatientForm key={patient.id} defaults={patient}>
          <Button type="submit">Save changes</Button>
          <Link to=".." relative="path" className={buttonClass("secondary")}>
            Cancel
          </Link>
        </PatientForm>
      </Panel>

      <Panel title="Remove patient">
        <Form
          method="post"
          className="flex flex-wrap items-center justify-between gap-4"
          onSubmit={(event) => {
            if (!window.confirm(`Remove this patient and all ${patient.visits.length} visits?`)) {
              event.preventDefault();
            }
          }}
        >
          <p className="text-sm text-slate-600">Removing a patient deletes the record and its visit history.</p>
          <Button type="submit" name="intent" value="remove" variant="danger">
            Remove patient
          </Button>
        </Form>
      </Panel>
    </div>
  );
}
