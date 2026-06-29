export default function ScoreRing({ score, color, size = 140 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 13;
  const circ = 2 * Math.PI * r;
  const fill = score ? Math.min(100, Math.max(0, Number(score))) / 100 : 0;
  const offset = circ * (1 - fill);
  const display = score || '--';

  const getStatus = (s) => {
    if (!s || s === '--') return 'No Data';
    const num = Number(s);
    if (num >= 85) return 'Optimal';
    if (num >= 70) return 'Good';
    if (num >= 60) return 'Fair';
    return 'Pay Attention';
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10"/>
      <circle
        cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={circ.toFixed(2)}
        strokeDashoffset={offset.toFixed(2)}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(.23,1,.32,1)' }}
      />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="white"
        fontSize={display === '--' ? 22 : 30} fontWeight="800" fontFamily="Outfit" dominantBaseline="auto">
        {display}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill="rgba(255,255,255,0.45)"
        fontSize="11" fontFamily="Inter" dominantBaseline="auto">
        {getStatus(score)}
      </text>
    </svg>
  );
}