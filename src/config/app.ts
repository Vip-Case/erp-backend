export const appConfig = {
    port: parseInt(process.env.PORT || "3000"),
    environment: process.env.NODE_ENV || "development",
    jwtSecret: process.env.JWT_SECRET || "your-secret-key",
    apiVersion: process.env.API_VERSION || "v1",
  };