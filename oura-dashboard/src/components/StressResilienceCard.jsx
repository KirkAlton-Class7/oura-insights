import Card from './Card';
import SubScoreBar from './SubScoreBar';
import { useToast } from '../context/ToastContext';

export default function StressResilienceCard({ stressData, resilienceData, daytimeStressData }) {
  const { showToast } = useToast();

  // Compute average stress/recovery from daytimestress
  const stressVals = daytimeStressData.map(r => Number(r.stress_value)).filter(v => !isNaN(v) && v > 0);
  const recovVals = daytimeStressData.map(r => Number(r.recovery_value)).filter(v => !isNaN(v) && v > 0);
  const avgStress = stressVals.length ? Math.round(stressVals.reduce((a, b) => a + b, 0) / stressVals.length) : null;
  const avgRecov = recovVals.length ? Math.round(recovVals.reduce((a, b) => a + b, 0) / recovVals.length) : null;

  if (!stressData && !resilienceData && !avgStress) {
    return (
      <Card title="Stress & Resilience" subtitle="No data available" onCopyFailure={() => showToast('No data to copy')}>
        <div className="text-slate-400 text-center py-8">No stress or resilience data for this date</div>
      </Card>
    );
  }

  const fmtDuration = (secs) => {
    if (!secs) return '0m';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  const stressHigh = stressData?.stress_high ? Number(stressData.stress_high) : 0;
  const recovHigh = stressData?.recovery_high ? Number(stressData.recovery_high) : 0;
  const totalTime = stressHigh + recovHigh || 1;
  const daySummary = stressData?.day_summary || null;
  const summaryColors = { normal: '#10b981', stressful: '#f43f5e', restorative: '#06b6d4', balanced: '#f59e0b' };
  const summaryColor = daySummary ? (summaryColors[daySummary] || '#94a3b8') : '#94a3b8';

  const levelColors = { exceptional: '#10b981', strong: '#06b6d4', solid: '#f59e0b', adequate: '#f59e0b', limited: '#f43f5e' };
  const levelLabel = resilienceData?.level ? resilienceData.level.charAt(0).toUpperCase() + resilienceData.level.slice(1) : null;
  const levelColor = resilienceData?.level ? (levelColors[resilienceData.level] || '#94a3b8') : '#94a3b8';
  const resContrib = resilienceData?.contributors || {};

  return (
    <Card
      title="Stress & Resilience"
      subtitle="Daily stress, recovery, and resilience"
      snapshotText={`Stress summary: ${daySummary || 'N/A'}`}
      snapshotLabel="Stress & Resilience snapshot"
      onCopyFailure={() => showToast('Failed to copy Stress & Resilience snapshot.')}
      onCopySuccess={() => showToast('Stress & Resilience snapshot copied to clipboard.')}
    >
      <div className="space-y-4">
        {(stressHigh > 0 || recovHigh > 0) && (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 w-16">Stress</span>
              <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-red-400" style={{ width: `${(stressHigh / totalTime) * 100}%` }} />
              </div>
              <span className="text-xs font-mono text-slate-400 w-16 text-right">{fmtDuration(stressHigh)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 w-16">Recovery</span>
              <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-emerald-400" style={{ width: `${(recovHigh / totalTime) * 100}%` }} />
              </div>
              <span className="text-xs font-mono text-slate-400 w-16 text-right">{fmtDuration(recovHigh)}</span>
            </div>
          </div>
        )}

        {(avgStress !== null || avgRecov !== null) && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            {avgStress !== null && (
              <div><span className="text-slate-400">Avg Stress</span><br /><span className="text-white font-mono">{avgStress}</span></div>
            )}
            {avgRecov !== null && (
              <div><span className="text-slate-400">Avg Recovery</span><br /><span className="text-white font-mono">{avgRecov}</span></div>
            )}
          </div>
        )}

        {daySummary && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Day Summary:</span>
            <span className="text-sm font-medium" style={{ color: summaryColor }}>{daySummary.charAt(0).toUpperCase() + daySummary.slice(1)}</span>
          </div>
        )}

        {resilienceData && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Resilience</span>
              {levelLabel && <span className="font-outfit font-bold" style={{ color: levelColor }}>{levelLabel}</span>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {resContrib.daytime_recovery !== undefined && (
                <SubScoreBar label="Daytime Recovery" value={Math.round(resContrib.daytime_recovery)} color="#06b6d4" />
              )}
              {resContrib.sleep_recovery !== undefined && (
                <SubScoreBar label="Sleep Recovery" value={Math.round(resContrib.sleep_recovery)} color="#8b5cf6" />
              )}
              {resContrib.stress !== undefined && (
                <SubScoreBar label="Stress Capacity" value={Math.round(resContrib.stress)} color="#f43f5e" />
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}