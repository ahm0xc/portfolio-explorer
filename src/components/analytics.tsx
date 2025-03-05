import Loglib from "@loglib/tracker/react";

export default function Analytics() {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) return null;

  return (
    <Loglib
      config={{
        id: "xportfolio-explorer",
      }}
    />
  );
}
