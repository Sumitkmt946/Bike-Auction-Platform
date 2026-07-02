import { useState, useEffect, useCallback } from 'react';

/**
 * Countdown timer for auctions.
 * Shows time until start (upcoming), time until end (active), or "Ended".
 */
export default function AuctionTimer({ endTime, startTime, status }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isUrgent, setIsUrgent] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    let targetDate;

    if (status === 'upcoming' && startTime) {
      targetDate = new Date(startTime);
    } else if (status === 'active' && endTime) {
      targetDate = new Date(endTime);
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const diff = targetDate - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    // Check if less than 5 minutes
    setIsUrgent(diff < 5 * 60 * 1000 && status === 'active');

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [endTime, startTime, status]);

  useEffect(() => {
    if (status === 'ended') return;

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, status]);

  if (status === 'ended') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-slate-500" />
        <span className="text-sm font-medium text-slate-600">Auction Ended</span>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = timeLeft;
  const label = status === 'upcoming' ? 'Starts in' : 'Ends in';

  return (
    <div className={`flex flex-col gap-1 ${isUrgent ? 'animate-pulse' : ''}`}>
      <span className={`text-xs font-medium uppercase tracking-wider ${isUrgent ? 'text-red-400' : 'text-slate-500'}`}>
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        {days > 0 && (
          <TimeUnit value={days} label="d" urgent={isUrgent} />
        )}
        <TimeUnit value={hours} label="h" urgent={isUrgent} />
        <span className={`text-lg font-bold ${isUrgent ? 'text-red-400' : 'text-slate-600'}`}>:</span>
        <TimeUnit value={minutes} label="m" urgent={isUrgent} />
        <span className={`text-lg font-bold ${isUrgent ? 'text-red-400' : 'text-slate-600'}`}>:</span>
        <TimeUnit value={seconds} label="s" urgent={isUrgent} />
      </div>
    </div>
  );
}

function TimeUnit({ value, label, urgent }) {
  return (
    <div className={`flex items-baseline gap-0.5 px-2 py-1 rounded-lg ${
      urgent ? 'bg-red-500/10 border border-red-500/20' : 'bg-slate-50/50'
    }`}>
      <span className={`text-lg font-bold tabular-nums ${urgent ? 'text-red-400' : 'text-slate-900'}`}>
        {String(value).padStart(2, '0')}
      </span>
      <span className={`text-[10px] font-medium ${urgent ? 'text-red-500' : 'text-slate-500'}`}>
        {label}
      </span>
    </div>
  );
}
