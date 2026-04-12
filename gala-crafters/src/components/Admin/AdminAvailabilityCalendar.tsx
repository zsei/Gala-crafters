import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../../api/config';

const BLOCKED_CHANGED = 'admin-blocked-dates-changed';

export function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const AdminAvailabilityCalendar: React.FC = () => {
  const [viewDate, setViewDate] = useState(() => new Date());
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [booked, setBooked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlocked = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const [blockedRes, bookedRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/blocked-dates`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/booked-dates`),
      ]);
      if (!blockedRes.ok) throw new Error('Failed to load');
      const data = await blockedRes.json();
      const next = new Set<string>(
        Array.isArray(data) ? data.map((r: { block_date: string }) => r.block_date) : []
      );
      setBlocked(next);
      const bookedData = bookedRes.ok ? await bookedRes.json() : [];
      setBooked(
        new Set<string>(Array.isArray(bookedData) ? bookedData.filter((s) => typeof s === 'string') : [])
      );
      setError(null);
    } catch {
      setError('Could not load calendar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlocked();
  }, [fetchBlocked]);

  useEffect(() => {
    const onChange = () => fetchBlocked();
    window.addEventListener(BLOCKED_CHANGED, onChange);
    return () => window.removeEventListener(BLOCKED_CHANGED, onChange);
  }, [fetchBlocked]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDay = (y: number, m: number) => new Date(y, m, 1).getDay();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const toggleDay = async (ymd: string, dateObj: Date) => {
    if (busy) return;
    if (dateObj < todayStart) return;
    if (booked.has(ymd)) return;
    setBusy(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setBusy(false);
      return;
    }
    try {
      if (blocked.has(ymd)) {
        const res = await fetch(`${API_BASE_URL}/api/admin/blocked-dates/${ymd}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.detail || 'Remove failed');
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/api/admin/blocked-dates`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ block_date: ymd }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.detail || 'Save failed');
        }
      }
      window.dispatchEvent(new CustomEvent(BLOCKED_CHANGED));
      await fetchBlocked();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setBusy(false);
    }
  };

  const y = viewDate.getFullYear();
  const m = viewDate.getMonth();

  return (
    <div className="admin-availability-cal">
      {error && (
        <div className="admin-availability-cal__err" role="alert">
          {error}
        </div>
      )}

      <div className="admin-availability-cal__nav">
        <button
          type="button"
          className="admin-availability-cal__nav-btn"
          onClick={() => setViewDate(new Date(y, m - 1, 1))}
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="admin-availability-cal__month">
          {months[m]} {y}
        </span>
        <button
          type="button"
          className="admin-availability-cal__nav-btn"
          onClick={() => setViewDate(new Date(y, m + 1, 1))}
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="admin-availability-cal__grid">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d} className="admin-availability-cal__dow">
            {d}
          </span>
        ))}
        {Array.from({ length: firstDay(y, m) }).map((_, i) => (
          <span key={`e-${i}`} className="admin-availability-cal__cell admin-availability-cal__cell--empty" />
        ))}
        {Array.from({ length: daysInMonth(y, m) }).map((_, i) => {
          const day = i + 1;
          const cell = new Date(y, m, day);
          const ymd = toYMD(cell);
          const isPast = cell < todayStart;
          const isBlocked = blocked.has(ymd);
          const isBooked = booked.has(ymd);
          const isToday = toYMD(new Date()) === ymd;
          return (
            <button
              key={ymd}
              type="button"
              disabled={loading || isPast || busy || isBooked}
              title={
                isPast
                  ? 'Past date'
                  : isBooked
                    ? 'Already booked — manage in Bookings'
                    : isBlocked
                      ? 'Day off — click to allow bookings'
                      : 'Click to mark day off'
              }
              className={[
                'admin-availability-cal__cell',
                'admin-availability-cal__day',
                isBlocked ? 'admin-availability-cal__day--blocked' : '',
                !isBlocked && isBooked ? 'admin-availability-cal__day--booked' : '',
                isToday ? 'admin-availability-cal__day--today' : '',
                isPast ? 'admin-availability-cal__day--past' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => toggleDay(ymd, cell)}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="admin-availability-cal__legend">
        <span className="admin-availability-cal__legend-item">
          <span className="admin-availability-cal__swatch admin-availability-cal__swatch--open" /> Bookable
        </span>
        <span className="admin-availability-cal__legend-item">
          <span className="admin-availability-cal__swatch admin-availability-cal__swatch--blocked" /> Day off
        </span>
        <span className="admin-availability-cal__legend-item">
          <span className="admin-availability-cal__swatch admin-availability-cal__swatch--booked" /> Booked
        </span>
      </div>
    </div>
  );
};

export default AdminAvailabilityCalendar;
