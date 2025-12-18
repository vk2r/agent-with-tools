import "server-only";

import { betterAuth } from "better-auth";
import { pocketBaseAdapter } from "pocketbase-better-auth";

const pocketBaseUrl = process.env.POCKETBASE_URL || "http://127.0.0.1:8090";
const pocketBaseToken = process.env.POCKETBASE_TOKEN;

if (!pocketBaseToken) {
  throw new Error(
    "POCKETBASE_TOKEN no está configurado. Configura un token admin de PocketBase en las variables de entorno.",
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
