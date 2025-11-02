import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: "PokeBlog - Share Your Pokemon Pulls",
  description: "Share and discover amazing Pokemon card pulls",
  manifest: "/manifest.json",
  themeColor: "#3B82F6",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
