import React from "react";
import { motion } from "framer-motion";
import { Droplets, Shield, RefreshCw, Bug } from "lucide-react";

const CARDS = [
  {
    title: "Menguras Tempat Penampungan",
    description: "Bersihkan dan kuras bak mandi, ember, vas bunga, penampung dispenser, dan wadah air lainnya minimal seminggu sekali untuk memotong siklus hidup jentik nyamuk.",
    icon: <Droplets size={28} />,
    color: "bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 border-teal-100 dark:border-teal-900/50",
    hoverColor: "hover:border-teal-500 hover:shadow-teal-500/10",
  },
  {
    title: "Menutup Rapat Wadah Air",
    description: "Tutup rapat semua drum, toren, tempayan, dan wadah penyimpanan air bersih agar nyamuk Aedes aegypti tidak dapat masuk dan bertelur di dalamnya.",
    icon: <Shield size={28} />,
    color: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-100 dark:border-amber-900/50",
    hoverColor: "hover:border-amber-500 hover:shadow-amber-500/10",
  },
  {
    title: "Mendaur Ulang Barang Bekas",
    description: "Daur ulang atau kubur barang-barang bekas yang tidak terpakai seperti kaleng kosong, ban bekas, botol plastik, dan wadah kosong yang berpotensi menampung air hujan.",
    icon: <RefreshCw size={28} />,
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50",
    hoverColor: "hover:border-emerald-500 hover:shadow-emerald-500/10",
  },
  {
    title: "Menghindari Gigitan Nyamuk",
    description: "Tidur menggunakan kelambu, pasang kawat kasa di ventilasi rumah, gunakan lotion anti-nyamuk (DEET), serta hindari menumpuk baju kotor yang disukai nyamuk.",
    icon: <Bug size={28} />,
    color: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border-rose-100 dark:border-rose-900/50",
    hoverColor: "hover:border-rose-500 hover:shadow-rose-500/10",
  },
];

export default function Education() {
  return (
    <div className="space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
          💡 Panduan Praktis Pemberantasan Sarang Nyamuk (PSN)
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
          Langkah mudah dan efektif 3M Plus yang dapat dilakukan secara mandiri oleh masyarakat untuk menghentikan pengembangbiakan nyamuk pembawa virus dengue.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CARDS.map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center ${card.hoverColor}`}
          >
            {/* Icon Circle */}
            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center border mb-6 ${card.color}`}>
              {card.icon}
            </div>

            {/* Title */}
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-base mb-3 leading-tight">
              {card.title}
            </h4>

            {/* Description */}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
