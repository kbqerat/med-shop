"use client";

// Last-resort boundary: catches failures in the root layout itself, so it must
// ship its own <html>/<body> and can't rely on globals.css or the app fonts.
import { useEffect } from "react";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1.5rem",
          textAlign: "center",
          background: "#ffffff",
          color: "#171717",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ color: "#737373", maxWidth: "28rem", margin: 0 }}>
          The page failed to load. Please try again in a moment.
        </p>
        {error.digest && (
          <p style={{ color: "#a3a3a3", fontSize: "0.75rem", margin: 0 }}>
            Reference: {error.digest}
          </p>
        )}
        <button
          type="button"
          onClick={() => retry()}
          style={{
            marginTop: "0.5rem",
            border: "none",
            borderRadius: "9999px",
            background: "#15803d",
            color: "#ffffff",
            padding: "0.7rem 2rem",
            fontWeight: 600,
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
