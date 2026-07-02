import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiMotorbikeFill, RiAuctionLine, RiAddLine, RiFlashlightLine, RiArrowRightLine } from 'react-icons/ri';
import api from '../../api/axios';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../utils/helpers';
import Loader from '../../components/common/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ bikes: 0, auctions: 0, active: 0, totalBids: 0 });
  const [recentAuctions, setRecentAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bikesRes, auctionsRes] = await Promise.all([
          api.get('/bikes'),
          api.get('/auctions'),
        ]);

        const bikes = bikesRes.data.bikes || bikesRes.data || [];
        const auctions = auctionsRes.data.auctions || auctionsRes.data || [];
        const active = auctions.filter((a) => a.status === 'active');

        // Sum up bids
        let totalBids = 0;
        for (const a of auctions) {
          totalBids += a.totalBids || a.bidCount || 0;
        }

        setStats({
          bikes: bikes.length,
          auctions: auctions.length,
          active: active.length,
          totalBids,
        });

        setRecentAuctions(auctions.slice(0, 10));
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-slate-400 mt-1">Manage your bike auction platform</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/bikes/create" className="btn-primary flex items-center gap-2 text-sm">
            <RiAddLine /> Add Bike
          </Link>
          <Link to="/admin/auctions/create" className="btn-secondary flex items-center gap-2 text-sm">
            <RiAddLine /> Create Auction
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Bikes', value: stats.bikes, icon: RiMotorbikeFill, color: 'text-accent-400', bg: 'from-accent-500/10 to-accent-500/5', border: 'border-accent-500/20' },
          { label: 'Total Auctions', value: stats.auctions, icon: RiAuctionLine, color: 'text-blue-400', bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/20' },
          { label: 'Active Auctions', value: stats.active, icon: RiFlashlightLine, color: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/20' },
          { label: 'Total Bids', value: stats.totalBids, icon: RiAuctionLine, color: 'text-purple-400', bg: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-500/20' },
        ].map((stat, i) => (
          <div key={i} className={`glass rounded-2xl p-5 bg-gradient-to-br ${stat.bg} border ${stat.border}`}>
            <stat.icon className={`text-2xl ${stat.color} mb-2`} />
            <p className="text-3xl font-extrabold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link
          to="/admin/bikes"
          className="glass rounded-xl p-5 flex items-center justify-between hover:bg-white/[0.03] transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center">
              <RiMotorbikeFill className="text-accent-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Manage Bikes</p>
              <p className="text-xs text-slate-500">Add, edit, or remove bikes</p>
            </div>
          </div>
          <RiArrowRightLine className="text-slate-600 group-hover:text-accent-400 transition-colors" />
        </Link>

        <Link
          to="/admin/auctions"
          className="glass rounded-xl p-5 flex items-center justify-between hover:bg-white/[0.03] transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <RiAuctionLine className="text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Manage Auctions</p>
              <p className="text-xs text-slate-500">Create, start, or end auctions</p>
            </div>
          </div>
          <RiArrowRightLine className="text-slate-600 group-hover:text-blue-400 transition-colors" />
        </Link>
      </div>

      {/* Recent Auctions Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-700/30">
          <h2 className="text-lg font-bold text-white">Recent Auctions</h2>
        </div>

        {recentAuctions.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-slate-500">No auctions created yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Bike</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium hidden sm:table-cell">Start</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">End</th>
                  <th className="px-5 py-3 font-medium">Highest Bid</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {recentAuctions.map((auction) => {
                  const bike = auction.bike || {};
                  return (
                    <tr key={auction._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-white text-sm">{bike.name || 'N/A'}</p>
                        <p className="text-xs text-slate-500">{bike.brand}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(auction.status)}`}>
                          {auction.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                          {getStatusLabel(auction.status)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400 hidden sm:table-cell">
                        {formatDate(auction.startTime)}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400 hidden md:table-cell">
                        {formatDate(auction.endTime)}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-accent-400">
                        {formatCurrency(auction.currentBid || auction.highestBid || bike.startingPrice || 0)}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          to={`/auctions/${auction._id}`}
                          className="text-xs text-accent-400 hover:text-accent-300 font-medium transition-colors"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
