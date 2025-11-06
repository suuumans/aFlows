
import { Polar } from "@polar-sh/sdk";

export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOEKN!,
  // server:process.env.NODE_ENV === "production" ? "sandbox" :  "production",
  server: "sandbox",
});