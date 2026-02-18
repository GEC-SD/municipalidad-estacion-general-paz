'use client';

import { useState, useMemo, useCallback, MouseEvent } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
} from '@mui/icons-material';
import { Event, EventCategory } from '@/types';
import EventPopover from './EventPopover';

const CATEGORY_COLORS: Record<EventCategory, string> = {
  cultural: '#B52A1C',
  deportivo: '#F5A623',
  institucional: '#2E86C1',
  educativo: '#0288d1',
  social: '#2E7D32',
};

const WEEKDAYS = ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'];

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

type EventCalendarProps = {
  events: Event[];
  onMonthChange: (year: number, month: number) => void;
};

/** Return YYYY-MM-DD for a Date */
const toDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Check if a date falls within an event's range (inclusive) */
const isDateInEvent = (dateStr: string, event: Event) => {
  const start = event.event_date;
  const end = event.end_date || event.event_date;
  return dateStr >= start && dateStr <= end;
};

/** Check if a date is the start of an event range */
const isRangeStart = (dateStr: string, event: Event) =>
  event.end_date && event.end_date !== event.event_date && dateStr === event.event_date;

/** Check if a date is the end of an event range */
const isRangeEnd = (dateStr: string, event: Event) =>
  event.end_date && event.end_date !== event.event_date && dateStr === event.end_date;

/** Check if date is in the middle of a multi-day event */
const isRangeMid = (dateStr: string, event: Event) =>
  event.end_date &&
  event.end_date !== event.event_date &&
  dateStr > event.event_date &&
  dateStr < event.end_date;

