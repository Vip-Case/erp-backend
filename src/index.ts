import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { appConfig } from "./config/app";

const app = new Elysia()
.use(swagger())
.get("/", () => "Elysia is running!")
.listen(appConfig.port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
 