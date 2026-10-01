import { useOutletContext } from "react-router";

import type { Patient } from "./types";

export type ChartContext = { patient: Patient };

/** The patient loaded by the chart layout route, for its tab routes. */
export const useChartPatient = () => useOutletContext<ChartContext>().patient;
