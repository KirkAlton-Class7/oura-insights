const DAY_MS = 86400000;

export const groupDatesIntoWeeks = (dates) => {
  const weekStarts = new Set();

  Array.from(new Set(dates)).sort().forEach((date) => {
    const [year, month, day] = date.split('-').map(Number);
    const value = Date.UTC(year, month - 1, day);
    weekStarts.add(value - new Date(value).getUTCDay() * DAY_MS);
  });

  return Array.from(weekStarts)
    .sort((a, b) => a - b)
    .map(weekStart => Array.from({ length: 7 }, (_, offset) => (
      new Date(weekStart + offset * DAY_MS).toISOString().slice(0, 10)
    )));
};

export const getWeekday = (date) => {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
};

export const selectDateInWeek = (currentDate, dates) => {
  if (!dates.length) return '';
  const targetWeekday = getWeekday(currentDate);
  const matchingDate = dates.find(date => getWeekday(date) === targetWeekday);
  if (matchingDate) return matchingDate;

  return dates.reduce((closest, date) => (
    Math.abs(getWeekday(date) - targetWeekday) < Math.abs(getWeekday(closest) - targetWeekday)
      ? date
      : closest
  ), dates[0]);
};

export const findWeekIndex = (weeks, date) => {
  const index = weeks.findIndex(week => week.includes(date));
  return index < 0 ? 0 : index;
};
