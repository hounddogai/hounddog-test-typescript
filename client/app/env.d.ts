/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Express API in `server/`, read by the loaders and actions in `service.ts`. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
