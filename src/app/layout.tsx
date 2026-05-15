import type { Metadata } from "next";
import "./globals.css";

export const metadata = {
  title: "Group Adventure",
  description: "A dark voting adventure",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts: Oswald (rigid, uppercase) + Crimson Text (ominous serif) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black min-h-screen text-gray-200 font-body relative">
        {/* Subtle blood-radial overlay (fixed) */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(139,0,0,0.08),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(139,0,0,0.05),transparent_50%)]" />
        <div className="relative z-10 w-full max-w-2xl mx-auto p-4">
          {children}
        </div>
      </body>
    </html>
  );
}