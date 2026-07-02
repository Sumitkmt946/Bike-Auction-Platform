import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiAddLine, RiEditLine, RiDeleteBin6Line, RiPlayLine, RiStopLine, RiAuctionLine, RiArrowLeftLine, RiEyeLine } from 'react-icons/ri';
import api from '../../api/axios';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function ManageAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const { data } = await api.get('/auctions');
      setAuctions(data.auctions || data || []);
    } catch {
      toast.error('Failed to load auctions');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (id) => {
    setActionLoading(id);
    try {
      await api.patch(`/auctions/${id}/start`);
      toast.success('Auction started!');
      fetchAuctions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start auction');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEnd = async (id) => {
    if (!window.confirm('Are you sure you want to end this auction?')) return;
    setActionLoading(id);
    try {
      await api.patch(`/auctions/${id}/end`);
      toast.success('Auction ended!');
      fetchAuctions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to end auction');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this auction?')) return;
    setActionLoading(id);
    try {
      await api.delete(`/auctions/${id}`);
      setAuctions((prev) => prev.filter((a) => a._id !== id));
      toast.success('Auction deleted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete auction');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition-colors mb-2">
            <RiArrowLeftLine /> Back to Admin
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Manage <span className="gradient-text">Auctions</span>
          </h1>
        </div>
        <Link to="/admin/auctions/create" className="btn-primary flex items-center gap-2">
          <RiAddLine /> Create Auction
        </Link>
      </div>

      {/* Auctions */}
      {auctions.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <RiAuctionLine className="text-6xl text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-600 mb-2">No auctions created yet</h3>
          <Link to="/admin/auctions/create" className="btn-primary inline-flex items-center gap-2 mt-4">
            <RiAddLine /> Create Auction
          </Link>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-300/30">
                  <th className="px-5 py-4 font-medium">Bike</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium hidden sm:table-cell">Start</th>
                  <th className="px-5 py-4 font-medium hidden md:table-cell">End</th>
                  <th className="px-5 py-4 font-medium">Highest Bid</th>
                  <th className="px-5 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {auctions.map((auction) => {
                  const bike = auction.bike || {};
                  const status = auction.status;
                  const isProcessing = actionLoading === auction._id;

                  return (
                    <tr key={auction._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 shrink-0">
                            {bike.images?.[0] ? (
                              <img src={bike.images[0]} alt={bike.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <RiAuctionLine className="text-slate-700 text-sm" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{bike.name || 'N/A'}</p>
                            <p className="text-xs text-slate-500">{bike.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
                          {status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                          {getStatusLabel(status)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 hidden sm:table-cell">
                        {formatDate(auction.startTime)}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 hidden md:table-cell">
                        {formatDate(auction.endTime)}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-accent-400">
                        {formatCurrency(auction.currentBid || auction.highestBid || bike.startingPrice || 0)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {status === 'upcoming' && (
                            <>
                              <button
                                onClick={() => handleStart(auction._id)}
                                disabled={isProcessing}
                                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-sm"
                                title="Start Auction"
                              >
                                <RiPlayLine />
                              </button>
                              <Link
                                to={`/admin/auctions/${auction._id}/edit`}
                                className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all text-sm"
                                title="Edit"
                              >
                                <RiEditLine />
                              </Link>
                              <button
                                onClick={() => handleDelete(auction._id)}
                                disabled={isProcessing}
                                className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-sm"
                                title="Delete"
                              >
                                <RiDeleteBin6Line />
                              </button>
                            </>
                          )}
                          {status === 'active' && (
                            <button
                              onClick={() => handleEnd(auction._id)}
                              disabled={isProcessing}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-sm"
                              title="End Auction"
                            >
                              <RiStopLine />
                            </button>
                          )}
                          <Link
                            to={`/auctions/${auction._id}`}
                            className="p-2 rounded-lg bg-slate-100/30 text-slate-600 border border-slate-600/20 hover:bg-slate-100/50 hover:text-slate-900 transition-all text-sm"
                            title="View"
                          >
                            <RiEyeLine />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
