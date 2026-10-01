import { useSyncExternalStore } from "react";

// Favorites are kept per browser, keyed by MRN, so they survive the in-memory API restarting.
const storageKey = "favoritePatientMrns";
const changeEvent = "favorite-patients-changed";

function readFavoriteMrns(): string[] {
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(stored) ? stored.filter((mrn): mrn is string => typeof mrn === "string") : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteMrn(mrn: string) {
  const favoriteMrns = readFavoriteMrns();
  console.log("Favorite patient MRNs before the change", favoriteMrns);

  const updatedFavoriteMrns = favoriteMrns.includes(mrn)
    ? favoriteMrns.filter((favorite) => favorite !== mrn)
    : [...favoriteMrns, mrn];
  console.log("Favorite patient MRNs after the change", updatedFavoriteMrns);

  window.localStorage.setItem(storageKey, JSON.stringify(updatedFavoriteMrns));
  window.dispatchEvent(new Event(changeEvent));
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(changeEvent, onChange);
  };
}

/** Whether the MRN is a favorite. The server cannot see local storage, so it and the first client render say no. */
export function useIsFavorite(mrn?: string) {
  return useSyncExternalStore(
    subscribe,
    () => Boolean(mrn) && readFavoriteMrns().includes(mrn ?? ""),
    () => false,
  );
}
