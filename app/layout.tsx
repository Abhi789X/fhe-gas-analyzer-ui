import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "FHE Gas Analyzer",
  description: "Check encrypted gas spending across chains",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
