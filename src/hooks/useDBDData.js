import { useState, useEffect } from "react";
import Papa from "papaparse";

export const useDBDData = () => {
  const [dbdData, setDbdData] = useState([]);
  const [geojson, setGeojson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch and Parse CSV using PapaParse
        const csvResponse = await fetch("/data/dbd.csv");
        if (!csvResponse.ok) {
          throw new Error("Gagal mengambil data CSV DBD.");
        }
        const csvText = await csvResponse.text();
        
        const parsedCsv = Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });

        if (parsedCsv.errors && parsedCsv.errors.length > 0) {
          console.warn("Peringatan PapaParse:", parsedCsv.errors);
        }

        // Map the properties of parsedCsv.data to ensure consistent names and types
        const cleanDbdData = parsedCsv.data.map(row => ({
          tahun: parseInt(row.tahun),
          id_kabupaten_kota: parseInt(row.id_kabupaten_kota),
          kabupaten_kota: row.kabupaten_kota,
          curah_hujan: parseFloat(row.curah_hujan) || 0,
          kelembaban: parseFloat(row.kelembaban) || 0,
          suhu: parseFloat(row.suhu) || 0,
          sanitasi_layak: parseFloat(row.sanitasi_layak) || 0,
          rasio_puskesmas: parseFloat(row.rasio_puskesmas) || 0,
          kepadatan_penduduk: parseInt(row.kepadatan_penduduk) || 0,
          ir_dbd: parseFloat(row.ir_dbd) || 0
        }));

        // 2. Fetch GeoJSON
        const geojsonResponse = await fetch("/data/jatim.geojson");
        if (!geojsonResponse.ok) {
          throw new Error("Gagal mengambil data GeoJSON Jawa Timur.");
        }
        const geojsonData = await geojsonResponse.json();

        setDbdData(cleanDbdData);
        setGeojson(geojsonData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { dbdData, geojson, loading, error };
};
