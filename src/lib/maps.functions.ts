import { createServerFn } from "@tanstack/react-start";

/** Returns the browser Maps JavaScript key (referrer-restricted by the site owner). */
export const getMapsKey = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env["GOOGLE_MAPS_API_KEY"] ?? "";
  return { key };
});
