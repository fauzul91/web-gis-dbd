import React from "react";
import { generateComparativeInsight } from "../utils/insightsGenerator";
import { 
  Droplets, Thermometer, CloudRain, 
  Trash2, ShieldCheck, Home, 
  Users, Activity, X 
} from "lucide-react";
import { getRiskCategory } from "../utils/riskLevels";

const getRiskColor = (ir, year) => {
  const cat = getRiskCategory(ir, year);
  if (cat === 0) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
  if (cat === 1) return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800";
  if (cat === 2) return "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800";
  return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800";
};

const getRiskLabel = (ir, year) => {
  const cat = getRiskCategory(ir, year);
  if (cat === 0) return "Risiko Rendah";
  if (cat === 1) return "Risiko Sedang";
  if (cat === 2) return "Risiko Tinggi";
  return "Risiko Sangat Tinggi";
};

export default function DetailPanel({
  selectedDistrict,
  dbdData = [],
  allDistrictsData = [],
  onClearSelection,
}) {
  const districtData = dbdData.find(
    (d) => d.kabupaten_kota.toLowerCase() === (selectedDistrict || "").toLowerCase()
  );

  if (!selectedDistrict || !districtData) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center shadow-sm">
        <div className="h-16 w-16 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 border border-teal-100 dark:border-teal-900/50">
          <Activity size={32} className="animate-pulse" />
        </div>
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-2">Detail Wilayah</h4>
        <p className="text-slate-400 dark:text-slate-500 text-sm max-w-xs leading-relaxed">
          Silakan klik daerah pada peta atau pilih dari dropdown filter untuk melihat rincian data faktor risiko.
        </p>
      </div>
    );
  }

  const ir = districtData.ir_dbd;
  const badgeClass = getRiskColor(ir, districtData.tahun);
  const riskLabel = getRiskLabel(ir, districtData.tahun);

  // Generate the comparative insight markdown
  const insightText = generateComparativeInsight(districtData, allDistrictsData);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="bg-teal-900 px-6 py-5 flex items-center justify-between text-slate-100">
        <div>
          <h3 className="font-bold text-xl tracking-tight leading-tight">{districtData.kabupaten_kota}</h3>
          <p className="text-teal-300 text-xs mt-0.5 font-medium uppercase tracking-wider">Laporan Faktor Risiko</p>
        </div>
        <button
          onClick={onClearSelection}
          className="text-teal-300 hover:text-white hover:bg-teal-800/60 p-1.5 rounded-lg transition-all duration-200 active:scale-95"
          title="Tutup Detail"
        >
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 overflow-y-auto flex-grow space-y-6 max-h-[520px]">
        {/* KPI: Incidence Rate */}
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl p-4 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Incidence Rate (IR)</p>
          <h4 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mt-1.5 leading-none">
            {ir.toFixed(2)}
          </h4>
          <span className={`inline-block border px-3 py-1 rounded-full text-xs font-semibold mt-3 ${badgeClass}`}>
            {riskLabel}
          </span>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
            Kasus per 100.000 Penduduk
          </p>
        </div>

        {/* Environmental Factors */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Faktor Lingkungan</h4>
          <div className="space-y-2.5">
            {/* Curah Hujan */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <span className="text-blue-500"><CloudRain size={18} /></span>
                <span className="text-sm font-semibold">Curah Hujan</span>
              </div>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                {districtData.curah_hujan.toFixed(1)} mm
              </span>
            </div>

            {/* Suhu */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <span className="text-rose-500"><Thermometer size={18} /></span>
                <span className="text-sm font-semibold">Suhu Udara</span>
              </div>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                {districtData.suhu.toFixed(1)} °C
              </span>
            </div>

            {/* Kelembaban */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <span className="text-cyan-500"><Droplets size={18} /></span>
                <span className="text-sm font-semibold">Kelembaban</span>
              </div>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                {districtData.kelembaban.toFixed(1)} %
              </span>
            </div>
          </div>
        </div>

        {/* Socio-demographic Factors */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Sosial & Infrastruktur</h4>
          <div className="space-y-2.5">
            {/* Sanitasi Layak */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <span className="text-emerald-500"><Home size={18} /></span>
                <span className="text-sm font-semibold">Sanitasi Layak</span>
              </div>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                {districtData.sanitasi_layak.toFixed(1)} %
              </span>
            </div>

            {/* Kepadatan Penduduk */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <span className="text-indigo-500"><Users size={18} /></span>
                <span className="text-sm font-semibold">Kepadatan Penduduk</span>
              </div>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                {districtData.kepadatan_penduduk.toLocaleString()} jiwa/km²
              </span>
            </div>

            {/* Rasio Puskesmas */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <span className="text-teal-600"><ShieldCheck size={18} /></span>
                <span className="text-sm font-semibold">Rasio Puskesmas</span>
              </div>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                {districtData.rasio_puskesmas.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">/100rb</span>
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Insight Box */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-5">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Rekomendasi & Insight</h4>
          <div className="bg-teal-50/50 dark:bg-slate-900/40 border-l-4 border-teal-600 rounded-r-xl p-4 text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            {/* Simple markdown parsing helper for bold text */}
            {insightText.split("\n\n").map((paragraph, idx) => {
              const parsed = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              return (
                <p 
                  key={idx} 
                  dangerouslySetInnerHTML={{ __html: parsed }} 
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
