import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import jsforce from "jsforce";
import jwt from "jsonwebtoken";

import { createSeededRegistry } from "./registry.js";
import writeAndDownloadData from "./writeAndDownloadData.js";

export const app = express();
const registry = createSeededRegistry();
const port = Number(process.env.PORT ?? 5174);

const SF_LOGIN_URL = "https://login.salesforce.com";
// Hardcoded credentials are intentional scanner findings. The fixture never logs in to Salesforce with them, so the
// Contact create below fails before any network call and the error is logged.
/* eslint-disable no-unused-vars */
const SF_USERNAME = "salesforce_username";
const SF_PASSWORD = "salesforce_password";
/* eslint-enable no-unused-vars */

// Deliberately permissive: any origin, a hardcoded session secret, and a non-secure session cookie.
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "sessionSecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60_000 },
  }),
);

/** Looks up `:id` and stores the patient on `res.locals`, or answers 404. */
const requirePatient = (req, res, next) => {
  const patient = registry.find(req.params.id);
  if (!patient) {
    res.status(404).json({ error: `No patient found for ${req.params.id}` });
    return;
  }
  res.locals.patient = patient;
  next();
};

/** Mirrors a patient into Salesforce as a Contact. Failures are logged and never block the request. */
const syncToSalesforce = async (patient) => {
  const connection = new jsforce.Connection({ loginUrl: SF_LOGIN_URL });
  try {
    await connection.sobject("Contact").create({
      FirstName: patient.firstName ?? "",
      LastName: patient.lastName ?? "",
      Mrn__c: patient.mrn ?? "",
    });
  } catch (error) {
    console.error(`Salesforce sync failed for patient ${patient.id}:`, String(error));
  }
};

app.get("/", (req, res) => {
  res.type("text").send("Avocado Doctors Portal API");
});

app.post("/login", (req, res) => {
  const { username, password, email } = req.body ?? {};
  if (username !== "valid_user" || password !== "valid_password") {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const userIpAddress = req.ip || req.headers["x-forwarded-for"] || req.headers["x-real-ip"];
  console.log(`User ${username} logged in from IP: ${userIpAddress}`);

  const token = jwt.sign({ user_id: 1, email, userIpAddress }, "secretKey1234", { expiresIn: "30m" });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 60_000,
  });

  req.session.user_ip = userIpAddress;
  req.session.user_email = email;

  res.json({ message: "Login successful!" });
});

app.get("/patients", (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search : "";
  res.json(registry.search(search));
});

app.post("/patients", async (req, res) => {
  const patient = registry.register(req.body ?? {});
  await syncToSalesforce(patient);
  res.status(201).json(patient);
});

app.get("/patients/:id", requirePatient, (req, res) => {
  const { patient } = res.locals;
  // The whole record goes into a cookie that page scripts can read.
  res.cookie("patient-info", JSON.stringify(patient), { maxAge: 60 * 60_000, httpOnly: false });
  res.json(patient);
});

app.patch("/patients/:id", requirePatient, async (req, res) => {
  const patient = registry.update(req.params.id, req.body ?? {});
  await syncToSalesforce(patient);
  res.json(patient);
});

app.delete("/patients/:id", requirePatient, (req, res) => {
  registry.remove(req.params.id);
  res.status(204).end();
});

app.post("/patients/:id/visits", requirePatient, (req, res) => {
  res.status(201).json(registry.addVisit(req.params.id, req.body ?? {}));
});

app.get("/patients/:id/exports/visits", requirePatient, (req, res) => {
  const { patient } = res.locals;
  writeAndDownloadData(`${patient.firstName}-${patient.lastName}-${patient.mrn}-visits.txt`, patient.visits, res);
});

app.get("/patients/:id/exports/profile", requirePatient, (req, res) => {
  const { patient } = res.locals;
  writeAndDownloadData(`${patient.firstName}-${patient.lastName}-${patient.mrn}-profile.txt`, patient, res);
});

// Listen only when run directly (`node server.js`), so the tests can import the app and choose their own port.
if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Patient API listening on port ${port}`);
  });
}
