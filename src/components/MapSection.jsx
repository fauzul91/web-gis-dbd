import React, { useRef, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getRiskCategory, yearlyThresholds } from "../utils/riskLevels";

// Risk styling helpers
const getRiskColor = (ir, year) => {
  const cat = getRiskCategory(ir, year);
  if (cat === 0) return "#10B981"; // Green (Low)
  if (cat === 1) return "#F59E0B"; // Yellow (Moderate)
  if (cat === 2) return "#F97316"; // Orange (High)
  return "#EF4444"; // Red (Very High)
};

const getRiskLabel = (ir, year) => {
  const cat = getRiskCategory(ir, year);
  if (cat === 0) return "Risiko Rendah";
  if (cat === 1) return "Risiko Sedang";
  if (cat === 2) return "Risiko Tinggi";
  return "Risiko Sangat Tinggi";
};

export default function MapSection({
  geojson,
  dbdData,
  selectedYear,
  selectedDistrict,
  onSelectDistrict,
}) {
  const geojsonRef = useRef(null);

  // East Java geographic center
  const center = [-7.6, 112.7]; 
  const zoom = 8;

  // We find data for a feature by matching the CC_2 code with the id_kabupaten_kota in our CSV data.
  const getFeatureData = (feature) => {
    if (!feature || !feature.properties) return null;
    const code = parseInt(feature.properties.CC_2);
    return dbdData.find((d) => d.id_kabupaten_kota === code);
  };

  // Define styles for each polygon
  const geojsonStyle = (feature) => {
    const data = getFeatureData(feature);
    const ir = data ? data.ir_dbd : 0;
    
    // Highlight if selected
    const isSelected = selectedDistrict && data && data.kabupaten_kota.toLowerCase() === selectedDistrict.toLowerCase();

    return {
      fillColor: getRiskColor(ir, selectedYear),
      weight: isSelected ? 3.5 : 1.5,
      opacity: 1,
      color: isSelected ? "#0F766E" : "#FFFFFF", // Teal border for selected
      fillOpacity: isSelected ? 0.95 : 0.75,
      dashArray: isSelected ? "" : "3",
    };
  };

  const onEachFeature = (feature, layer) => {
    const data = getFeatureData(feature);
    const name = feature.properties.NAME_2 || "Tidak Diketahui";
    const ir = data ? data.ir_dbd : 0;
    const category = getRiskLabel(ir, selectedYear);
    const color = getRiskColor(ir, selectedYear);

    // Setup hover events
    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 3,
          color: "#0F766E",
          fillOpacity: 0.9,
        });
        l.bringToFront();
      },
      mouseout: (e) => {
        const l = e.target;
        // Reset to normal style unless it's the selected district
        const isSelected = selectedDistrict && data && data.kabupaten_kota.toLowerCase() === selectedDistrict.toLowerCase();
        l.setStyle({
          weight: isSelected ? 3.5 : 1.5,
          color: isSelected ? "#0F766E" : "#FFFFFF",
          fillOpacity: isSelected ? 0.95 : 0.75,
        });
      },
      click: () => {
        if (data) {
          onSelectDistrict(data.kabupaten_kota);
        }
      },
    });

    // Bind Tooltip
    layer.bindTooltip(
      `
      <div class="p-2 font-sans text-slate-800 dark:text-slate-100">
        <h4 class="font-bold text-sm text-teal-800 dark:text-teal-400 mb-0.5">${name}</h4>
        <div class="text-xs">
          <p class="mb-0.5">IR DBD: <span class="font-bold">${ir.toFixed(2)}</span></p>
          <p class="font-semibold" style="color: ${color}">${category}</p>
        </div>
      </div>
      `,
      { sticky: true, className: "bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md" }
    );
  };

  // We change the key of the GeoJSON component to force it to re-render when selections or data updates.
  const layerKey = `${selectedYear}_${dbdData.length}_${selectedDistrict || "none"}`;

  // East Java geographic bounds for restriction
  const bounds = [
    [-9.2, 110.0], // Southwest coordinates (Pacitan/South)
    [-6.3, 116.2]  // Northeast coordinates (Sumenep/North)
  ];

  // Get legend labels for the selected year
  const currentLabels = (yearlyThresholds[selectedYear] || yearlyThresholds[2025]).labels;

  return (
    <div className="relative h-[480px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={7.5}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {geojson && (
          <GeoJSON
            key={layerKey}
            data={geojson}
            style={geojsonStyle}
            onEachFeature={onEachFeature}
            ref={geojsonRef}
          />
        )}
      </MapContainer>

      {/* Floating Legend */}
      <div className="absolute bottom-4 left-4 z-[500] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl shadow-md border border-slate-200/50 dark:border-slate-700/50 max-w-xs text-xs font-semibold text-slate-700 dark:text-slate-200">
        <h5 className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Legenda Risiko DBD (IR)</h5>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-[#10B981] flex-shrink-0" />
            <span>{currentLabels[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-[#F59E0B] flex-shrink-0" />
            <span>{currentLabels[1]}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-[#F97316] flex-shrink-0" />
            <span>{currentLabels[2]}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-[#EF4444] flex-shrink-0" />
            <span>{currentLabels[3]}</span>
          </div>
        </div>
        <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-2 font-normal leading-tight">
          *IR: Kasus DBD per 100.000 penduduk
        </p>
      </div>
    </div>
  );
}

