/**
 * Utility functions to generate dynamic insights and statistics for DBD Jawa Timur
 */

// Helper to calculate average of a property in an array of objects
const calcAvg = (arr, prop) => {
  if (!arr || arr.length === 0) return 0;
  const sum = arr.reduce((acc, item) => acc + (parseFloat(item[prop]) || 0), 0);
  return sum / arr.length;
};

/**
 * Generates detailed comparative insights for a specific district compared to East Java averages
 * @param {Object} district - The selected district data for a specific year
 * @param {Array} allDistricts - Data for all districts for the same year
 * @returns {string} Textual comparative analysis
 */
export const generateComparativeInsight = (district, allDistricts) => {
  if (!district || !allDistricts || allDistricts.length === 0) {
    return "Silakan pilih kabupaten/kota pada peta atau dropdown filter untuk melihat analisis mendalam.";
  }

  const avgIR = calcAvg(allDistricts, "ir_dbd");
  const avgCh = calcAvg(allDistricts, "curah_hujan");
  const avgSuhu = calcAvg(allDistricts, "suhu");
  const avgHm = calcAvg(allDistricts, "kelembaban");
  const avgSan = calcAvg(allDistricts, "sanitasi_layak");
  const avgKp = calcAvg(allDistricts, "kepadatan_penduduk");
  const avgRp = calcAvg(allDistricts, "rasio_puskesmas");

  const irDiff = district.ir_dbd - avgIR;
  const isHighIR = district.ir_dbd > avgIR;
  const isHighRain = district.curah_hujan > avgCh;
  const isHighDensity = district.kepadatan_penduduk > avgKp;
  const isLowSanitation = district.sanitasi_layak < avgSan;

  let text = `**${district.kabupaten_kota}** memiliki Incidence Rate (IR) sebesar **${district.ir_dbd.toFixed(2)}** kasus per 100.000 penduduk. `;
  
  if (isHighIR) {
    text += `Angka ini **${Math.abs(irDiff).toFixed(2)} poin lebih tinggi** dibandingkan dengan rata-rata Jawa Timur (${avgIR.toFixed(2)}). Wilayah ini dikategorikan dalam zona risiko tinggi. `;
  } else {
    text += `Angka ini **${Math.abs(irDiff).toFixed(2)} poin lebih rendah** dibandingkan dengan rata-rata Jawa Timur (${avgIR.toFixed(2)}). Wilayah ini dikategorikan dalam tingkat risiko yang relatif terkendali. `;
  }

  // Environmental context
  text += `\n\nDari sisi faktor lingkungan, curah hujan tercatat sebesar **${district.curah_hujan.toFixed(1)} mm** (${isHighRain ? "di atas" : "di bawah"} rata-rata Jatim: ${avgCh.toFixed(1)} mm) dengan kelembaban udara **${district.kelembaban.toFixed(1)}%** (rata-rata Jatim: ${avgHm.toFixed(1)}%). `;

  if (isHighRain && district.kelembaban > 80) {
    text += `Kombinasi curah hujan tinggi dan kelembaban di atas 80% menciptakan habitat perkembangbiakan nyamuk Aedes aegypti yang sangat ideal. `;
  }

  // Social/Infrastructure context
  text += `\n\nKepadatan penduduk di wilayah ini mencapai **${district.kepadatan_penduduk.toLocaleString()} jiwa/km²** (${isHighDensity ? "lebih padat" : "lebih renggang"} dari rata-rata Jatim: ${avgKp.toLocaleString()} jiwa/km²). `;
  
  if (isHighDensity) {
    text += `Kepadatan yang tinggi mempercepat laju transmisi virus dengue antar penduduk karena jarak terbang nyamuk yang relatif dekat. `;
  }

  text += `Akses terhadap sanitasi layak telah menjangkau **${district.sanitasi_layak.toFixed(1)}%** dari total populasi. `;
  if (isLowSanitation) {
    text += `Angka cakupan sanitasi ini masih **di bawah rata-rata Jatim (${avgSan.toFixed(1)}%)**, menunjukkan perlunya perbaikan infrastruktur pembuangan air dan kebersihan lingkungan untuk membatasi genangan air bersih. `;
  } else {
    text += `Cakupan sanitasi yang baik membantu mengurangi tempat pembuangan sampah liar yang berisiko menampung air hujan. `;
  }

  // Health Center ratio context
  text += `Rasio pusat kesehatan masyarakat (Puskesmas) adalah **${district.rasio_puskesmas.toFixed(2)} per 10.000 penduduk** (rata-rata Jatim: ${avgRp.toFixed(2)}). `;

  // Actionable advice
  text += `\n\n**Rekomendasi Tindakan:** `;
  if (isHighIR) {
    text += `Diperlukan langkah intervensi segera berupa Gerakan 3M Plus secara masif, pengasapan (fogging) terarah di area pemukiman padat, serta peningkatan kewaspadaan fasilitas kesehatan tingkat pertama untuk diagnosis dini kasus DBD guna menekan angka fatalitas.`;
  } else {
    text += `Pertahankan program preventif rutin PSN (Pemberantasan Sarang Nyamuk) mandiri di tingkat rukun tetangga, terutama saat memasuki masa pancaroba dan musim hujan untuk mencegah lonjakan kasus musiman.`;
  }

  return text;
};

