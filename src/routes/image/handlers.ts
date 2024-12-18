import { PhotonImage, resize } from "@cf-wasm/photon";

import type { AppRouteHandler } from "@/types";
import type { GetImage, PostImage } from "./routes";

const ORIGINAL_IMAGE_PREFIX = "original-";
const THUMBNAIL_IMAGE_PREFIX = "thumbnail-";

export const optimize: AppRouteHandler<PostImage> = async ({ req, env, json }) => {
  const { image } = req.valid("json");

  const imageBuffer = new Uint8Array(await image.arrayBuffer());

  const fileName = image.name;

  const ogKey = `${ORIGINAL_IMAGE_PREFIX}${fileName}`;
  const ogThumbKey = `${THUMBNAIL_IMAGE_PREFIX}${fileName}`;

  await env.IMG_BUCKET.put(ogKey, imageBuffer);

  const input = PhotonImage.new_from_byteslice(imageBuffer);
  const outputWebp = resize(
    input,
    input.get_width() * 0.2,
    input.get_height() * 0.2,
    1,
  ).get_bytes_webp();

  await env.IMG_BUCKET.put(ogThumbKey, outputWebp);

  input.free();

  return json({ optimizedImage: outputWebp });
};

export const getImage: AppRouteHandler<GetImage> = async ({ req, json, env }) => {
  const src = req.param("src");
  const width = req.query("w");
  const thumbnail = req.query("thumbnail");

  const name = src.split("/").pop();

  if (thumbnail) {
    const thumbPath = await env.IMG_BUCKET.get(`${THUMBNAIL_IMAGE_PREFIX}${name}`);
    const thumbBuffer = await thumbPath!.arrayBuffer();

    return json({ optimizedImage: thumbBuffer });
  }

  const ogPath = await env.IMG_BUCKET.get(`${ORIGINAL_IMAGE_PREFIX}${name}`);
  const ogBuffer = new Uint8Array(await ogPath?.arrayBuffer()!);

  const input = PhotonImage.new_from_byteslice(new Uint8Array(ogBuffer));

  const photonResize = resize(input, Number(width), input.get_height(), 5).get_bytes_webp();

  return json({ optimizedImage: photonResize });
};
