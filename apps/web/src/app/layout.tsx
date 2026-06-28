import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "PDFMark - PDF to Markdown Converter",
  description: "Convert your PDFs to clean, well-formatted Markdown with advanced AI-powered processing. Text extraction, OCR, table detection, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-brand-black font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
