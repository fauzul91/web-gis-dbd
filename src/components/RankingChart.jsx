import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Colors for top ranks to emphasize severity
const RANK_COLORS = [
  "#EF4444", // Rank 1 (Rose/Red)
  "#F43F5E", // Rank 2
  "#F43F5E", // Rank 3
  "#F97316", // Rank 4 (Orange)
  "#FB923C", // Rank 5
  "#FB923C", // Rank 6
  "#F59E0B", // Rank 7 (Amber/Yellow)
  "#FBBF24", // Rank 8
  "#10B981", // Rank 9 (Green)
  "#34D399", // Rank 10
];

export default function RankingChart({ dbdData = [], onSelectDistrict }) {
  const rankingData = useMemo(() => {
    if (!dbdData || dbdData.length === 0) return [];
    
    // Sort descending by IR DBD and slice top 10
    return [...dbdData]
      .sort((a, b) => b.ir_dbd - a.ir_dbd)
      .slice(0, 10)
      .map((d) => ({
        name: d.kabupaten_kota.replace("Kabupaten ", "Kab. ").replace("Kota ", "Kota "),
        originalName: d.kabupaten_kota,
        "IR DBD": parseFloat(d.ir_dbd.toFixed(2)),
      }))
      // Recharts vertical layout renders from bottom-up, so we reverse it to display rank 1 at the top!
      .reverse();
  }, [dbdData]);

  const handleBarClick = (data) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const originalName = data.activePayload[0].payload.originalName;
      onSelectDistrict(originalName);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <div className="mb-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
          10 Wilayah Kasus Tertinggi (Incidence Rate)
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Daftar 10 kabupaten/kota dengan angka kejadian DBD tertinggi per 100.000 penduduk
        </p>
      </div>

      <div className="w-full h-[280px] flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rankingData}
            layout="vertical"
            margin={{ top: 0, right: 15, left: 10, bottom: 0 }}
            onClick={handleBarClick}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="rgba(148,163,184,0.15)"
            />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 10 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderColor: "#E2E8F0",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
              }}
              cursor={{ fill: "rgba(15, 118, 110, 0.04)" }}
              itemStyle={{ fontWeight: 700 }}
              labelStyle={{ color: "#64748B", fontWeight: 600, marginBottom: "4px" }}
            />
            <Bar
              dataKey="IR DBD"
              radius={[0, 6, 6, 0]}
              barSize={18}
              cursor="pointer"
            >
              {rankingData.map((entry, index) => {
                // Color mapping: rankingData is reversed (index 9 is Rank 1, index 0 is Rank 10)
                const colorIndex = 9 - index;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={RANK_COLORS[colorIndex] || "#0F766E"}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
