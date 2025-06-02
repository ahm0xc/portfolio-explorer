import { Analytics as An } from "@vercel/analytics/next";

export default function Analytics() {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) return null;

  return <An />;
}
