import React from "react";
import { ShieldAlert } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const technologies = [
    "React 19",
    "Vite",
    "Tailwind CSS v4",
    "React Leaflet",
    "Recharts",
    "PapaParse",
    "Framer Motion",
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-12 px-6 md:px-12 lg:px-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Branding & Logo */}
        <div className="space-y-3 text-center md:text-left max-w-sm">
          <div className="flex items-center justify-center md:justify-start gap-2.5 text-white font-extrabold text-lg">
            <span className="p-1.5 rounded-lg bg-teal-600 text-slate-950"><ShieldAlert size={18} /></span>
            <span>DBD Jawa Timur <span className="text-teal-400 font-light">Insight</span></span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-light">
            Portal data terbuka untuk monitoring, analisis korelasi lingkungan, dan pemetaan sebaran Demam Berdarah Dengue (DBD) di Provinsi Jawa Timur.
          </p>
        </div>

        {/* Tech Stack Spans */}
        <div className="flex flex-col items-center md:items-end gap-3.5">
          <div className="flex flex-wrap justify-center md:justify-end gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="text-[10px] md:text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 select-none"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Credit */}
          <p className="text-[10px] text-slate-600 dark:text-slate-500 font-medium flex items-center gap-1">
            Dibuat untuk pelayanan kesehatan masyarakat & akademis &copy; {currentYear}.
          </p>
        </div>

      </div>
    </footer>
  );
}
