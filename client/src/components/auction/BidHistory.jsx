import { RiTrophyLine, RiTimeLine } from 'react-icons/ri';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';

export default function BidHistory({ bids = [], highestBidId }) {
  if (!bids || bids.length === 0) {
    return (
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <RiTimeLine className="text-accent-400" />
          Bid History
        </h3>
        <div className="text-center py-8">
          <RiTimeLine className="text-4xl text-slate-700 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No bids placed yet</p>
          <p className="text-xs text-slate-600 mt-1">Be the first to bid!</p>
        </div>
      </div>
    );
  }

  // Sort bids newest first
  const sortedBids = [...bids].sort(
    (a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp)
  );

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <RiTimeLine className="text-accent-400" />
          Bid History
        </h3>
        <span className="text-xs text-slate-500 bg-slate-800/50 px-2.5 py-1 rounded-full">
          {bids.length} bid{bids.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Scrollable list */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {sortedBids.map((bid, index) => {
          const isHighest = index === 0 || bid._id === highestBidId;
          const bidder = bid.bidder || bid.user || {};
          const bidderName = bidder.name || 'Anonymous';

          return (
            <div
              key={bid._id || index}
              className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                isHighest && index === 0
                  ? 'bg-gradient-to-r from-accent-500/10 to-amber-500/5 border border-accent-500/20'
                  : 'bg-slate-800/30 border border-slate-700/20 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isHighest && index === 0
                      ? 'bg-gradient-to-br from-accent-500 to-accent-400 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {isHighest && index === 0 ? (
                    <RiTrophyLine className="text-sm" />
                  ) : (
                    bidderName.charAt(0).toUpperCase()
                  )}
                </div>

                <div>
                  <p className={`text-sm font-medium ${isHighest && index === 0 ? 'text-accent-400' : 'text-white'}`}>
                    {bidderName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatRelativeTime(bid.createdAt || bid.timestamp)}
                  </p>
                </div>
              </div>

              <p className={`text-sm font-bold ${isHighest && index === 0 ? 'text-accent-400' : 'text-slate-300'}`}>
                {formatCurrency(bid.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
