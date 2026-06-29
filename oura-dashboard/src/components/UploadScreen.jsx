import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { parseCSV, dateKey } from '../utils/csvParser';

const FILE_MAP = {
  'dailyactivity': 'activity',
  'dailyreadiness': 'readiness',
  'dailysleep': 'sleep',
  'dailyspo2': 'spo2',
  'heartrate': 'heartrate',
  'temperature': 'temperature',
  'sleeptime': 'sleeptime',
  'dailystress': 'stress',
  'dailyresilience': 'resilience',
  'daytimestress': 'daytimestress',
  'dailycardiovascularage': 'cardiovascularage',
  'sleepmodel': 'sleepmodel'
};

export default function UploadScreen({ onDataLoaded }) {
  const [loadedFiles, setLoadedFiles] = useState({});
  const [isReady, setIsReady] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const newLoaded = { ...loadedFiles };
    const appData = {};

    for (const file of acceptedFiles) {
      const baseName = file.name.replace('.csv', '').replace(/\s/g, '').toLowerCase();
      const key = Object.keys(FILE_MAP).find(k => baseName.includes(k));
      if (!key) continue;
      
      const text = await file.text();
      const rows = parseCSV(text);
      const dataKey = FILE_MAP[key];
      
      // Group by date
      const grouped = {};
      for (const row of rows) {
        const d = dateKey(row.day || row.timestamp || '');
        if (!d) continue;
        if (!grouped[d]) grouped[d] = [];
        grouped[d].push(row);
      }
      appData[dataKey] = grouped;
      newLoaded[key] = true;
    }

    setLoadedFiles(newLoaded);
    setIsReady(Object.keys(newLoaded).length > 0);

    // Pass data up
    onDataLoaded(appData);
  }, [loadedFiles, onDataLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: true,
  });

  const fileList = Object.keys(FILE_MAP).map(key => ({
    key,
    label: `${key}.csv`,
    loaded: loadedFiles[key] || false,
  }));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="upload-logo animate-float">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="36" stroke="rgba(6,182,212,0.2)" stroke-width="8"/>
            <circle cx="40" cy="40" r="36" stroke="url(#ring-grad)" stroke-width="8"
                    stroke-dasharray="226" stroke-dashoffset="56" stroke-linecap="round"
                    transform="rotate(-90 40 40)"/>
            <defs>
              <linearGradient id="ring-grad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#06b6d4"/>
                <stop offset="100%" stop-color="#8b5cf6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 className="text-4xl font-outfit font-extrabold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%] animate-gradient-shift">
          yOura Insights
        </h1>
        <p className="text-slate-400 mt-2 max-w-md mx-auto">
          Upload your exported Oura Ring CSV files to view your personal health dashboard
        </p>
      </motion.div>

      <div
        {...getRootProps()}
        className={`w-full max-w-2xl glass p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-cyan-400 bg-cyan-400/5 shadow-lg shadow-cyan-400/10' : ''
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-slate-200">
          {isDragActive ? 'Drop your CSV files here' : 'Drag & drop your CSV files here'}
        </p>
        <p className="text-sm text-slate-400 mt-1">or click to browse — select all 12 exported files at once</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 text-left">
          {fileList.map(({ key, label, loaded }) => (
            <div
              key={key}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                loaded ? 'bg-cyan-400/10 text-cyan-400' : 'bg-white/5 text-slate-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${loaded ? 'bg-cyan-400' : 'bg-slate-600'}`} />
              {label}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          if (isReady) {
            // The actual generation is triggered by parent after data is loaded.
            // But we already called onDataLoaded, so we just need to signal that we're done.
            // We'll let the parent handle the transition.
          }
        }}
        disabled={!isReady}
        className={`mt-8 px-8 py-3 rounded-full font-outfit font-semibold transition-all ${
          isReady
            ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-white shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 hover:-translate-y-1'
            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
        }`}
      >
        Generate Dashboard
      </button>
      <p className="text-xs text-slate-500 mt-4">Your data never leaves your browser — all processing is done locally.</p>
    </div>
  );
}