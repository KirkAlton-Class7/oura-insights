import { useMemo, useState } from 'react';
import { findWeekIndex, groupDatesIntoWeeks, selectDateInWeek } from '../utils/dateNavigation';

export function useDateNavigation(availableDates, initialDate = '') {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const dateWeeks = useMemo(() => groupDatesIntoWeeks(availableDates), [availableDates]);
  const weekIndex = useMemo(() => findWeekIndex(dateWeeks, selectedDate), [dateWeeks, selectedDate]);
  const weekDates = useMemo(() => dateWeeks[weekIndex] || [], [dateWeeks, weekIndex]);
  const availableDateSet = useMemo(() => new Set(availableDates), [availableDates]);
  const dateWindow = useMemo(
    () => weekDates.filter(date => availableDateSet.has(date)),
    [weekDates, availableDateSet],
  );

  const changeWeek = (direction) => {
    const nextIndex = Math.min(Math.max(weekIndex + direction, 0), dateWeeks.length - 1);
    if (nextIndex === weekIndex) return;

    const nextWeek = dateWeeks[nextIndex].filter(date => availableDateSet.has(date));
    setSelectedDate(selectDateInWeek(selectedDate, nextWeek));
  };

  return {
    selectedDate,
    setSelectedDate,
    weekDates,
    dateWindow,
    changeWeek,
    canPrevious: weekIndex > 0,
    canNext: weekIndex < dateWeeks.length - 1,
  };
}
