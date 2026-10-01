import assert from "node:assert/strict";
import { once } from "node:events";
import { after, before, test } from "node:test";

import { app } from "./server.js";

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
});

const sendJson = (path, method, body) =>
  fetch(`${baseUrl}${path}`, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

test("GET / identifies the API", async () => {
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "Avocado Doctors Portal API");
});

test("GET /patients lists the seeded patients by last name", async () => {
  const patients = await (await fetch(`${baseUrl}/patients`)).json();
  assert.deepEqual(
    patients.map((patient) => patient.lastName),
    ["Alvarez", "Lindqvist", "Okafor", "Reyes"],
  );
});

test("GET /patients matches the search text against names and MRNs", async () => {
  const byName = await (await fetch(`${baseUrl}/patients?search=okaf`)).json();
  const byMrn = await (await fetch(`${baseUrl}/patients?search=422-673`)).json();
  assert.deepEqual(
    byName.map((patient) => patient.id),
    ["pt-0002"],
  );
  assert.deepEqual(
    byMrn.map((patient) => patient.id),
    ["pt-0004"],
  );
});

test("GET /patients/:id sets a readable patient cookie", async () => {
  const response = await fetch(`${baseUrl}/patients/pt-0001`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).mrn, "104-552-318");
  assert.match(response.headers.get("set-cookie") ?? "", /^patient-info=/);
});

for (const [method, path] of [
  ["GET", "/patients/unknown"],
  ["PATCH", "/patients/unknown"],
  ["DELETE", "/patients/unknown"],
  ["POST", "/patients/unknown/visits"],
  ["GET", "/patients/unknown/exports/visits"],
  ["GET", "/patients/unknown/exports/profile"],
]) {
  test(`${method} ${path} answers 404 for an unknown patient`, async () => {
    const response = await sendJson(path, method, method === "GET" ? undefined : {});
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: "No patient found for unknown" });
  });
}

test("PATCH /patients/:id updates known fields even when the Salesforce sync fails", async () => {
  const response = await sendJson("/patients/pt-0003", "PATCH", { phoneNumber: "555-010-9999", role: "admin" });
  assert.equal(response.status, 200);
  const patient = await response.json();
  assert.equal(patient.phoneNumber, "555-010-9999");
  assert.equal(patient.role, undefined);
});

test("POST /patients/:id/visits appends a visit", async () => {
  const response = await sendJson("/patients/pt-0003/visits", "POST", {
    date: "2026-06-01",
    medicalDiagnosis: "Hay fever",
  });
  assert.equal(response.status, 201);
  const { visits } = await response.json();
  assert.deepEqual(visits.at(-1), { date: "2026-06-01", medicalDiagnosis: "Hay fever" });
});

test("POST /patients registers a patient that DELETE removes", async () => {
  const created = await (await sendJson("/patients", "POST", { firstName: "Test", lastName: "Patient" })).json();
  assert.match(created.id, /^pt-\d{4}$/);
  assert.deepEqual(created.visits, []);

  const removed = await fetch(`${baseUrl}/patients/${created.id}`, { method: "DELETE" });
  assert.equal(removed.status, 204);
  assert.equal((await fetch(`${baseUrl}/patients/${created.id}`)).status, 404);
});

test("POST /login rejects wrong credentials and signs a token for valid ones", async () => {
  const rejected = await sendJson("/login", "POST", { username: "valid_user", password: "nope" });
  assert.equal(rejected.status, 401);

  const accepted = await sendJson("/login", "POST", {
    username: "valid_user",
    password: "valid_password",
    email: "doctor@example.com",
  });
  assert.equal(accepted.status, 200);
  assert.match(accepted.headers.get("set-cookie") ?? "", /jwt=/);
});
