import type { ReactNode } from "react";
import { Form } from "react-router";

import type { PatientFields } from "~/lib/types";

import { Field, inputClass } from "./ui";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

type PatientFormProps = {
  defaults?: PatientFields;
  /** Buttons rendered under the fields, such as submit and cancel. */
  children: ReactNode;
};

export default function PatientForm({ defaults = {}, children }: PatientFormProps) {
  return (
    <Form method="post" className="grid gap-5 sm:grid-cols-2">
      <Field label="First name">
        <input name="firstName" defaultValue={defaults.firstName} required autoComplete="off" className={inputClass} />
      </Field>
      <Field label="Last name">
        <input name="lastName" defaultValue={defaults.lastName} required autoComplete="off" className={inputClass} />
      </Field>
      <Field label="Medical record number" hint="Three groups of three digits, such as 042-318-776">
        <input
          name="mrn"
          defaultValue={defaults.mrn}
          required
          pattern="\d{3}-\d{3}-\d{3}"
          placeholder="000-000-000"
          className={inputClass}
        />
      </Field>
      <Field label="Date of birth">
        <input name="dob" type="date" defaultValue={defaults.dob} className={inputClass} />
      </Field>
      <Field label="Phone number">
        <input
          name="phoneNumber"
          type="tel"
          defaultValue={defaults.phoneNumber}
          placeholder="555-010-0000"
          className={inputClass}
        />
      </Field>
      <Field label="Blood type">
        <select name="bloodType" defaultValue={defaults.bloodType ?? ""} className={inputClass}>
          <option value="">Unknown</option>
          {bloodTypes.map((bloodType) => (
            <option key={bloodType}>{bloodType}</option>
          ))}
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Home address">
          <input name="address" defaultValue={defaults.address} autoComplete="off" className={inputClass} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Clinical notes" hint="Allergies, chronic conditions, and other context for the care team">
          <textarea name="notes" rows={4} defaultValue={defaults.notes} className={inputClass} />
        </Field>
      </div>
      <div className="flex gap-3 sm:col-span-2">{children}</div>
    </Form>
  );
}
