import { createApp } from "@/routes";
import { imagesRouter } from "@/routes/image";

const app = createApp();

const routes = [imagesRouter] as const;

for (const route of routes) {
  app.route("/", route);
}

export default app;
