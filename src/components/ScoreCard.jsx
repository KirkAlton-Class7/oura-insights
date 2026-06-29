import { motion } from 'framer-motion';
import ScoreRing from './ScoreRing';

export default function ScoreCard({ label, data, color, trendBars }) {
  const score = data?.score || null;

  return (
    <motion.div
      className="glass p-6 flex flex-col items-center gap-4 relative overflow-hidden"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-full flex justify-between items-center">
        <span className="text-xs font-outfit font-semibold uppercase tracking-wider text-cyan-300">
          {label}
        </span>
        <span className="text-xs text-slate-400">{score || '--'}</span>
      </div>
      <ScoreRing score={score} color={color} size={130} />
      <div className="flex items-end gap-1 w-full h-8">
        {trendBars}
      </div>
    </motion.div>
  );
}