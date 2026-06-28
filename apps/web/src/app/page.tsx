"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, FileText, Zap, Table2, ScanEye, Globe, Share2, Shield, LayoutColumns } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Header } from "@/components/Header";

const features = [
  { icon: FileText, title: "Smart Text Extraction", description: "Extracts text perfectly from text-based PDFs using pdfplumber and PyMuPDF, preserving structure and formatting." },
  { icon: ScanEye, title: "OCR for Scanned PDFs", description: "Automatically detects scanned documents and applies Tesseract OCR to extract text from images with high accuracy." },
  { icon: Table2, title: "Table Detection", description: "Identifies tables and converts them to properly formatted Markdown tables with column alignment and headers." },
  { icon: LayoutColumns, title: "Multi-Column Support", description: "Intelligently reflows multi-column layouts by analyzing XY coordinates, preserving reading order." },
  { icon: Globe, title: "Heading Recognition", description: "Detects headings by font size and style, generating proper H1-H6 hierarchy in the output Markdown." },
  { icon: Shield, title: "Headers & Footers Removal", description: "Automatically detects and removes repeated headers, footers, and page numbers for clean output." },
];

const testimonials = [
  { name: "Sarah Chen", role: "Technical Writer", quote: "PDFMark saved me hours of manual transcription. The table detection is incredibly accurate.", avatar: "SC" },
  { name: "Marcus Rivera", role: "Software Engineer", quote: "I process dozens of PDF docs daily. PDFMark's OCR handles scanned documents flawlessly.", avatar: "MR" },
  { name: "Aiko Tanaka", role: "Product Manager", quote: "The multi-column reflow is a game-changer for our research papers. Clean markdown every time.", avatar: "AT" },
];

const steps = [
  { number: "1", title: "Upload PDF", description: "Drag and drop your PDF file. Supports up to 100MB — text, scanned, or mixed content." },
  { number: "2", title: "AI Processing", description: "Our pipeline analyzes the PDF type, extracts text, detects tables, headings, and removes noise." },
  { number: "3", title: "Get Markdown", description: "Download your perfectly formatted Markdown with tables, images, and headings preserved." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-purple-600/10 animate-gradient bg-[length:200%_200%]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-30" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              PDF to Markdown
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Made Effortless
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Convert any PDF into clean, structured Markdown in seconds. 
              Advanced AI-powered processing handles text, tables, images, OCR — with beautiful precision.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/upload">
                <Button size="xl" className="gap-2">
                  Get Started Free <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" size="xl">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A complete PDF processing pipeline designed for accuracy and speed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-border/50 hover:border-primary/30 transition-colors">
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-primary mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Three simple steps to convert your PDFs.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Developers</h2>
            <p className="text-muted-foreground text-lg">Join thousands who convert PDFs faster with PDFMark.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.role}</div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-purple-600/10 p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Convert?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Start converting your PDFs to clean Markdown in seconds. Free to get started.
            </p>
            <Link href="/sign-up">
              <Button size="xl" className="gap-2">
                Start Converting Now <Zap className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-semibold">PDFMark</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PDFMark. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
