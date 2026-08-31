import "server-only";
import crypto from "crypto";
import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Media (product photos + videos, category images) lives in a Cloudflare R2
 * bucket. Browsers upload straight to R2 with a short-lived presigned PUT URL —
 * files never pass through the Vercel function (which caps request bodies at
 * ~4.5 MB). The DB stores the final public URL.
 */

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID ?? "";
const BUCKET = process.env.R2_BUCKET ?? "";
/** Public origin the bucket is served from — an r2.dev URL or a custom domain, no trailing slash. */
export const PUBLIC_BASE_URL = (process.env.R2_PUBLIC_BASE_URL ?? "").replace(/\/+$/, "");

export type UploadKind = "product-image" | "product-video" | "category-image";

const RULES: Record<
  UploadKind,
  { prefix: string; maxBytes: number; types: Record<string, string> }
> = {
  "product-image": {
    prefix: "products",
    maxBytes: 5 * 1024 * 1024,
    types: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" },
  },
  "category-image": {
    prefix: "categories",
    maxBytes: 5 * 1024 * 1024,
    types: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" },
  },
  "product-video": {
    prefix: "products",
    maxBytes: 50 * 1024 * 1024,
    types: { "video/mp4": "mp4", "video/webm": "webm" },
  },
};

let cachedClient: S3Client | null = null;
function client(): S3Client {
  if (!ACCOUNT_ID || !BUCKET || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error("R2 storage is not configured (R2_* env vars missing).");
  }
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: "auto",
      endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return cachedClient;
}

export type PresignResult = {
  ok: true;
  uploadUrl: string;
  publicUrl: string;
  contentType: string;
  maxBytes: number;
} | { ok: false; error: string };

/** Mint a short-lived PUT URL for one file. Caller must have verified admin auth. */
export async function createUploadUrl(input: {
  kind: string;
  contentType: string;
  size?: number;
}): Promise<PresignResult> {
  const rule = RULES[input.kind as UploadKind];
  if (!rule) return { ok: false, error: "Type de téléversement inconnu." };

  const ext = rule.types[input.contentType];
  if (!ext) return { ok: false, error: "Format de fichier non pris en charge." };

  if (typeof input.size === "number" && input.size > rule.maxBytes) {
    const mb = Math.round(rule.maxBytes / (1024 * 1024));
    return { ok: false, error: `Fichier trop volumineux (${mb} Mo max).` };
  }

  const key = `${rule.prefix}/${crypto.randomUUID()}.${ext}`;
  const uploadUrl = await getSignedUrl(
    client(),
    new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: input.contentType }),
    { expiresIn: 600 }
  );

  return {
    ok: true,
    uploadUrl,
    publicUrl: `${PUBLIC_BASE_URL}/${key}`,
    contentType: input.contentType,
    maxBytes: rule.maxBytes,
  };
}

/** True if `url` is a file we manage (lives under our bucket's public origin). */
export function isStoredUrl(url: string | null | undefined): url is string {
  return !!url && !!PUBLIC_BASE_URL && url.startsWith(`${PUBLIC_BASE_URL}/`);
}

/** Best-effort delete of a managed file. No-ops on anything we don't own. */
export async function deleteStoredFile(url: string | null | undefined): Promise<void> {
  if (!isStoredUrl(url)) return;
  const key = url.slice(PUBLIC_BASE_URL.length + 1);
  if (!key) return;
  try {
    await client().send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  } catch {
    // A missing object or transient R2 error shouldn't block the DB write.
  }
}
