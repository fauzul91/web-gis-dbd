import React, { useState, useMemo } from "react";
import { 
  ArrowLeft, Sun, Moon, Search, 
  MapPin, X, Droplets, Thermometer, 
  CloudRain, Trash2, ShieldCheck, Home, 
  Users, Activity, BarChart2, ShieldAlert
} from "lucide-react";
import MapSection from "./MapSection";
import { getRiskCategory, yearlyThresholds } from "../utils/riskLevels";
import { generateComparativeInsight } from "../utils/insightsGenerator";

const getRiskBadgeClass = (cat) => {
  if (cat === 0) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
  if (cat === 1) return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800";
  if (cat === 2) return "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800";
  return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800";
};

const getRiskDotClass = (cat) => {
  if (cat === 0) return "bg-emerald-500";
  if (cat === 1) return "bg-amber-500";
  if (cat === 2) return "bg-orange-500";
  return "bg-rose-500";
};

const getRiskLabelText = (cat) => {
  if (cat === 0) return "Risiko Rendah";
  if (cat === 1) return "Risiko Sedang";
  if (cat === 2) return "Risiko Tinggi";
  return "Risiko Sangat Tinggi";
};

export default function MapPage({
  geojson,
  dbdData = [],
  selectedYear,
  setSelectedYear,
  selectedDistrict,
  setSelectedDistrict,
  searchTerm,
  setSearchTerm,
  onBackHome,
  darkMode,
  toggleDarkMode,
}) {
  const [activeSidebarTab, setActiveSidebarTab] = useState("data"); // 'data' or 'list'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 1. Filter current year's data
  const currentYearData = useMemo(() => {
    return dbdData.filter((d) => d.tahun === selectedYear);
  }, [dbdData, selectedYear]);

  // 2. Find selected district's data
  const districtData = useMemo(() => {
    if (!selectedDistrict) return null;
    return currentYearData.find(
      (d) => d.kabupaten_kota.toLowerCase() === selectedDistrict.toLowerCase()
    );
  }, [currentYearData, selectedDistrict]);

  // 3. Sort all districts alphabetically
  const sortedDistricts = useMemo(() => {
    return [...currentYearData].sort((a, b) => a.kabupaten_kota.localeCompare(b.kabupaten_kota));
  }, [currentYearData]);

  // 4. Filter districts by search query
  const filteredDistricts = useMemo(() => {
    return sortedDistricts.filter((d) =>
      d.kabupaten_kota.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [sortedDistricts, searchTerm]);

  // 5. Generate dynamic insights for selected district
  const insightText = useMemo(() => {
    if (!districtData) return "";
    return generateComparativeInsight(districtData, currentYearData);
  }, [districtData, currentYearData]);

  // 6. Calculate East Java highlights for selected year
  const highlights = useMemo(() => {
    if (currentYearData.length === 0) return null;
    const sortedByIR = [...currentYearData].sort((a, b) => b.ir_dbd - a.ir_dbd);
    const highest = sortedByIR[0];
    const lowest = sortedByIR[sortedByIR.length - 1];
    const avgIR = currentYearData.reduce((acc, d) => acc + d.ir_dbd, 0) / currentYearData.length;
    return { highest, lowest, avgIR };
  }, [currentYearData]);

  const selectedDistrictCat = districtData ? getRiskCategory(districtData.ir_dbd, selectedYear) : null;

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      
      {/* Left Sidebar */}
      <aside className="w-full lg:w-[400px] flex-shrink-0 bg-white dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden shadow-xl z-10">
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={onBackHome}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer transition-all duration-200 active:scale-95"
            >
              <ArrowLeft size={14} />
              <span>Beranda</span>
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer transition-all duration-200 active:scale-95"
              title={darkMode ? "Mode Terang" : "Mode Gelap"}
            >
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

          <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <span className="p-1 rounded bg-teal-600 dark:bg-teal-400 text-white dark:text-slate-950"><ShieldAlert size={14} /></span>
            <span>Peta Interaktif Kasus DBD</span>
          </h2>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Kabupaten / Kota Jawa Timur</p>
        </div>

        {/* Year Grid & Search Selection */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
          {/* Year Grid */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Pilih Tahun Analisis</label>
            <div className="grid grid-cols-6 gap-1.5">
              {[2020, 2021, 2022, 2023, 2024, 2025].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`py-1 text-xs font-bold rounded-lg border transition-all duration-150 cursor-pointer ${
                    selectedYear === yr
                      ? "bg-teal-700 dark:bg-teal-400 border-teal-700 dark:border-teal-400 text-white dark:text-slate-950 shadow-sm"
                      : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Searchable Dropdown */}
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
              Pilih Kabupaten / Kota
            </label>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-600 dark:focus:ring-teal-400 focus:border-transparent transition-all cursor-pointer text-left shadow-sm"
            >
              <span className="truncate">{selectedDistrict || "Pilih Kabupaten/Kota..."}</span>
              <span className="text-slate-400 text-[10px] ml-2">▼</span>
            </button>

            {isDropdownOpen && (
              <>
                {/* Click outside backdrop overlay */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setSearchTerm("");
                  }} 
                />
                
                {/* Dropdown panel */}
                <div className="absolute left-0 right-0 mt-1.5 z-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-60 overflow-hidden flex flex-col p-2 animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Search input inside dropdown */}
                  <div className="relative mb-2 flex-shrink-0">
                    <Search className="absolute left-2.5 top-2 text-slate-400" size={14} />
                    <input
                      type="text"
                      placeholder="Cari daerah..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-7.5 pr-7 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-600 dark:focus:ring-teal-400 focus:border-transparent"
                      onClick={(e) => e.stopPropagation()} // Prevent closing dropdown on input click
                    />
                    {searchTerm && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchTerm("");
                        }}
                        className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* Scrollable list options */}
                  <div className="overflow-y-auto custom-scrollbar space-y-0.5 max-h-40">
                    {filteredDistricts.length > 0 ? (
                      filteredDistricts.map((d) => {
                        const cat = getRiskCategory(d.ir_dbd, selectedYear);
                        const isSelected = selectedDistrict && selectedDistrict.toLowerCase() === d.kabupaten_kota.toLowerCase();
                        return (
                          <div
                            key={d.id_kabupaten_kota}
                            onClick={() => {
                              setSelectedDistrict(d.kabupaten_kota);
                              setSearchTerm("");
                              setIsDropdownOpen(false);
                              setActiveSidebarTab("data");
                            }}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 font-bold"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${getRiskDotClass(cat)}`} />
                              <span>{d.kabupaten_kota}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">{d.ir_dbd.toFixed(1)}</span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4 text-slate-400 text-[10px]">Daerah tidak ditemukan</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar Sub-Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
          <button
            onClick={() => setActiveSidebarTab("data")}
            className={`flex-1 py-2 text-xs font-bold transition-all duration-200 border-b-2 cursor-pointer ${
              activeSidebarTab === "data"
                ? "border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-400 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            {districtData ? "Detail Wilayah" : "Ikhtisar Jatim"}
          </button>
          <button
            onClick={() => setActiveSidebarTab("list")}
            className={`flex-1 py-2 text-xs font-bold transition-all duration-200 border-b-2 cursor-pointer ${
              activeSidebarTab === "list"
                ? "border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-400 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            Daftar Wilayah ({filteredDistricts.length})
          </button>
        </div>

        {/* Tab Content Areas */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          
          {/* TAB 1: DETAILS / STATS */}
          {activeSidebarTab === "data" && (
            <div className="space-y-4">
              
              {/* DISTRICT DETAILS SELECTED STATE */}
              {districtData ? (
                <div className="space-y-4">
                  {/* Title & Badge */}
                  <div className="flex items-start justify-between bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="space-y-0.5">
                      <h3 className="font-extrabold text-base tracking-tight text-slate-800 dark:text-slate-100">{districtData.kabupaten_kota}</h3>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Tahun {selectedYear}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedDistrict("")}
                      className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title="Tutup Detail"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* IR KPI Card */}
                  <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-xl p-4 shadow-sm border border-teal-800/30">
                    <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">Incidence Rate (IR)</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-black">{districtData.ir_dbd.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-300 font-medium">kasus / 100.000 penduduk</span>
                    </div>
                    <div className={`inline-block mt-3 text-[10px] font-bold px-2 py-0.5 rounded border ${getRiskBadgeClass(selectedDistrictCat)}`}>
                      {getRiskLabelText(selectedDistrictCat)}
                    </div>
                  </div>

                  {/* Climate Variables Grid */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kondisi Iklim & Lingkungan</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center">
                        <span className="text-teal-600 dark:text-teal-400 justify-center flex mb-1"><CloudRain size={16} /></span>
                        <span className="text-[10px] font-bold text-slate-400 block">Curah Hujan</span>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-100">{districtData.curah_hujan.toFixed(1)} <span className="text-[9px] font-normal text-slate-400">mm</span></span>
                      </div>

                      <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center">
                        <span className="text-amber-600 dark:text-amber-400 justify-center flex mb-1"><Thermometer size={16} /></span>
                        <span className="text-[10px] font-bold text-slate-400 block">Suhu Udara</span>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-100">{districtData.suhu.toFixed(1)} <span className="text-[9px] font-normal text-slate-400">°C</span></span>
                      </div>

                      <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center">
                        <span className="text-blue-600 dark:text-blue-400 justify-center flex mb-1"><Droplets size={16} /></span>
                        <span className="text-[10px] font-bold text-slate-400 block">Kelembaban</span>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-100">{districtData.kelembaban.toFixed(1)} <span className="text-[9px] font-normal text-slate-400">%</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Social / Health Stats List */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Demografi & Layanan Kesehatan</label>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/20">
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Users size={14} className="text-teal-600 dark:text-teal-400" />
                          <span>Kepadatan Penduduk</span>
                        </span>
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                          {districtData.kepadatan_penduduk.toLocaleString()} <span className="text-[9px] font-normal text-slate-400">jiwa/km²</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/20">
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Home size={14} className="text-teal-600 dark:text-teal-400" />
                          <span>Sanitasi Layak</span>
                        </span>
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                          {districtData.sanitasi_layak.toFixed(1)}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/20">
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <ShieldCheck size={14} className="text-teal-600 dark:text-teal-400" />
                          <span>Rasio Puskesmas</span>
                        </span>
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                          {districtData.rasio_puskesmas.toFixed(2)} <span className="text-[9px] font-normal text-slate-400">/100rb</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations insight box */}
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Insight Analitis</label>
                    <div className="bg-teal-50/30 dark:bg-slate-950/40 border-l-4 border-teal-600 dark:border-teal-500 rounded-r-xl p-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
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
              ) : (
                
                /* PROVINCE OVERVIEW BLANK STATE */
                <div className="space-y-4">
                  {highlights ? (
                    <div className="space-y-4">
                      {/* Welcome message */}
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Pilih kabupaten/kota pada peta atau cari namanya di tab **Daftar Wilayah** untuk melihat detail data faktor risiko spasial.
                        </p>
                      </div>

                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rangkuman Jawa Timur ({selectedYear})</label>
                      
                      {/* Average IR Card */}
                      <div className="bg-gradient-to-br from-slate-100 to-slate-200/50 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-800/80">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Rata-rata Incidence Rate</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{highlights.avgIR.toFixed(2)}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">kasus / 100.000 penduduk</span>
                        </div>
                      </div>

                      {/* Highest Risk Card */}
                      <div 
                        onClick={() => setSelectedDistrict(highlights.highest.kabupaten_kota)}
                        className="bg-rose-500/5 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/50 rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-rose-500/10 dark:hover:bg-rose-950/35 transition-all duration-200"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider block">Risiko Tertinggi</span>
                          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{highlights.highest.kabupaten_kota}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-rose-600 dark:text-rose-400 block">{highlights.highest.ir_dbd.toFixed(1)}</span>
                          <span className="text-[8px] text-slate-400">IR DBD</span>
                        </div>
                      </div>

                      {/* Lowest Risk Card */}
                      <div 
                        onClick={() => setSelectedDistrict(highlights.lowest.kabupaten_kota)}
                        className="bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/50 rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-emerald-500/10 dark:hover:bg-emerald-950/35 transition-all duration-200"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">Risiko Terendah</span>
                          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{highlights.lowest.kabupaten_kota}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 block">{highlights.lowest.ir_dbd.toFixed(1)}</span>
                          <span className="text-[8px] text-slate-400">IR DBD</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-400">Tidak ada data rangkuman untuk tahun ini.</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DISTRICT LIST */}
          {activeSidebarTab === "list" && (
            <div className="space-y-1">
              {filteredDistricts.length > 0 ? (
                filteredDistricts.map((d) => {
                  const cat = getRiskCategory(d.ir_dbd, selectedYear);
                  const isSelected = selectedDistrict && selectedDistrict.toLowerCase() === d.kabupaten_kota.toLowerCase();
                  
                  return (
                    <div
                      key={d.id_kabupaten_kota}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedDistrict("");
                        } else {
                          setSelectedDistrict(d.kabupaten_kota);
                          setActiveSidebarTab("data"); // Switch to details tab on selection!
                        }
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? "bg-teal-50/80 dark:bg-teal-950/40 border-teal-300 dark:border-teal-900"
                          : "bg-white dark:bg-slate-800/30 border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${getRiskDotClass(cat)}`} />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{d.kabupaten_kota}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-700 dark:text-slate-300">{d.ir_dbd.toFixed(1)}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">Kabupaten/Kota tidak ditemukan.</div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Right Map Container */}
      <main className="flex-1 h-full relative z-0">
        <MapSection
          geojson={geojson}
          dbdData={currentYearData}
          selectedYear={selectedYear}
          selectedDistrict={selectedDistrict}
          onSelectDistrict={(dist) => {
            setSelectedDistrict(dist);
            setSearchTerm("");
            setActiveSidebarTab("data"); // Switch to data tab when clicked on the map
          }}
          className="h-full w-full rounded-none border-none shadow-none"
          darkMode={darkMode}
        />
      </main>
    </div>
  );
}