const EventCalendar = ({ events, onMonthChange }: EventCalendarProps) => {
  const today = new Date();
  const todayStr = toDateStr(today);

  const [currentMonth, setCurrentMonth] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }));

  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [popoverEvents, setPopoverEvents] = useState<Event[]>([]);

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const { year, month } = currentMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay(); // 0=Sun

    const days: { date: Date; dateStr: string; isCurrentMonth: boolean }[] = [];

    // Previous month fill
    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, dateStr: toDateStr(d), isCurrentMonth: false });
    }

    // Current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      days.push({ date, dateStr: toDateStr(date), isCurrentMonth: true });
    }

    // Next month fill (complete last row)
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        const date = new Date(year, month + 1, d);
        days.push({ date, dateStr: toDateStr(date), isCurrentMonth: false });
      }
    }

    return days;
  }, [currentMonth]);

  // Map dateStr → events for that day
  const eventsMap = useMemo(() => {
    const map: Record<string, Event[]> = {};
    for (const day of calendarDays) {
      const dayEvents = events.filter((ev) => isDateInEvent(day.dateStr, ev));
      if (dayEvents.length > 0) {
        map[day.dateStr] = dayEvents;
      }
    }
    return map;
  }, [calendarDays, events]);

  // Multi-day range info per day
  const rangeMap = useMemo(() => {
    const map: Record<string, { color: string; isStart: boolean; isEnd: boolean; isMid: boolean }[]> = {};
    const multiDayEvents = events.filter((ev) => ev.end_date && ev.end_date !== ev.event_date);

    for (const day of calendarDays) {
      const ranges: { color: string; isStart: boolean; isEnd: boolean; isMid: boolean }[] = [];
      for (const ev of multiDayEvents) {
        if (isDateInEvent(day.dateStr, ev)) {
          ranges.push({
            color: CATEGORY_COLORS[ev.category] || CATEGORY_COLORS.institucional,
            isStart: !!isRangeStart(day.dateStr, ev),
            isEnd: !!isRangeEnd(day.dateStr, ev),
            isMid: !!isRangeMid(day.dateStr, ev),
          });
        }
      }
      if (ranges.length > 0) {
        map[day.dateStr] = ranges;
      }
    }
    return map;
  }, [calendarDays, events]);

  const navigateMonth = useCallback(
    (delta: number) => {
      setCurrentMonth((prev) => {
        let m = prev.month + delta;
        let y = prev.year;
        if (m < 0) { m = 11; y--; }
        if (m > 11) { m = 0; y++; }
        onMonthChange(y, m + 1);
        return { year: y, month: m };
      });
    },
    [onMonthChange]
  );

  const goToday = useCallback(() => {
    const y = today.getFullYear();
    const m = today.getMonth();
    setCurrentMonth({ year: y, month: m });
    onMonthChange(y, m + 1);
  }, [onMonthChange, today]);

  const handleDayClick = (e: MouseEvent<HTMLDivElement>, dateStr: string) => {
    const dayEvents = eventsMap[dateStr];
    if (dayEvents && dayEvents.length > 0) {
      setPopoverAnchor(e.currentTarget);
      setPopoverEvents(dayEvents);
    }
  };

  const { year, month } = currentMonth;

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: 4,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, md: 3 },
          py: 2,
          background: 'linear-gradient(135deg, #1A5F8B 0%, #2E86C1 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigateMonth(-1)} size="small" sx={{ color: 'white' }}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              minWidth: { xs: 160, md: 200 },
              textAlign: 'center',
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
            {MONTH_NAMES[month]} {year}
          </Typography>
          <IconButton onClick={() => navigateMonth(1)} size="small" sx={{ color: 'white' }}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <Button
          startIcon={<TodayIcon />}
          onClick={goToday}
          size="small"
          sx={{
            color: 'white',
            textTransform: 'none',
            fontSize: '0.8rem',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 2,
            px: 1.5,
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
          }}
        >
          Hoy
        </Button>
      </Box>

      {/* Weekday headers */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {WEEKDAYS.map((day) => (
          <Typography
            key={day}
            variant="caption"
            sx={{
              textAlign: 'center',
              py: 1,
              fontWeight: 700,
              color: 'text.secondary',
              fontSize: '0.7rem',
              letterSpacing: 0.5,
            }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      {/* Calendar grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
        }}
      >
        {calendarDays.map((day, idx) => {
          const dayEvents = eventsMap[day.dateStr];
          const hasEvents = !!dayEvents;
          const isToday = day.dateStr === todayStr;
          const ranges = rangeMap[day.dateStr];
          const dayNum = day.date.getDate();

          // Range background
          let rangeBg: string | undefined;
          let rangeBorderRadius = '0';
          if (ranges && ranges.length > 0) {
            const r = ranges[0];
            rangeBg = `${r.color}12`;
            if (r.isStart) rangeBorderRadius = '8px 0 0 8px';
            else if (r.isEnd) rangeBorderRadius = '0 8px 8px 0';
            else if (r.isMid) rangeBorderRadius = '0';
            else rangeBorderRadius = '8px'; // single-day with range (start & end same)
          }

          return (
            <Box
              key={idx}
              onClick={(e) => day.isCurrentMonth && handleDayClick(e, day.dateStr)}
              sx={{
                position: 'relative',
                minHeight: { xs: 44, md: 56 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.3,
                cursor: hasEvents && day.isCurrentMonth ? 'pointer' : 'default',
                transition: 'background-color 0.15s',
                borderBottom: '1px solid',
                borderRight: (idx + 1) % 7 !== 0 ? '1px solid' : 'none',
                borderColor: 'rgba(0,0,0,0.04)',
                opacity: day.isCurrentMonth ? 1 : 0.3,
                '&:hover': hasEvents && day.isCurrentMonth
                  ? { backgroundColor: 'rgba(46, 134, 193, 0.06)' }
                  : {},
              }}
            >
              {/* Range highlight background */}
              {rangeBg && day.isCurrentMonth && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: '4px 0',
                    backgroundColor: rangeBg,
                    borderRadius: rangeBorderRadius,
                    zIndex: 0,
                  }}
                />
              )}

              {/* Day number */}
              <Typography
                variant="body2"
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  fontWeight: isToday ? 800 : hasEvents ? 600 : 400,
                  fontSize: { xs: '0.8rem', md: '0.9rem' },
                  width: isToday ? 28 : 'auto',
                  height: isToday ? 28 : 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: isToday ? '#F5A623' : 'transparent',
                  color: isToday ? 'white' : hasEvents ? '#1A5F8B' : 'text.primary',
                }}
              >
                {dayNum}
              </Typography>

              {/* Event dots */}
              {hasEvents && day.isCurrentMonth && (
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    gap: '3px',
                    justifyContent: 'center',
                  }}
                >
                  {dayEvents.slice(0, 3).map((ev, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        backgroundColor: CATEGORY_COLORS[ev.category] || '#2E86C1',
                      }}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <Typography
                      variant="caption"
                      sx={{ fontSize: '0.5rem', color: 'text.disabled', lineHeight: 1 }}
                    >
                      +{dayEvents.length - 3}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Legend */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 1.5, md: 2.5 },
          px: { xs: 2, md: 3 },
          py: 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: '#fafbfc',
        }}
      >
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <Box key={cat} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'capitalize' }}>
              {cat}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Popover */}
      <EventPopover
        anchorEl={popoverAnchor}
        events={popoverEvents}
        onClose={() => {
          setPopoverAnchor(null);
          setPopoverEvents([]);
        }}
      />
    </Box>
  );
};

export default EventCalendar;
