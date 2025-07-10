export const metadata = {
  title: "FHE Gas Analyzer",
  description: "Check your gas spending across all chains privately",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
