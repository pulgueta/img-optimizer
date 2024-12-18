import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";

export type ImgOptimizerAPI = {
  Variables: {};
  Bindings: {
    IMG_BUCKET: R2Bucket;
  };
};

export type AppOpenAPI = OpenAPIHono<ImgOptimizerAPI>;
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, ImgOptimizerAPI>;
