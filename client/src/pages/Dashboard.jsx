import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiAuctionLine, RiArrowRightLine, RiTrophyLine, RiAlertLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { formatCurrency, formatRelativeTime, getStatusColor, getStatusLabel } from '../utils/helpers';
import Loader from '../components/common/Loader';

export default function Dashboard() {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        // Fetch all auctions and check for user bids
        const { data } = await api.get('/auctions');
        const allAuctions = data.auctions || data || [];

        // For each auction, fetch bids to see if user bid
        const auctionsWithBids = [];
        for (const auction of allAuctions) {
          try {
            const bidRes = await api.get(`/auctions/${auction._id}/bids`);
            const bidsData = bidRes.data.bids || bidRes.data || [];
            const myBids = bidsData.filter(
              (b) => (b.bidder?._id || b.user?._id || b.bidder || b.user) === (user?.id || user?._id)
            );
            if (myBids.length > 0) {
              const highestBid = Math.max(...bidsData.map((b) => b.amount));
              const myHighest = Math.max(...myBids.map((b) => b.amount));
              auctionsWithBids.push({
                ...auction,
                myHighestBid: myHighest,
                isWinning: myHighest >= highestBid,
                totalBidsInAuction: bidsData.length,
                myBidCount: myBids.length,
              });
            }
          } catch {
            // skip
          }
        }
        setAuctions(auctionsWithBids);
      } catch {
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBids();
  }, [user]);

  if (loading) return <Loader />;

  const totalBids = auctions.reduce((sum, a) => sum + (a.myBidCount || 0), 0);
  const auctionsWon = auctions.filter((a) => a.status === 'ended' && a.isWinning).length;
  const activeBids = auctions.filter((a) => a.status === 'active').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">
          Welcome back, <span className="gradient-text">{user?.name || 'User'}</span>
        </h1>
        <p className="text-slate-400 mt-1">Track your bids and auction activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total Bids Placed', value: totalBids, icon: RiAuctionLine, color: 'text-accent-400', bg: 'from-accent-500/10 to-accent-500/5', border: 'border-accent-500/20' },
          { label: 'Active Bids', value: activeBids, icon: RiAlertLine, color: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/20' },
          { label: 'Auctions Won', value: auctionsWon, icon: RiTrophyLine, color: 'text-amber-400', bg: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-500/20' },
        ].map((stat, i) => (
          <div key={i} className={`glass rounded-2xl p-5 bg-gradient-to-br ${stat.bg} border ${stat.border}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">{stat.label}</p>
                <p className="text-3xl font-extrabold text-white mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`text-3xl ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* My Bids */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">My Bids</h2>

        {auctions.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <RiAuctionLine className="text-5xl text-slate-700 mx-auto mb-3" />
            <p className="text-lg text-slate-400">No bids placed yet</p>
            <p className="text-sm text-slate-500 mt-1 mb-4">Start bidding on active auctions!</p>
            <Link to="/auctions" className="btn-primary inline-flex items-center gap-2">
              Browse Auctions <RiArrowRightLine />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {auctions.map((auction) => {
              const bike = auction.bike || {};
              const status = auction.status;

              let bidStatus = 'Active';
              let badgeColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
              if (status === 'ended' && auction.isWinning) {
                bidStatus = 'Won';
                badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
              } else if (status === 'ended' && !auction.isWinning) {
                bidStatus = 'Lost';
                badgeColor = 'bg-red-500/20 text-red-400 border-red-500/30';
              } else if (status === 'active' && auction.isWinning) {
                bidStatus = 'Winning';
                badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
              } else if (status === 'active' && !auction.isWinning) {
                bidStatus = 'Outbid';
                badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
              }

              return (
                <Link
                  key={auction._id}
                  to={`/auctions/${auction._id}`}
                  className="glass rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.03] transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    {/* Image */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-800">
                      {bike.images?.[0] ? (
                        <img src={bike.images[0]} alt={bike.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <RiAuctionLine className="text-slate-700" />
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-white group-hover:text-accent-400 transition-colors">
                        {bike.name || 'Auction'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {bike.brand} · My highest bid: {formatCurrency(auction.myHighestBid)} · {auction.myBidCount} bid{auction.myBidCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}>
                      {bidStatus}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                      {getStatusLabel(status)}
                    </span>
                    <RiArrowRightLine className="text-slate-600 group-hover:text-accent-400 transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
