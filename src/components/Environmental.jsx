import React, { useState, useMemo } from "react";
import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import { CloudRain, Thermometer, Droplets, Home, Users, ShieldCheck, BarChart2 } from "lucide-react";

const TABS = [
  { id: "curah_hujan", label: "Curah Hujan", unit: "mm", icon: CloudRain, desc: "Curah hujan bulanan rata-rata" },
  { id: "suhu", label: "Suhu Udara", unit: "°C", icon: Thermometer, desc: "Suhu rata-rata permukaan" },
  { id: "kelembaban", label: "Kelembaban", unit: "%", icon: Droplets, desc: "Kelembaban udara rata-rata" },
  { id: "sanitasi_layak", label: "Sanitasi Layak", unit: "%", icon: Home, desc: "Persentase cakupan sanitasi bersih" },
  { id: "kepadatan_penduduk", label: "Kepadatan Penduduk", unit: "jiwa/km²", icon: Users, desc: "Rasio kepadatan pemukiman" },
  { id: "rasio_puskesmas", label: "Rasio Puskesmas", unit: "per 100rb pdk", icon: ShieldCheck, desc: "Jumlah Puskesmas per 100.000 penduduk" },
];

export default function Environmental({ dbdData = [], selectedYear }) {
  const [activeTab, setActiveTab] = useState("curah_hujan");

  const activeTabInfo = TABS.find((t) => t.id === activeTab);

  // 1. Prepare scatter data and calculate regression line
  const { scatterData, trendlineData, correlation } = useMemo(() => {
    if (!dbdData || dbdData.length === 0) return { scatterData: [], trendlineData: [], correlation: 0 };

    const dataPoints = dbdData.map((d) => ({
      x: parseFloat(d[activeTab]) || 0,
      y: parseFloat(d.ir_dbd) || 0,
      name: d.kabupaten_kota,
    }));

    // Calculate linear regression (y = mx + c) & Pearson Correlation (r)
    const n = dataPoints.length;
    const sumX = dataPoints.reduce((sum, p) => sum + p.x, 0);
    const sumY = dataPoints.reduce((sum, p) => sum + p.y, 0);
    const sumXY = dataPoints.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumX2 = dataPoints.reduce((sum, p) => sum + p.x * p.x, 0);
    const sumY2 = dataPoints.reduce((sum, p) => sum + p.y * p.y, 0);

    const meanX = sumX / n;
    const meanY = sumY / n;

    // Slope (m) and Intercept (c)
    const numerator = sumXY - n * meanX * meanY;
    const denominator = sumX2 - n * meanX * meanX;

    const m = denominator !== 0 ? numerator / denominator : 0;
    const c = meanY - m * meanX;

    // Pearson Correlation Coefficient (r)
    const rNumerator = n * sumXY - sumX * sumY;
    const rDenominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    const r = rDenominator !== 0 ? rNumerator / rDenominator : 0;

    // Generate trendline points using min/max x
    const xValues = dataPoints.map((p) => p.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);

    const yMin = m * minX + c;
    const yMax = m * maxX + c;

    // Build trendline coordinates
    const trendline = [
      { x: minX, y: yMin },
      { x: maxX, y: yMax },
    ];

    return {
      scatterData: dataPoints,
      trendlineData: trendline,
      correlation: r,
    };
  }, [dbdData, activeTab]);

  // Interpret correlation strength
  const getCorrelationDesc = (r) => {
    const absR = Math.abs(r);
    const direction = r > 0 ? "Positif" : "Negatif";
    let strength = "Sangat Lemah";
    
    if (absR >= 0.7) strength = "Sangat Kuat";
    else if (absR >= 0.5) strength = "Kuat / Signifikan";
    else if (absR >= 0.3) strength = "Sedang";
    else if (absR >= 0.1) strength = "Lemah";

    return { strength, direction };
  };

  const corrInfo = getCorrelationDesc(correlation);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm">
      
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
            <BarChart2 size={20} className="text-teal-600 dark:text-teal-400" />
            <span>Analisis Korelasi Faktor Lingkungan & Sosial</span>
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Gunakan grafik scatter plot untuk menganalisis hubungan sebab-akibat antara faktor eksternal dengan tingkat kejadian DBD.
          </p>
        </div>

        {/* Correlation Badge */}
        <div className="flex-shrink-0 self-start md:self-center bg-teal-50 dark:bg-slate-900/50 border border-teal-200/50 dark:border-slate-800 p-3.5 rounded-xl text-center">
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Korelasi Pearson (r)</p>
          <div className="flex items-baseline justify-center gap-1.5 mt-1">
            <span className={`text-xl font-extrabold ${Math.abs(correlation) > 0.3 ? "text-teal-600 dark:text-teal-400" : "text-slate-600 dark:text-slate-400"}`}>
              {correlation.toFixed(3)}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">({corrInfo.strength})</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-100 dark:border-slate-700/50 pb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/15"
                : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/30 dark:hover:bg-slate-900/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            }`}
          >
            <tab.icon size={16} className={activeTab === tab.id ? "text-white" : "text-teal-600 dark:text-teal-400"} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Description Info */}
      <div className="bg-slate-50 dark:bg-slate-900/20 p-4 rounded-xl text-xs text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800/80 mb-6">
        <span className="font-bold text-teal-600 dark:text-teal-400 inline-flex items-center gap-1.5 mr-1.5 mb-1 sm:mb-0 sm:inline-flex">
          <activeTabInfo.icon size={14} className="text-teal-600 dark:text-teal-400" />
          <span>{activeTabInfo.label}: </span>
        </span>
        <span>{activeTabInfo.desc}. Arah korelasi: <strong>{corrInfo.direction}</strong>. </span>
        {correlation > 0.3 && (
          <span>Korelasi positif ini menunjukkan bahwa wilayah dengan <strong>{activeTabInfo.label.toLowerCase()} tinggi</strong> cenderung memiliki <strong>kejadian DBD yang lebih tinggi</strong> pula.</span>
        )}
        {correlation < -0.3 && (
          <span>Korelasi negatif ini menunjukkan bahwa wilayah dengan <strong>{activeTabInfo.label.toLowerCase()} tinggi</strong> cenderung memiliki <strong>kejadian DBD yang lebih rendah</strong> (misal sanitasi yang baik).</span>
        )}
        {Math.abs(correlation) <= 0.3 && (
          <span>Hubungan korelasi tergolong lemah, mengindikasikan faktor ini tidak berkontribusi dominan secara langsung terhadap tingkat kejadian DBD secara individual pada tahun {selectedYear}.</span>
        )}
      </div>

      {/* Scatter Plot */}
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
            <XAxis
              type="number"
              dataKey="x"
              name={activeTabInfo.label}
              unit={` ${activeTabInfo.unit}`}
              domain={["dataMin", "dataMax"]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="IR DBD"
              domain={[0, "auto"]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 11 }}
            />
            <ZAxis range={[60, 60]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3", stroke: "rgba(15, 118, 110, 0.3)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  // Find the scatter item which contains the custom 'name' attribute
                  const scatterItem = payload.find((p) => p.name === "Kabupaten/Kota");
                  if (scatterItem) {
                    const p = scatterItem.payload;
                    return (
                      <div className="bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-md text-xs font-sans">
                        <p className="font-bold text-teal-800 dark:text-teal-400 text-sm mb-1">{p.name}</p>
                        <p className="text-slate-600 dark:text-slate-300">
                          {activeTabInfo.label}: <span className="font-bold">{p.x.toFixed(1)} {activeTabInfo.unit}</span>
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                          IR DBD: <span className="font-bold text-rose-500">{p.y.toFixed(2)}</span>
                        </p>
                      </div>
                    );
                  }
                }
                return null;
              }}
            />

            {/* Actual District Points */}
            <Scatter
              name="Kabupaten/Kota"
              data={scatterData}
              fill="#0F766E"
              fillOpacity={0.7}
              stroke="#0D9488"
              strokeWidth={1}
            />

            {/* Regression Trendline */}
            <Line
              name="Garis Tren"
              data={trendlineData}
              type="monotone"
              dataKey="y"
              stroke="#EF4444"
              strokeWidth={2.5}
              dot={false}
              activeDot={false}
              legendType="none"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
