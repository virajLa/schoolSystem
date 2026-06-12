import React, { useState } from 'react';
import { LessonPlan } from '../types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, FileText, Clock, Layers } from 'lucide-react';

interface CalendarViewProps {
  plans: LessonPlan[];
  onSelectPlan: (plan: LessonPlan) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ plans, onSelectPlan }) => {
  // We can lock the active view to June 2026 where our active lesson logs are mapped (June 15, June 16, June 18, June 19)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // 0-indexed, so 5 is June
  const [selectedDay, setSelectedDay] = useState<number | null>(15);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Number of days in June 2026 is 30. Starting day of week for June 1st, 2026 is Monday (index 1)
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartDayOfWeek = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
  };

  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const startDay = getStartDayOfWeek(currentYear, currentMonth);

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    daysArray.push(d);
  }

  // Create formatted check date YYYY-MM-DD
  const formatDateString = (year: number, month: number, day: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Find lesson plans for a selected day
  const getPlansForDate = (day: number) => {
    const dateStr = formatDateString(currentYear, currentMonth, day);
    return plans.filter((p) => p.date === dateStr);
  };

  // Selected date plans
  const selectedDateStr = selectedDay ? formatDateString(currentYear, currentMonth, selectedDay) : '';
  const selectedPlans = selectedDay ? getPlansForDate(selectedDay) : [];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-sans font-bold text-gray-900 text-lg uppercase tracking-wider">Academic Master Calendar</h2>
        <p className="text-3xs text-gray-500 font-medium">Coordinate interactive timelines across grades, subjects, and classroom rosters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Grid Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5">
          <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
            <h3 className="font-sans font-black text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <CalendarIcon className="h-4.5 w-4.5 text-emerald-600" />
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <div className="flex gap-1.5">
              <button
                id="cal-prev-month"
                onClick={handlePrevMonth}
                className="p-1 px-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 cursor-pointer"
              >
                &larr;
              </button>
              <button
                id="cal-next-month"
                onClick={handleNextMonth}
                className="p-1 px-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 cursor-pointer"
              >
                &rarr;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center text-3xs font-black uppercase tracking-widest text-slate-400 mb-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 bg-gray-50 border border-gray-150 rounded-xl overflow-hidden p-1 min-h-[18rem]">
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="bg-white/40" />;
              }

              const hasPlans = getPlansForDate(day).length > 0;
              const isSelected = selectedDay === day;
              const dateRefStr = formatDateString(currentYear, currentMonth, day);

              return (
                <button
                  key={`day-${day}`}
                  id={`cal-day-${day}`}
                  onClick={() => setSelectedDay(day)}
                  className={`p-2 bg-white text-left font-mono font-bold text-xs flex flex-col justify-between items-start cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-emerald-600/5 hover:bg-emerald-600/5 border-emerald-500 shadow-3xs text-emerald-950 font-black'
                      : 'border-transparent hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className={`h-5 w-5 flex items-center justify-center rounded-full ${isSelected ? 'bg-emerald-600 text-white font-black' : 'text-slate-800'}`}>
                    {day}
                  </span>
                  {hasPlans && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse mt-3 ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date detail items */}
        <div className="space-y-4">
          <span className="text-3xs font-black uppercase tracking-wider text-slate-400 block px-1">Selected Date Timeline</span>
          <div className="bg-white rounded-2xl border border-gray-200/85 p-5 space-y-4 min-h-[16rem]">
            <div className="border-b border-gray-100 pb-2 flex justify-between items-center flex-wrap gap-2">
              <p className="font-sans font-bold text-gray-800 text-xs">Agenda Schedule</p>
              <span className="text-3xs font-mono font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded">
                {selectedDateStr}
              </span>
            </div>

            {selectedPlans.length === 0 ? (
              <div className="py-12 text-center text-gray-400 space-y-1.5">
                <FileText className="h-9 w-9 text-gray-300 mx-auto" />
                <p className="text-3xs font-bold uppercase tracking-wider">No Classroom assignments</p>
                <p className="text-3xs text-gray-400 leading-normal max-w-xs mx-auto">None of your draft, pending, or approved records are manually signed to this date.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {selectedPlans.map((plan) => {
                  return (
                    <div
                      key={plan.id}
                      className="p-3 border border-gray-150 rounded-xl space-y-2 hover:shadow-2xs transition-shadow"
                    >
                      <div className="flex justify-between items-center text-3xs">
                        <span className="font-extrabold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {plan.grade} &bull; {plan.subject}
                        </span>
                        <span className="font-mono text-gray-400">v{plan.currentVersionNo}</span>
                      </div>
                      <h4 className="font-sans font-bold text-gray-900 text-xs leading-snug">{plan.title}</h4>
                      <p className="text-3xs text-gray-500 font-bold">Roster Assignment: {plan.classSection}</p>
                      
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => onSelectPlan(plan)}
                          className="px-2.5 py-1 text-3xs bg-slate-800 hover:bg-slate-700 text-white font-extrabold uppercase rounded transition-colors"
                        >
                          Core Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
