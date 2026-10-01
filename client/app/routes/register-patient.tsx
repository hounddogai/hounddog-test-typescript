import { Link, redirect } from "react-router";

import PatientForm from "~/components/patient-form";
import { Button, buttonClass, Panel } from "~/components/ui";
import { registerPatient } from "~/lib/api.server";
import { readPatientFields } from "~/lib/forms";

import type { Route } from "./+types/register-patient";

export const meta: Route.MetaFunction = () => [{ title: "Register a patient | Avocado Doctors Portal" }];

export async function action({ request }: Route.ActionArgs) {
  const fields = readPatientFields(await request.formData());
  console.log("Registering patient", fields);
  const patient = await registerPatient(fields);
  return redirect(`/patients/${patient.id}`);
}

export default function RegisterPatient() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="text-2xl font-semibold">Register a patient</h1>
      <Panel>
        <PatientForm>
          <Button type="submit">Register patient</Button>
          <Link to="/patients" className={buttonClass("secondary")}>
            Cancel
          </Link>
        </PatientForm>
      </Panel>
    </div>
  );
}
