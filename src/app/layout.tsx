import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DarkGPT — Direct, Unrestricted AI",
  description: "A private, powerful, direct AI experience engineered with minimal interference between you and the model.",
  keywords: ["DarkGPT", "AI", "unrestricted reasoning", "private assistant", "chat studio", "direct AI"],
  authors: [{ name: "DarkGPT Core Team" }],
  openGraph: {
    title: "DarkGPT — Direct, Unrestricted AI",
    description: "A private, powerful, direct AI platform with minimal interference.",
    url: "https://darkgpt.vercel.app",
    siteName: "DarkGPT",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DarkGPT — Direct, Unrestricted AI",
    description: "Private, powerful AI with minimal interference.",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-[#272730]">
        {children}
      </body>
    </html>
  );
}
