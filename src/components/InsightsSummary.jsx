import React from "react";
import { 
  TrendingUp, TrendingDown, 
  AlertOctagon, CheckCircle, 
  CalendarRange, Sparkles 
} from "lucide-react";

export default function InsightsSummary({ globalInsights, selectedYear }) {
  if (!globalInsights || Object.keys(globalInsights).length === 0) {
    return null;
  }

  const {
    highestRisk,
    lowestRisk,
    highestAvgYear,
    maxIncrease,
    maxDecrease,
    currentYearAverage
  } = globalInsights;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-6 md:p-8">
      {/* Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-xl">
            Insight Otomatis & Temuan Kunci
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Analisis algoritmik dari seluruh tren dan dataset demam berdarah Jawa Timur
          </p>
        </div>
      </div>

      {/* Grid of highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* Card 1: Kerawanan Tertinggi */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Risiko Tertinggi</span>
            <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500"><AlertOctagon size={18} /></span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 truncate" title={highestRisk?.district}>
              {highestRisk?.district}
            </h4>
            <p className="text-sm font-semibold text-rose-500 mt-1">
              IR: {highestRisk?.value.toFixed(2)}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              Kasus tertinggi di tahun {selectedYear}
            </p>
          </div>
        </div>

        {/* Card 2: Kerawanan Terendah */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Risiko Terendah</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500"><CheckCircle size={18} /></span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 truncate" title={lowestRisk?.district}>
              {lowestRisk?.district}
            </h4>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              IR: {lowestRisk?.value.toFixed(2)}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              Kasus terkecil di tahun {selectedYear}
            </p>
          </div>
        </div>

        {/* Card 3: Kenaikan Terbesar */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lonjakan Terbesar</span>
            <span className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-500"><TrendingUp size={18} /></span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 truncate" title={maxIncrease?.district}>
              {maxIncrease?.district}
            </h4>
            <p className="text-sm font-semibold text-red-500 mt-1">
              {maxIncrease?.value > 0 ? `+${maxIncrease?.value.toFixed(2)}` : "—"}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              Kenaikan IR vs tahun sebelumnya
            </p>
          </div>
        </div>

        {/* Card 4: Penurunan Terbesar */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Penurunan Terbesar</span>
            <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400"><TrendingDown size={18} /></span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 truncate" title={maxDecrease?.district}>
              {maxDecrease?.district}
            </h4>
            <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mt-1">
              {maxDecrease?.value > 0 ? `-${maxDecrease?.value.toFixed(2)}` : "—"}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              Penurunan IR vs tahun sebelumnya
            </p>
          </div>
        </div>

        {/* Card 5: Tahun Tertinggi */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tahun Terparah</span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500"><CalendarRange size={18} /></span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Tahun {highestAvgYear?.year}
            </h4>
            <p className="text-sm font-semibold text-amber-500 mt-1">
              Rerata IR: {highestAvgYear?.value.toFixed(2)}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              Rerata kasus provinsi tertinggi
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
