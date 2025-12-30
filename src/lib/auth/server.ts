import "server-only";

import { betterAuth } from "better-auth";
import { pocketBaseAdapter } from "pocketbase-better-auth";

const pocketBaseUrl = process.env.POCKETBASE_URL || "http://127.0.0.1:8090";
const pocketBaseToken = process.env.POCKETBASE_TOKEN;

if (!pocketBaseToken || !pocketBaseUrl) {
  throw new Error(
    "POCKETBASE_TOKEN y POCKETBASE_URL no están configurados. Configura un token admin de PocketBase y la URL en las variables de entorno.",
  );
}

export const auth = betterAuth({
  database: pocketBaseAdapter({
    pb: {
      url: pocketBaseUrl,
      token: pocketBaseToken,
    },
    usePlural: false,
    debugLogs: process.env.NODE_ENV === "development",
  }),
  emailAndPassword: {
    enabled: true,
  },
});
