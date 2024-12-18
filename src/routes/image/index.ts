import { createRouter } from "@/routes";
import * as handlers from "./handlers";
import * as routes from "./routes";

export const imagesRouter = createRouter().openapi(routes.postImage, handlers.optimize);
