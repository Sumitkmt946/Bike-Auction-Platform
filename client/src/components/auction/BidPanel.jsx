import { useState } from 'react';
import { RiArrowUpLine, RiTrophyLine, RiAuctionLine, RiLockLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/helpers';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function BidPanel({ auction, onBidPlaced }) {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  const status = auction?.status || 'upcoming';
  const highestBid = auction?.currentBid || auction?.highestBid || auction?.bike?.startingPrice || 0;
  const highestBidder = auction?.highestBidder;
  const winner = auction?.winner;
  const minBid = highestBid + 1;
  const startingPrice = auction?.bike?.startingPrice || 0;

  const isActive = status === 'active';
  const isEnded = status === 'ended';
  const isUpcoming = status === 'upcoming';

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    const amount = Number(bidAmount);

    if (!amount || amount < minBid) {
      toast.error(`Minimum bid is ${formatCurrency(minBid)}`);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post(`/auctions/${auction._id}/bids`, { amount });
      toast.success(`Bid of ${formatCurrency(amount)} placed successfully!`);
      setBidAmount('');
      setPulseKey((k) => k + 1);
      if (onBidPlaced) onBidPlaced(data);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to place bid';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 space-y-5">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <RiAuctionLine className="text-accent-400" />
          {isEnded ? 'Final Result' : 'Live Bidding'}
        </h3>
        {isActive && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE
          </span>
        )}
      </div>

      {/* ── Current / Final Bid ───────────────────────────────────────── */}
      <div
        key={pulseKey}
        className={`p-5 rounded-xl bg-gradient-to-br from-accent-500/10 to-amber-500/5 border border-accent-500/20 ${
          pulseKey > 0 ? 'bid-pulse' : ''
        }`}
      >
        <p className="text-xs text-slate-600 uppercase tracking-wider font-medium mb-1">
          {isEnded ? 'Winning Bid' : highestBid > startingPrice ? 'Current Highest Bid' : 'Starting Price'}
        </p>
        <p className="text-3xl font-extrabold gradient-text">{formatCurrency(highestBid)}</p>

        {highestBidder && (
          <p className="text-sm text-slate-600 mt-2 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-accent-500/20 flex items-center justify-center text-[10px] font-bold text-accent-400">
              {(highestBidder.name || 'U').charAt(0).toUpperCase()}
            </span>
            {isEnded ? 'Winner' : 'Highest Bidder'}: <span className="text-slate-900 font-medium">{highestBidder.name || 'Anonymous'}</span>
          </p>
        )}
      </div>

      {/* ── Ended State ───────────────────────────────────────────────── */}
      {isEnded && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 text-center">
          <RiTrophyLine className="text-4xl text-amber-400 mx-auto mb-2" />
          <p className="text-lg font-bold text-slate-900">Auction Ended</p>
          {winner && (
            <p className="text-sm text-slate-600 mt-1">
              Won by <span className="text-amber-400 font-semibold">{winner.name || highestBidder?.name || 'Unknown'}</span>
            </p>
          )}
        </div>
      )}

      {/* ── Upcoming State ────────────────────────────────────────────── */}
      {isUpcoming && (
        <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-300/50 text-center">
          <RiLockLine className="text-3xl text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-600">Bidding has not started yet</p>
          <p className="text-xs text-slate-500 mt-1">Starting price: {formatCurrency(startingPrice)}</p>
        </div>
      )}

      {/* ── Bid Form (Active only, non-admin) ─────────────────────────── */}
      {isActive && isAuthenticated && !isAdmin && (
        <form onSubmit={handlePlaceBid} className="space-y-3">
          <div>
            <label className="text-xs text-slate-600 uppercase tracking-wider font-medium mb-1 block">
              Your Bid (min: {formatCurrency(minBid)})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
              <input
                type="number"
                min={minBid}
                step="1"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={minBid.toString()}
                className="input-dark pl-8"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !bidAmount || Number(bidAmount) < minBid}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Placing Bid...
              </span>
            ) : (
              <>
                <RiArrowUpLine className="text-lg" />
                Place Bid
              </>
            )}
          </button>
        </form>
      )}

      {/* Admin notice */}
      {isActive && isAdmin && (
        <div className="p-3 rounded-lg bg-slate-50/50 border border-slate-300/50 text-center">
          <p className="text-sm text-slate-500">Admins cannot place bids</p>
        </div>
      )}

      {/* Not authenticated */}
      {isActive && !isAuthenticated && (
        <div className="p-3 rounded-lg bg-slate-50/50 border border-slate-300/50 text-center">
          <p className="text-sm text-slate-600">Please log in to place bids</p>
        </div>
      )}
    </div>
  );
}
