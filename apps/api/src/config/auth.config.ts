import { registerAs } from "@nestjs/config";

export default registerAs("auth", () => ({
  accessTokenSecret:
    process.env.AUTH_JWT_ACCESS_SECRET ?? "change-me-in-production",
  accessTokenExpiresIn: process.env.AUTH_JWT_ACCESS_EXPIRES_IN ?? "1d",
}));
