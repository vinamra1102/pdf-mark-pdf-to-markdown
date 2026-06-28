"use client";

import Link from "next/link";
import { ArrowRight, FileText, Zap, Table2, ScanEye, Globe, Shield, Columns2 } from "lucide-react";
import { Header } from "@/components/Header";

const features = [
  { icon: FileText, title: "Smart Text Extraction", description: "Extracts text perfectly from text-based PDFs using pdfplumber and PyMuPDF, preserving structure and formatting." },
  { icon: ScanEye, title: "OCR for Scanned PDFs", description: "Automatically detects scanned documents and applies Tesseract OCR to extract text from images with high accuracy." },
  { icon: Table2, title: "Table Detection", description: "Identifies tables and converts them to properly formatted Markdown tables with column alignment and headers." },
  { icon: Columns2, title: "Multi-Column Support", description: "Intelligently reflows multi-column layouts by analyzing XY coordinates, preserving reading order." },
  { icon: Globe, title: "Heading Recognition", description: "Detects headings by font size and style, generating proper H1-H6 hierarchy in the output Markdown." },
  { icon: Shield, title: "Headers & Footers Removal", description: "Automatically detects and removes repeated headers, footers, and page numbers for clean output." },
];

const steps = [
  { number: "STEP 01", title: "Upload PDF", description: "Drag and drop your PDF file. Supports up to 100MB — text, scanned, or mixed content." },
  { number: "STEP 02", title: "AI Processing", description: "Our pipeline analyzes the PDF type, extracts text, detects tables, headings, and removes noise." },
  { number: "STEP 03", title: "Get Markdown", description: "Download your perfectly formatted Markdown with tables, images, and headings preserved." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO */}
      <section className="bg-brand-black w-full py-24 text-center border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto px-4 pt-[60px]">
          <div className="badge mx-auto w-fit">PDF &rarr; Markdown converter</div>
          <h1 className="text-white font-black text-[clamp(2.4rem,6vw,4rem)] leading-[1.05] tracking-[-0.03em] max-w-[700px] mx-auto mt-5 mb-5">
            PDF to <span className="text-brand-orange italic">clean Markdown</span> in seconds
          </h1>
          <p className="text-white/55 text-base leading-relaxed max-w-[480px] mx-auto mb-9">
            Convert any PDF into structured Markdown with advanced AI-powered processing. Tables, images, OCR — handled beautifully.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/upload" className="btn-primary inline-flex items-center gap-2">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/sign-in" className="btn-ghost-white inline-flex items-center gap-2">
              Sign In
            </Link>
          </div>
          <p className="text-white/30 text-[13px] mt-4">No credit card required</p>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-brand-orange w-full py-7">
        <div className="max-w-4xl mx-auto grid grid-cols-3 divide-x divide-white/25 text-center px-4">
          <div>
            <div className="text-white font-bold text-2xl">10K+</div>
            <div className="text-white/75 text-sm">Documents converted</div>
          </div>
          <div>
            <div className="text-white font-bold text-2xl">99.2%</div>
            <div className="text-white/75 text-sm">Accuracy rate</div>
          </div>
          <div>
            <div className="text-white font-bold text-2xl">&lt;3s</div>
            <div className="text-white/75 text-sm">Average processing</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-3">FEATURES</p>
            <h2 className="text-brand-black text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-brand-dark-gray text-base max-w-xl mx-auto">
              A complete PDF processing pipeline designed for accuracy and speed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card">
                <div className="bg-brand-orange/10 text-brand-orange rounded-lg p-2.5 w-fit mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-brand-black font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-brand-dark-gray text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-brand-black py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-3">HOW IT WORKS</p>
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Three Simple Steps</h2>
            <p className="text-white/50 text-base">From PDF upload to clean Markdown in seconds.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-left">
                <p className="text-brand-orange font-bold text-xs tracking-widest mb-5">{step.number}</p>
                <h3 className="text-white font-semibold text-lg mb-2.5">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-brand-orange py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-white font-black text-[clamp(1.8rem,4vw,2.8rem)] tracking-tight">
            Ready to Convert Your PDFs?
          </h2>
          <p className="text-white/70 text-base max-w-md mx-auto my-4">
            Start converting your PDFs to clean Markdown in seconds. Free to get started.
          </p>
          <div className="flex gap-3 justify-center mt-8">
            <Link href="/sign-up" className="bg-white text-brand-orange font-bold px-7 py-3 rounded-md hover:bg-white/90 transition-colors inline-flex items-center gap-2">
              Start converting <Zap className="h-4 w-4" />
            </Link>
            <Link href="/#features" className="btn-ghost-white inline-flex items-center gap-2">
              Read the docs
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-black py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <div className="flex items-center gap-2">
                <div className="bg-brand-orange w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs">P</div>
                <span className="text-white font-semibold">PDFMark</span>
              </div>
              <p className="text-white/40 text-sm mt-2.5">Convert PDFs to Markdown with precision.</p>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/#features" className="text-white/45 text-[13px] hover:text-white/90 transition-colors">Features</Link>
              <Link href="/#how-it-works" className="text-white/45 text-[13px] hover:text-white/90 transition-colors">How It Works</Link>
              <Link href="/sign-up" className="text-white/45 text-[13px] hover:text-white/90 transition-colors">Get Started</Link>
            </div>
          </div>
          <div className="border-t border-white/[0.08] mt-12 pt-5">
            <p className="text-white/30 text-[13px]">
              &copy; {new Date().getFullYear()} PDFMark. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
