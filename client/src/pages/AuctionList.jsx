import { useState, useEffect, useMemo } from 'react';
import { RiSearchLine, RiAuctionLine } from 'react-icons/ri';
import api from '../api/axios';
import AuctionCard from '../components/auction/AuctionCard';
import Loader from '../components/common/Loader';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'ended', label: 'Ended' },
];

export default function AuctionList() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      try {
        const url = activeTab === 'all' ? '/auctions' : `/auctions?status=${activeTab}`;
        const { data } = await api.get(url);
        setAuctions(data.auctions || data || []);
      } catch {
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, [activeTab]);

  // Client-side search filter
  const filtered = useMemo(() => {
    if (!search.trim()) return auctions;
    const q = search.toLowerCase();
    return auctions.filter((a) => {
      const bike = a.bike || {};
      return (
        (bike.name || '').toLowerCase().includes(q) ||
        (bike.brand || '').toLowerCase().includes(q) ||
        (bike.model || '').toLowerCase().includes(q)
      );
    });
  }, [auctions, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Browse <span className="gradient-text">Auctions</span>
        </h1>
        <p className="text-slate-600 mt-2">Find your dream motorcycle at the best price</p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-50/50 border border-slate-300/50">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === tab.key
                  ? 'bg-accent-500 text-slate-900 shadow-lg shadow-accent-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bikes..."
            className="input-dark pl-10 py-2.5 text-sm"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
              <div className="h-48 bg-slate-50" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-slate-50 rounded w-3/4" />
                <div className="h-4 bg-slate-50 rounded w-1/2" />
                <div className="h-8 bg-slate-50 rounded w-1/3 mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((auction, i) => (
            <AuctionCard key={auction._id} auction={auction} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-2xl">
          <RiAuctionLine className="text-6xl text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-600 mb-2">No auctions found</h3>
          <p className="text-sm text-slate-500">
            {search ? 'Try adjusting your search query' : 'Check back soon for new auctions'}
          </p>
        </div>
      )}
    </div>
  );
}
