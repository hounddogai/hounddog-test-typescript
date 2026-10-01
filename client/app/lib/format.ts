import type { PatientFields } from "./types";

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

/** Formats an ISO `YYYY-MM-DD` date. Uses UTC so the server and the browser render the same text. */
export function formatDate(isoDate?: string) {
  if (!isoDate) {
    return "Not recorded";
  }
  const date = new Date(isoDate);
  return Number.isNaN(date.getTime()) ? isoDate : dateFormat.format(date);
}

export function ageInYears(isoDate?: string) {
  const birth = isoDate ? new Date(isoDate) : null;
  if (!birth || Number.isNaN(birth.getTime())) {
    return null;
  }
  const today = new Date();
  const hadBirthday =
    today.getUTCMonth() > birth.getUTCMonth() ||
    (today.getUTCMonth() === birth.getUTCMonth() && today.getUTCDate() >= birth.getUTCDate());
  return today.getUTCFullYear() - birth.getUTCFullYear() - (hadBirthday ? 0 : 1);
}

export function displayName(person: PatientFields) {
  const name = [person.firstName, person.lastName].filter(Boolean).join(" ");
  return name || "Unnamed patient";
}

export function initials(person: PatientFields) {
  const letters = `${person.firstName?.[0] ?? ""}${person.lastName?.[0] ?? ""}`;
  return letters.toUpperCase() || "?";
}
