// Utility to format duration in seconds to human-readable string
function fmtDuration(secs) {
  if (!secs || secs === 0) return '0m';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

// Helper to format a value with a label
function formatSection(label, value, indent = '  ') {
  return `${indent}${label}: ${value}`;
}

export function buildDashboardSnapshot({ selectedDate, dateWindow, appData }) {
  const lines = [];
  const indent = '  ';

  // Header
  lines.push('Oura Insights Dashboard Snapshot');
  lines.push('==================================');
  lines.push(`Date: ${selectedDate}`);
  lines.push('');

  // ---- SCORE CARDS ----
  lines.push('--- Scores ---');
  ['readiness', 'sleep', 'activity'].forEach(cat => {
    const data = appData[cat]?.[selectedDate]?.[0];
    if (data) {
      const label = cat.charAt(0).toUpperCase() + cat.slice(1);
      lines.push(`${label}: ${data.score || '--'}`);
      if (data.contributors) {
        Object.entries(data.contributors).forEach(([k, v]) => {
          lines.push(`  ${k.replace(/_/g, ' ')}: ${v}`);
        });
      }
      lines.push('');
    }
  });

  // ---- SLEEP DETAILS (from sleepmodel) ----
  const sleepModel = (appData.sleepmodel?.[selectedDate] || []).find(r => r.type === 'long_sleep') || appData.sleepmodel?.[selectedDate]?.[0];
  if (sleepModel) {
    lines.push('--- Sleep Details ---');
    const deep = Number(sleepModel.deep_sleep_duration || 0);
    const rem = Number(sleepModel.rem_sleep_duration || 0);
    const light = Number(sleepModel.light_sleep_duration || 0);
    const awake = Number(sleepModel.awake_time || 0);
    const total = deep + rem + light;
    lines.push(`Total Sleep: ${fmtDuration(total)}`);
    lines.push(`Deep: ${fmtDuration(deep)}`);
    lines.push(`REM: ${fmtDuration(rem)}`);
    lines.push(`Light: ${fmtDuration(light)}`);
    lines.push(`Awake: ${fmtDuration(awake)}`);
    if (sleepModel.average_heart_rate) {
      lines.push(`Avg HR: ${Number(sleepModel.average_heart_rate).toFixed(0)} bpm`);
    }
    if (sleepModel.average_hrv) {
      lines.push(`Avg HRV: ${Number(sleepModel.average_hrv).toFixed(0)} ms`);
    }
    if (sleepModel.efficiency) {
      lines.push(`Efficiency: ${Number(sleepModel.efficiency)}%`);
    }
    lines.push('');
  }

  // ---- ACTIVITY DETAILS ----
  const activityData = appData.activity?.[selectedDate]?.[0];
  if (activityData) {
    lines.push('--- Activity Details ---');
    lines.push(`Steps: ${activityData.steps || '--'}`);
    lines.push(`Active Calories: ${activityData.active_calories || '--'}`);
    lines.push(`Total Calories: ${activityData.total_calories || '--'}`);
    if (activityData.equivalent_walking_distance) {
      const miles = (Number(activityData.equivalent_walking_distance) / 1609.344).toFixed(2);
      lines.push(`Equivalent Walking Distance: ${miles} mi`);
    }
    // Activity breakdown
    const high = Number(activityData.high_activity_time || 0);
    const med = Number(activityData.medium_activity_time || 0);
    const low = Number(activityData.low_activity_time || 0);
    const sed = Number(activityData.sedentary_time || 0);
    lines.push(`Vigorous: ${fmtDuration(high)}`);
    lines.push(`Moderate: ${fmtDuration(med)}`);
    lines.push(`Light: ${fmtDuration(low)}`);
    lines.push(`Sedentary: ${fmtDuration(sed)}`);
    lines.push('');
  }

  // ---- STRESS & RESILIENCE ----
  const stressData = appData.stress?.[selectedDate]?.[0];
  const resilienceData = appData.resilience?.[selectedDate]?.[0];
  if (stressData || resilienceData) {
    lines.push('--- Stress & Resilience ---');
    if (stressData) {
      lines.push(`Stress High: ${fmtDuration(Number(stressData.stress_high || 0))}`);
      lines.push(`Recovery High: ${fmtDuration(Number(stressData.recovery_high || 0))}`);
      if (stressData.day_summary) {
        lines.push(`Day Summary: ${stressData.day_summary}`);
      }
    }
    if (resilienceData) {
      lines.push(`Resilience Level: ${resilienceData.level || 'N/A'}`);
      if (resilienceData.contributors) {
        Object.entries(resilienceData.contributors).forEach(([k, v]) => {
          lines.push(`  ${k.replace(/_/g, ' ')}: ${v}`);
        });
      }
    }
    // Daytime stress averages
    const dtRecs = appData.daytimestress?.[selectedDate] || [];
    const stressVals = dtRecs.map(r => Number(r.stress_value)).filter(v => !isNaN(v) && v > 0);
    const recovVals = dtRecs.map(r => Number(r.recovery_value)).filter(v => !isNaN(v) && v > 0);
    if (stressVals.length) {
      const avg = Math.round(stressVals.reduce((a, b) => a + b, 0) / stressVals.length);
      lines.push(`Avg Stress (daytime): ${avg} (${stressVals.length} readings)`);
    }
    if (recovVals.length) {
      const avg = Math.round(recovVals.reduce((a, b) => a + b, 0) / recovVals.length);
      lines.push(`Avg Recovery (daytime): ${avg} (${recovVals.length} readings)`);
    }
    lines.push('');
  }

  // ---- CARDIOVASCULAR ----
  const cardioData = appData.cardiovascularage?.[selectedDate]?.[0];
  if (cardioData) {
    lines.push('--- Cardiovascular Health ---');
    if (cardioData.vascular_age) {
      lines.push(`Vascular Age: ${Number(cardioData.vascular_age)} years`);
    }
    if (cardioData.pulse_wave_velocity) {
      lines.push(`Pulse Wave Velocity: ${Number(cardioData.pulse_wave_velocity).toFixed(2)} m/s`);
    }
    lines.push('');
  }

  // ---- BIOMETRICS ----
  const spo2Data = appData.spo2?.[selectedDate]?.[0];
  const hrRecs = appData.heartrate?.[selectedDate] || [];
  const tempRecs = appData.temperature?.[selectedDate] || [];
  const hasBiometrics = spo2Data || hrRecs.length || tempRecs.length;
  if (hasBiometrics) {
    lines.push('--- Biometrics ---');
    if (spo2Data) {
      const avg = spo2Data.spo2_percentage?.average;
      if (avg) lines.push(`SpO₂ (avg): ${Number(avg).toFixed(1)}%`);
      if (spo2Data.breathing_disturbance_index !== undefined) {
        lines.push(`Breathing Disturbance Index: ${spo2Data.breathing_disturbance_index}`);
      }
    }
    if (hrRecs.length) {
      const bpms = hrRecs.map(r => Number(r.bpm)).filter(v => v > 0 && v < 250);
      if (bpms.length) {
        const avg = Math.round(bpms.reduce((a, b) => a + b, 0) / bpms.length);
        const min = Math.min(...bpms);
        const max = Math.max(...bpms);
        lines.push(`Heart Rate: avg ${avg} bpm (min ${min}, max ${max}, ${bpms.length} readings)`);
      }
    }
    if (tempRecs.length) {
      const temps = tempRecs.map(r => Number(r.skin_temp)).filter(v => v > 0);
      if (temps.length) {
        const avg = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
        const min = Math.min(...temps).toFixed(1);
        const max = Math.max(...temps).toFixed(1);
        lines.push(`Skin Temperature: avg ${avg}°C (min ${min}, max ${max}, ${temps.length} readings)`);
      }
    }
    lines.push('');
  }

  // ---- DATE WINDOW (optional) ----
  if (dateWindow && dateWindow.length) {
    lines.push('--- Available Dates ---');
    lines.push(dateWindow.join(', '));
    lines.push('');
  }

  // Footer
  lines.push('==================================');
  lines.push(`Snapshot generated: ${new Date().toLocaleString()}`);

  return lines.join('\n');
}