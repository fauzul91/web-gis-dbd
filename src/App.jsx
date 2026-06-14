import React, { useState, useMemo, useEffect } from "react";
import { useDBDData } from "./hooks/useDBDData";
import { generateGlobalInsights } from "./utils/insightsGenerator";
import { ShieldAlert, Loader2, RefreshCw, Sun, Moon } from "lucide-react";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import FilterSection from "./components/FilterSection";
import MapSection from "./components/MapSection";
import DetailPanel from "./components/DetailPanel";
import TrendAnalysis from "./components/TrendAnalysis";
import RankingChart from "./components/RankingChart";
import Environmental from "./components/Environmental";
import InsightsSummary from "./components/InsightsSummary";
import Education from "./components/Education";
import Footer from "./components/Footer";
import MapPage from "./components/MapPage";

export default function App() {
  const { dbdData, geojson, loading, error } = useDBDData();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    return window.location.pathname === "/map" ? "map" : "home";
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(window.location.pathname === "/map" ? "map" : "home");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (page) => {
    const path = page === "map" ? "/map" : "/";
    window.history.pushState({}, "", path);
    setCurrentPage(page);
  };

  // SEO updates (Title & Meta Description)
  useEffect(() => {
    if (currentPage === "map") {
      document.title = "Peta Interaktif Risiko DBD Jawa Timur 2020 - 2025 | Spago";
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = "Peta spasial interaktif sebaran kasus Demam Berdarah Dengue (DBD) di 38 kabupaten/kota Jawa Timur beserta analisis faktor risiko lingkungan dan sosial.";
    } else {
      document.title = "Monitoring & Analisis Persebaran DBD Jawa Timur | Spago";
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.content = "Platform monitoring kasus Demam Berdarah Dengue (DBD) Jawa Timur. Visualisasi data tren, pemeringkatan daerah, dan korelasi faktor lingkungan.";
      }
    }
  }, [currentPage]);


  // Toggle dark mode classes on html element
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // 1. Get unique list of districts for the dropdown selection
  const districtsList = useMemo(() => {
    if (!dbdData || dbdData.length === 0) return [];
    const names = [...new Set(dbdData.map((d) => d.kabupaten_kota))];
    return names.sort();
  }, [dbdData]);

  // 2. Filter current year's records
  const currentYearData = useMemo(() => {
    return dbdData.filter((d) => d.tahun === selectedYear);
  }, [dbdData, selectedYear]);

  // 3. Resolve which district is currently "active" based on selection OR search term
  const activeDistrict = useMemo(() => {
    if (selectedDistrict) return selectedDistrict;
    if (searchTerm.trim() !== "") {
      const match = currentYearData.find((d) =>
        d.kabupaten_kota.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
      return match ? match.kabupaten_kota : "";
    }
    return "";
  }, [selectedDistrict, searchTerm, currentYearData]);

  // 4. Calculate global statistics and insights for highlight cards
  const globalInsights = useMemo(() => {
    return generateGlobalInsights(dbdData, selectedYear);
  }, [dbdData, selectedYear]);

  // Reset all filters to defaults
  const handleResetFilters = () => {
    setSelectedYear(2025);
    setSelectedDistrict("");
    setSearchTerm("");
  };

  // Helper to scroll smoothly to elements
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100">
        <Loader2 className="animate-spin text-teal-400 mb-4" size={48} />
        <h3 className="text-lg font-bold tracking-wider uppercase text-teal-400">DBD Jawa Timur Insight</h3>
        <p className="text-slate-400 text-sm mt-2">Memuat dataset spasial & tabular...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100 px-6 text-center">
        <div className="h-16 w-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 border border-rose-500/20">
          <ShieldAlert size={32} />
        </div>
        <h3 className="text-xl font-bold text-rose-500">Gagal Memuat Dashboard</h3>
        <p className="text-slate-400 text-sm mt-2 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-slate-950 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200"
        >
          <RefreshCw size={16} />
          <span>Muat Ulang Halaman</span>
        </button>
      </div>
    );
  }

  if (currentPage === "map") {
    return (
      <MapPage
        geojson={geojson}
        dbdData={dbdData}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedDistrict={activeDistrict}
        setSelectedDistrict={setSelectedDistrict}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onBackHome={() => navigateTo("home")}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      
      {/* Header / Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-6 md:px-12 lg:px-20 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer font-extrabold text-teal-700 dark:text-teal-400" onClick={() => scrollToId("hero")}>
            <span className="p-1.5 rounded-lg bg-teal-700 text-white dark:bg-teal-400 dark:text-slate-950"><ShieldAlert size={18} /></span>
            <span>DBD Jawa Timur <span className="font-light">Insight</span></span>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <button onClick={() => scrollToId("hero")} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">Landing Page</button>
            <button onClick={() => navigateTo("map")} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer text-teal-600 dark:text-teal-400 font-bold">Peta Interaktif</button>
            <button onClick={() => scrollToId("tren-anchor")} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">Tren & Ranking</button>
            <button onClick={() => scrollToId("faktor-anchor")} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">Faktor Korelasi</button>
            <button onClick={() => scrollToId("edukasi-anchor")} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">Panduan PSN</button>
          </div>

          {/* Right Action: Dark Mode Switcher */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/50 text-slate-500 dark:text-slate-400 transition-all duration-200 cursor-pointer"
            title={darkMode ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="hero">
        <Hero 
          onExploreMap={() => navigateTo("map")} 
          onExploreTrend={() => scrollToId("tren-anchor")} 
        />
      </div>

      {/* Summary KPI Stats cards */}
      <Stats globalInsights={globalInsights} selectedYear={selectedYear} />

      {/* Main Dashboard Section */}
      <main id="dashboard-anchor" className="scroll-mt-16">
        
        {/* Sticky Filters Section */}
        <FilterSection
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          districtsList={districtsList}
          onReset={handleResetFilters}
        />

        {/* Map & Detail Panel Grid */}
        <section className="max-w-7xl mx-auto py-10 px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Choropleth Map Card */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-3xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">Peta Risiko Kasus DBD Jatim</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Klasifikasi tingkat kerawanan berdasarkan Incidence Rate wilayah</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigateTo("map")}
                  className="text-xs font-extrabold px-3.5 py-1.5 rounded-xl bg-teal-700 text-white dark:bg-teal-400 dark:text-slate-950 hover:bg-teal-600 dark:hover:bg-teal-300 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-sm"
                >
                  Buka Peta Mode Penuh &rarr;
                </button>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/50 dark:border-teal-900 text-teal-700 dark:text-teal-400">
                  Tahun {selectedYear}
                </span>
              </div>
            </div>

            <MapSection
              geojson={geojson}
              dbdData={currentYearData}
              selectedYear={selectedYear}
              selectedDistrict={activeDistrict}
              onSelectDistrict={(dist) => {
                setSelectedDistrict(dist);
                setSearchTerm("");
              }}
              darkMode={darkMode}
            />
          </div>

          {/* Detail Panel Card */}
          <div className="lg:col-span-4">
            <DetailPanel
              selectedDistrict={activeDistrict}
              dbdData={currentYearData}
              allDistrictsData={currentYearData}
              onClearSelection={() => {
                setSelectedDistrict("");
                setSearchTerm("");
              }}
            />
          </div>

        </section>

        {/* Trend & Ranking Section */}
        <section id="tren-anchor" className="scroll-mt-20 max-w-7xl mx-auto py-10 px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TrendAnalysis allData={dbdData} selectedDistrict={activeDistrict} />
          <RankingChart dbdData={currentYearData} onSelectDistrict={(dist) => {
            setSelectedDistrict(dist);
            setSearchTerm("");
            scrollToId("dashboard-anchor");
          }} />
        </section>

        {/* Environmental Factor Tab Correlation Section */}
        <section id="faktor-anchor" className="scroll-mt-20 max-w-7xl mx-auto py-10 px-6 md:px-12 lg:px-20">
          <Environmental dbdData={currentYearData} selectedYear={selectedYear} />
        </section>

        {/* Automatic Insights Highlights Section */}
        <section className="max-w-7xl mx-auto py-10 px-6 md:px-12 lg:px-20">
          <InsightsSummary globalInsights={globalInsights} selectedYear={selectedYear} />
        </section>

        {/* Educational 3M prevention grid */}
        <section id="edukasi-anchor" className="scroll-mt-20 max-w-7xl mx-auto py-12 px-6 md:px-12 lg:px-20">
          <Education />
        </section>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
