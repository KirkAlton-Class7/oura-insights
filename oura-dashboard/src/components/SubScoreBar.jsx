export default function SubScoreBar({ label, value, color }) {
  const v = value !== null && value !== undefined ? Number(value) : null;
  const display = v !== null ? v : '--';
  const width = v !== null ? Math.min(v, 100) : 0;

  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-slate-400 capitalize">{label}</span>
        <span className="font-mono text-slate-300">{display}</span>
      </div>
      <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden mt-1">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}