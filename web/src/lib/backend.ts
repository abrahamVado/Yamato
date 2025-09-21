type Backend = "laravel" | "go";

export function getActiveBackendClient() {
  const active = (process.env.NEXT_PUBLIC_UPLOAD_BACKEND as Backend) || "go";
  const map = {
    laravel: {
      url: process.env.NEXT_PUBLIC_LARAVEL_UPLOAD_URL || "/upload.php",
      field: process.env.NEXT_PUBLIC_LARAVEL_FIELD || "data",
    },
    go: {
      url: process.env.NEXT_PUBLIC_GO_UPLOAD_URL || "/upload",
      field: process.env.NEXT_PUBLIC_GO_FIELD || "file",
    },
  } as const;
  return map[active];
}
