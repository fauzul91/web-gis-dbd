import React from "react";
import { motion } from "framer-motion";
import { Map, TrendingUp, ShieldAlert } from "lucide-react";

export default function Hero({ onExploreMap, onExploreTrend }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-950 text-slate-100 py-24 px-6 md:px-12 lg:px-20 border-b border-teal-800/50">
      {/* Background blobs for depth */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left column: Text Content */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-800/60 border border-teal-700/50 text-xs md:text-sm font-semibold text-teal-300 tracking-wide backdrop-blur-md"
          >
            <ShieldAlert size={16} className="text-teal-400" />
            <span>SISTEM INFORMASI MONITORING DBD KABUPATEN/KOTA JATIM</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
          >
            Persebaran <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-400">Demam Berdarah</span> Dengue di Jawa Timur
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light"
          >
            Platform visualisasi data spasial & korelasi lingkungan untuk menganalisis risiko penyebaran demam berdarah (DBD) di 38 wilayah Jawa Timur dari tahun 2020 hingga 2025.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4"
          >
            <button
              onClick={onExploreMap}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-semibold px-8 py-4 rounded-xl shadow-lg shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Map size={20} />
              <span>Jelajahi Peta Risiko</span>
            </button>
            <button
              onClick={onExploreTrend}
              className="flex items-center gap-2 bg-transparent hover:bg-teal-800/30 text-teal-300 hover:text-teal-200 border-2 border-teal-700/60 hover:border-teal-600 font-semibold px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-sm transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <TrendingUp size={20} />
              <span>Analisis Tren</span>
            </button>
          </motion.div>
        </div>

        {/* Right column: Stylized Map Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-md bg-teal-900/40 border border-teal-700/30 rounded-3xl p-6 backdrop-blur-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold text-teal-400 tracking-wider">38 WILAYAH ADMINISTRATIF</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Stylized SVG Map Representation */}
            <svg viewBox="0 0 400 240" className="w-full h-auto drop-shadow-[0_10px_20px_rgba(20,184,166,0.15)]">
              {/* East Java Background Grid or stylized lines */}
              <path
                d="M 50 120 Q 150 90, 200 130 T 350 100 Q 370 140, 320 180 T 150 160 Z"
                fill="url(#mapGrad)"
                stroke="rgba(20,184,166,0.3)"
                strokeWidth="1.5"
                className="opacity-75"
              />
              <path
                d="M 90 90 C 130 80, 220 120, 260 90 C 300 70, 310 110, 360 130"
                fill="none"
                stroke="rgba(94,234,212,0.15)"
                strokeWidth="2"
                strokeDasharray="5 5"
              />

              {/* Pulsing Risk Dots representing districts */}
              {/* Surabaya Area */}
              <g className="cursor-pointer">
                <circle cx="210" cy="110" r="10" fill="rgba(239, 68, 68, 0.2)" />
                <circle cx="210" cy="110" r="5" fill="#EF4444" className="animate-pulse" />
              </g>
              {/* Malang Area */}
              <g className="cursor-pointer">
                <circle cx="200" cy="160" r="12" fill="rgba(249, 115, 22, 0.2)" />
                <circle cx="200" cy="160" r="6" fill="#F97316" />
              </g>
              {/* Banyuwangi Area */}
              <g className="cursor-pointer">
                <circle cx="340" cy="140" r="8" fill="rgba(245, 158, 11, 0.2)" />
                <circle cx="340" cy="140" r="4" fill="#F59E0B" />
              </g>
              {/* Pacitan Area */}
              <g className="cursor-pointer">
                <circle cx="80" cy="165" r="8" fill="rgba(34, 197, 94, 0.2)" />
                <circle cx="80" cy="165" r="4" fill="#22C55E" />
              </g>
              {/* Madura Area */}
              <g className="cursor-pointer">
                <circle cx="290" cy="85" r="9" fill="rgba(34, 197, 94, 0.2)" />
                <circle cx="290" cy="85" r="4" fill="#22C55E" />
              </g>
              {/* Bojonegoro Area */}
              <g className="cursor-pointer">
                <circle cx="120" cy="100" r="10" fill="rgba(245, 158, 11, 0.2)" />
                <circle cx="120" cy="100" r="5" fill="#F59E0B" />
              </g>

              {/* Definitions */}
              <defs>
                <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#115e59" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#0f766e" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#134e4a" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>

            {/* Illustration Legend */}
            <div className="mt-4 flex justify-between items-center text-[10px] md:text-xs text-slate-400 bg-teal-950/60 p-3 rounded-xl border border-teal-800/40">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-emerald-500" /> Rendah</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-amber-500" /> Sedang</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-orange-500" /> Tinggi</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-rose-500" /> Sangat Tinggi</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
