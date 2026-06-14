import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { MapPin, Calendar, Activity, ShieldAlert } from "lucide-react";

// Custom animated counter component using Framer Motion
const AnimatedCounter = ({ from = 0, to, duration = 1.5, decimals = 0 }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    // If to is not a number, just set it
    if (isNaN(to) || to === null || to === undefined) {
      return;
    }

    const controls = animate(from, to, {
      duration: duration,
      ease: "easeOut",
      onUpdate: (value) => {
        setCount(parseFloat(value.toFixed(decimals)));
      },
    });

    return () => controls.stop();
  }, [from, to, duration, decimals]);

  // Format with thousands separator if appropriate and no decimals
  if (decimals === 0 && !isNaN(count)) {
    return <span>{count.toLocaleString()}</span>;
  }

  return <span>{count.toFixed(decimals)}</span>;
};

export default function Stats({ globalInsights, selectedYear }) {
  const highestIr = globalInsights?.highestRisk?.value || 0;
  const highestRiskDistrict = globalInsights?.highestRisk?.district || "Memuat...";

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Wilayah */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5"
          >
            <div className="h-12 w-12 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Wilayah</p>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                <AnimatedCounter to={38} />
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Kabupaten & Kota Jatim</p>
            </div>
          </motion.div>

          {/* Card 2: Periode Data */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5"
          >
            <div className="h-12 w-12 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Periode Data</p>
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">
                2020–2025
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">6 Tahun Pencatatan</p>
            </div>
          </motion.div>

          {/* Card 3: IR Tertinggi */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5"
          >
            <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">IR DBD Tertinggi</p>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                <AnimatedCounter to={highestIr} decimals={2} />
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Kasus per 100k (Tahun {selectedYear})</p>
            </div>
          </motion.div>

          {/* Card 4: Wilayah Tertinggi */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5"
          >
            <div className="h-12 w-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Risiko Tertinggi</p>
              <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-2 truncate max-w-[160px]" title={highestRiskDistrict}>
                {highestRiskDistrict}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Tahun {selectedYear}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
