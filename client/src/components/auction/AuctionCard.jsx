import { Link } from 'react-router-dom';
import { RiAuctionLine, RiArrowRightLine } from 'react-icons/ri';
import AuctionTimer from './AuctionTimer';
import { formatCurrency, getStatusColor, getStatusLabel } from '../../utils/helpers';

export default function AuctionCard({ auction, index = 0 }) {
  const bike = auction.bike || {};
  const status = auction.status || 'upcoming';
  const highestBid = auction.currentBid || auction.highestBid || bike.startingPrice || 0;
  const imageUrl = bike.images && bike.images.length > 0 ? bike.images[0] : null;
  const bidCount = auction.totalBids || auction.bidCount || 0;

  return (
    <div
      className="group glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500 fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* ── Image ────────────────────────────────────────────────────── */}
      <div className="relative h-48 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={bike.name || 'Bike'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <RiAuctionLine className="text-5xl text-slate-700" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}
          >
            {status === 'active' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
            {getStatusLabel(status)}
          </span>
        </div>

        {/* Bid count */}
        {bidCount > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-xs font-medium text-slate-300 border border-slate-700/50">
            {bidCount} bid{bidCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="p-5">
        {/* Bike info */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-white group-hover:text-accent-400 transition-colors line-clamp-1">
            {bike.name || 'Unnamed Bike'}
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">
            {bike.brand} {bike.model && `· ${bike.model}`} {bike.year && `· ${bike.year}`}
          </p>
        </div>

        {/* Timer */}
        <div className="mb-4">
          <AuctionTimer
            endTime={auction.endTime}
            startTime={auction.startTime}
            status={status}
          />
        </div>

        {/* Price + Action */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
              {status === 'ended' ? 'Final Bid' : 'Current Bid'}
            </p>
            <p className="text-xl font-bold gradient-text mt-0.5">{formatCurrency(highestBid)}</p>
          </div>

          <Link
            to={`/auctions/${auction._id}`}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
              status === 'active'
                ? 'bg-gradient-to-r from-accent-500 to-accent-400 text-white hover:from-accent-600 hover:to-accent-500 shadow-lg shadow-accent-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            {status === 'active' ? 'Bid Now' : 'View'}
            <RiArrowRightLine className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
