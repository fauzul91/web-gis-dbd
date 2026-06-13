import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function TrendAnalysis({ allData = [], selectedDistrict }) {
  const years = [2020, 2021, 2022, 2023, 2024, 2025];

  const chartData = useMemo(() => {
    if (!allData || allData.length === 0) return [];

    return years.map((yr) => {
      const yearRecords = allData.filter((d) => d.tahun === yr);

      if (selectedDistrict) {
        // District specific data
        const record = yearRecords.find(
          (d) => d.kabupaten_kota.toLowerCase() === selectedDistrict.toLowerCase()
        );
        return {
          tahun: yr.toString(),
          "IR DBD": record ? parseFloat(record.ir_dbd.toFixed(2)) : 0,
        };
      } else {
        // East Java Average
        if (yearRecords.length === 0) return { tahun: yr.toString(), "IR DBD": 0 };
        const sum = yearRecords.reduce((acc, curr) => acc + curr.ir_dbd, 0);
        const avg = sum / yearRecords.length;
        return {
          tahun: yr.toString(),
          "IR DBD": parseFloat(avg.toFixed(2)),
        };
      }
    });
  }, [allData, selectedDistrict]);

  const yLabel = "Incidence Rate (IR)";
  const lineName = selectedDistrict ? `IR ${selectedDistrict}` : "Rata-rata Jawa Timur";

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <div className="mb-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
          Tren Incidence Rate DBD (2020–2025)
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {selectedDistrict
            ? `Menampilkan data historis kasus untuk wilayah ${selectedDistrict}`
            : "Menampilkan rata-rata angka kejadian untuk seluruh Provinsi Jawa Timur"}
        </p>
      </div>

      <div className="w-full h-[280px] flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0F766E" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0F766E" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(148,163,184,0.15)"
            />
            <XAxis
              dataKey="tahun"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 11 }}
              domain={["auto", "auto"]}
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
              itemStyle={{ color: "#0F766E", fontWeight: 700 }}
              labelStyle={{ color: "#64748B", fontWeight: 600, marginBottom: "4px" }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "11px", fontWeight: 600, paddingTop: "15px" }}
            />
            <Line
              type="monotone"
              dataKey="IR DBD"
              name={lineName}
              stroke="#0F766E"
              strokeWidth={3}
              activeDot={{ r: 7, strokeWidth: 0, fill: "#14B8A6" }}
              dot={{ r: 5, strokeWidth: 2, fill: "#FFFFFF", stroke: "#0F766E" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
