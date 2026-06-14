/**
 * Utility containing yearly risk thresholds and classification logic
 */

export const yearlyThresholds = {
  2020: {
    bounds: [6.61, 18.93, 35.60],
    ranges: ["0,53 – 6,61", "7,16 – 18,93", "21,20 – 35,60", "53,00 – 188,01"],
    labels: [
      "Rendah (0,53 – 6,61)",
      "Sedang (7,16 – 18,93)",
      "Tinggi (21,20 – 35,60)",
      "Sangat Tinggi (53,00 – 188,01)"
    ]
  },
  2021: {
    bounds: [9.33, 14.29, 21.53],
    ranges: ["1,05 – 9,33", "10,00 – 14,29", "14,43 – 21,53", "25,33 – 226,73"],
    labels: [
      "Rendah (1,05 – 9,33)",
      "Sedang (10,00 – 14,29)",
      "Tinggi (14,43 – 21,53)",
      "Sangat Tinggi (25,33 – 226,73)"
    ]
  },
  2022: {
    bounds: [16.99, 31.46, 55.07],
    ranges: ["2,71 – 16,99", "17,55 – 31,46", "32,29 – 55,07", "62,21 – 196,71"],
    labels: [
      "Rendah (2,71 – 16,99)",
      "Sedang (17,55 – 31,46)",
      "Tinggi (32,29 – 55,07)",
      "Sangat Tinggi (62,21 – 196,71)"
    ]
  },
  2023: {
    bounds: [12.15, 20.58, 34.89],
    ranges: ["0,47 – 12,15", "12,20 – 20,58", "20,66 – 34,89", "37,19 – 483,05"],
    labels: [
      "Rendah (0,47 – 12,15)",
      "Sedang (12,20 – 20,58)",
      "Tinggi (20,66 – 34,89)",
      "Sangat Tinggi (37,19 – 483,05)"
    ]
  },
  2024: {
    bounds: [29.67, 56.07, 117.18],
    ranges: ["0,51 – 29,67", "30,01 – 56,07", "57,01 – 117,18", "136,15 – 1817,95"],
    labels: [
      "Rendah (0,51 – 29,67)",
      "Sedang (30,01 – 56,07)",
      "Tinggi (57,01 – 117,18)",
      "Sangat Tinggi (136,15 – 1817,95)"
    ]
  },
  2025: {
    bounds: [19.50, 41.59, 122.74],
    ranges: ["0,50 – 19,50", "20,47 – 41,59", "42,75 – 122,74", "129,15 – 980,62"],
    labels: [
      "Rendah (0,50 – 19,50)",
      "Sedang (20,47 – 41,59)",
      "Tinggi (42,75 – 122,74)",
      "Sangat Tinggi (129,15 – 980,62)"
    ]
  }
};

/**
 * Classifies the risk category based on the incidence rate (IR) and the year.
 * Returns 0 for Low, 1 for Moderate, 2 for High, and 3 for Very High.
 */
export const getRiskCategory = (ir, year) => {
  const currentThresholds = yearlyThresholds[year] || yearlyThresholds[2025];
  const [q1, q2, q3] = currentThresholds.bounds;
  if (ir <= q1) return 0;
  if (ir <= q2) return 1;
  if (ir <= q3) return 2;
  return 3;
};
