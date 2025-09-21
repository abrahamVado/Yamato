// This file is a Server Component (no "use client"), so metadata is allowed.
export const metadata = { title: "Shared Files" };

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
