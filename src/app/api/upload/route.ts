import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createUploadUrl } from "@/lib/storage";

/**
 * Hands the admin browser a short-lived presigned PUT URL so it can upload a
 * media file directly to R2. Admin-only.
 */
export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  let body: { kind?: string; contentType?: string; size?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!body.kind || !body.contentType) {
    return NextResponse.json({ error: "Requête incomplète." }, { status: 400 });
  }

  const result = await createUploadUrl({
    kind: body.kind,
    contentType: body.contentType,
    size: typeof body.size === "number" ? body.size : undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    uploadUrl: result.uploadUrl,
    publicUrl: result.publicUrl,
  });
}
