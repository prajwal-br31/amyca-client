import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";
import { SidebarProvider } from "@/components/context/SidebarContext";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: "AmYcA",
  description: "AmYcA - Your Virtual Call Center",
  icons: {
    icon: '/logo.png', // Use existing logo as favicon
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <SidebarProvider>{children}</SidebarProvider>
        </body>
    </html>
  );
}
