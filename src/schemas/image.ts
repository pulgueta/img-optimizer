import { ZodIssueCode, coerce, object, string, instanceof as zodInstanceOf } from "zod";

const MB_BYTES = 1000000;
const ACCEPTED_MIME_TYPES = ["image/gif", "image/jpeg", "image/png", "image/webp"];

export const optimizeImageSchema = object({
  image: zodInstanceOf(File).superRefine(({ type, size }, { addIssue }) => {
    if (!ACCEPTED_MIME_TYPES.includes(type)) {
      addIssue({
        code: ZodIssueCode.custom,
        message: `File must be one of [${ACCEPTED_MIME_TYPES.join(", ")}] but was ${type}`,
      });
    }

    if (size > 3 * MB_BYTES) {
      addIssue({
        code: ZodIssueCode.too_big,
        type: "array",
        message: `The file must not be larger than ${3 * MB_BYTES} bytes: ${size}`,
        maximum: 3 * MB_BYTES,
        inclusive: true,
      });
    }
  }),
});

export const optimizeImageResponseSchema = object({
  optimizedImage: zodInstanceOf(ArrayBuffer).or(zodInstanceOf(Uint8Array<ArrayBufferLike>)),
});

export const getImageQuerySchema = object({
  w: coerce.number(),
  q: coerce.number(),
  thumbnail: string().optional(),
});

export const getImageParamsSchema = object({
  src: string(),
});
