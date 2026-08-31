/**
 * Browser-side: ask our API for a presigned URL, then PUT the file straight to
 * R2. Returns the file's public URL to store on the product/category.
 */
export async function uploadToStorage(file: File, kind: string): Promise<string> {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, contentType: file.type, size: file.size }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    uploadUrl?: string;
    publicUrl?: string;
    error?: string;
  };

  if (!res.ok || !data.uploadUrl || !data.publicUrl) {
    throw new Error(data.error || "Échec du téléversement.");
  }

  const put = await fetch(data.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!put.ok) {
    throw new Error("Échec de l’envoi du fichier au stockage.");
  }

  return data.publicUrl;
}