/**
 * Generates global statistics and insights for highlight cards
 * @param {Array} allData - Raw array of all CSV records across all years
 * @param {number} selectedYear - Current selected filter year
 * @returns {Object} Global statistics & insights
 */
export const generateGlobalInsights = (allData, selectedYear) => {
  if (!allData || allData.length === 0) return {};

  const currentYearData = allData.filter(d => parseInt(d.tahun) === selectedYear);
  if (currentYearData.length === 0) return {};

  // 1. Highest Risk District in selected year
  const highestRisk = currentYearData.reduce((prev, curr) => (parseFloat(curr.ir_dbd) > parseFloat(prev.ir_dbd) ? curr : prev), currentYearData[0]);

  // 2. Lowest Risk District in selected year
  const lowestRisk = currentYearData.reduce((prev, curr) => (parseFloat(curr.ir_dbd) < parseFloat(prev.ir_dbd) ? curr : prev), currentYearData[0]);

  // 3. Year with highest average incidence
  const years = [...new Set(allData.map(d => parseInt(d.tahun)))];
  const yearAverages = years.map(yr => {
    const yrData = allData.filter(d => parseInt(d.tahun) === yr);
    return { year: yr, avgIR: calcAvg(yrData, "ir_dbd") };
  });
  const highestAvgYear = yearAverages.reduce((prev, curr) => (curr.avgIR > prev.avgIR ? curr : prev), yearAverages[0]);

  // 4. Largest increase & decrease from previous year
  let maxIncrease = { district: "Tidak ada data pembanding", value: 0 };
  let maxDecrease = { district: "Tidak ada data pembanding", value: 0 };

  const prevYearData = allData.filter(d => parseInt(d.tahun) === selectedYear - 1);
  if (prevYearData.length > 0) {
    let largestInc = -Infinity;
    let largestDec = -Infinity;
    let incDist = "";
    let decDist = "";

    currentYearData.forEach(curr => {
      const prev = prevYearData.find(p => p.id_kabupaten_kota === curr.id_kabupaten_kota);
      if (prev) {
        const diff = parseFloat(curr.ir_dbd) - parseFloat(prev.ir_dbd);
        if (diff > largestInc) {
          largestInc = diff;
          incDist = curr.kabupaten_kota;
        }
        // Decrease means negative diff, so we want the most negative value (largest absolute drop)
        const drop = parseFloat(prev.ir_dbd) - parseFloat(curr.ir_dbd);
        if (drop > largestDec) {
          largestDec = drop;
          decDist = curr.kabupaten_kota;
        }
      }
    });

    if (largestInc > 0) maxIncrease = { district: incDist, value: largestInc };
    if (largestDec > 0) maxDecrease = { district: decDist, value: largestDec };
  }

  return {
    highestRisk: {
      district: highestRisk.kabupaten_kota,
      value: highestRisk.ir_dbd
    },
    lowestRisk: {
      district: lowestRisk.kabupaten_kota,
      value: lowestRisk.ir_dbd
    },
    highestAvgYear: {
      year: highestAvgYear.year,
      value: highestAvgYear.avgIR
    },
    maxIncrease,
    maxDecrease,
    currentYearAverage: calcAvg(currentYearData, "ir_dbd")
  };
};
