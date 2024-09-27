import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { appConfig } from "./config/app";
import mongoose from "mongoose";
import { mongoConfig } from "./config/database";

mongoose
  .connect(mongoConfig.url)
  .then(() => console.log("MongoDB'ye başarıyla bağlandı."))
  .catch((err) => console.error("MongoDB'ye bağlanırken hata oluştu:", err));

const app = new Elysia()
  .use(swagger())
  .get("/", () => "Elysia is running!")
  .listen(appConfig.port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
