import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { RiMotorbikeFill, RiCalendarLine, RiPriceTag3Line, RiInformationLine } from 'react-icons/ri';
import api from '../api/axios';
import { useSocket } from '../context/SocketContext';
import AuctionTimer from '../components/auction/AuctionTimer';
import BidPanel from '../components/auction/BidPanel';
import BidHistory from '../components/auction/BidHistory';
import Loader from '../components/common/Loader';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function AuctionDetail() {
  const { id } = useParams();
  const { socket } = useSocket();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  /* ── Fetch auction data ──────────────────────────────────────────── */
  const fetchAuction = useCallback(async () => {
    try {
      const { data } = await api.get(`/auctions/${id}`);
      setAuction(data.auction || data);
    } catch {
      toast.error('Failed to load auction');
    }
  }, [id]);

  const fetchBids = useCallback(async () => {
    try {
      const { data } = await api.get(`/auctions/${id}/bids`);
      setBids(data.bids || data || []);
    } catch {
      setBids([]);
    }
  }, [id]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchAuction(), fetchBids()]);
      setLoading(false);
    };
    load();
  }, [fetchAuction, fetchBids]);

  /* ── Socket.IO events ────────────────────────────────────────────── */
  useEffect(() => {
    if (!socket || !id) return;

    // Join auction room
    socket.emit('joinAuction', id);

    // Listen for new bids
    const handleNewBid = (data) => {
      const { bid, auction: updatedAuction } = data;
      if (updatedAuction) {
        setAuction((prev) => ({ ...prev, ...updatedAuction }));
      }
      if (bid) {
        setBids((prev) => [bid, ...prev]);
      }
      toast.success(`New bid: ${formatCurrency(bid?.amount || 0)}`, {
        icon: '🔥',
        duration: 3000,
      });
    };

    const handleAuctionStarted = (data) => {
      const updated = data.auction || data;
      setAuction((prev) => ({ ...prev, ...updated, status: 'active' }));
      toast.success('Auction has started!', { icon: '🚀' });
    };

    const handleAuctionEnded = (data) => {
      const updated = data.auction || data;
      setAuction((prev) => ({ ...prev, ...updated, status: 'ended' }));
      toast('Auction has ended!', { icon: '🏁' });
    };

    socket.on('newBid', handleNewBid);
    socket.on('auctionStarted', handleAuctionStarted);
    socket.on('auctionEnded', handleAuctionEnded);

    return () => {
      socket.emit('leaveAuction', id);
      socket.off('newBid', handleNewBid);
      socket.off('auctionStarted', handleAuctionStarted);
      socket.off('auctionEnded', handleAuctionEnded);
    };
  }, [socket, id]);

  /* ── Handle bid placed ──────────────────────────────────────────── */
  const handleBidPlaced = (data) => {
    if (data.bid) setBids((prev) => [data.bid, ...prev]);
    if (data.auction) setAuction((prev) => ({ ...prev, ...data.auction }));
    fetchAuction();
    fetchBids();
  };

  if (loading) return <Loader />;
  if (!auction) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-xl text-slate-400">Auction not found</p>
      </div>
    );
  }

  const bike = auction.bike || {};
  const images = bike.images && bike.images.length > 0 ? bike.images : [];
  const status = auction.status || 'upcoming';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* ── Status & Title Bar ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}
            >
              {status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
              {getStatusLabel(status)}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{bike.name || 'Auction'}</h1>
          <p className="text-slate-400 mt-1">
            {bike.brand} {bike.model && `· ${bike.model}`} {bike.year && `· ${bike.year}`}
          </p>
        </div>

        <div className="shrink-0">
          <AuctionTimer endTime={auction.endTime} startTime={auction.startTime} status={status} />
        </div>
      </div>

      {/* ── Two Column Layout ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* LEFT: Images + Details (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Image Gallery */}
          <div className="glass rounded-2xl overflow-hidden">
            {/* Main Image */}
            <div className="relative aspect-[16/10] bg-slate-900">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={bike.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                  <RiMotorbikeFill className="text-7xl text-slate-700" />
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === i
                        ? 'border-accent-500 shadow-lg shadow-accent-500/20'
                        : 'border-slate-700 hover:border-slate-500 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${bike.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bike Details */}
          <div className="glass rounded-2xl p-6 space-y-5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <RiInformationLine className="text-accent-400" />
              Bike Details
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Brand', value: bike.brand || 'N/A' },
                { label: 'Model', value: bike.model || 'N/A' },
                { label: 'Year', value: bike.year || 'N/A' },
                { label: 'Starting Price', value: formatCurrency(bike.startingPrice) },
              ].map((item, i) => (
                <div key={i} className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/20">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{item.label}</p>
                  <p className="text-sm font-semibold text-white mt-1">{item.value}</p>
                </div>
              ))}
            </div>

            {bike.description && (
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-2">Description</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{bike.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 text-sm">
                <RiCalendarLine className="text-accent-400" />
                <div>
                  <p className="text-slate-500">Start Time</p>
                  <p className="text-white font-medium">{formatDate(auction.startTime)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RiCalendarLine className="text-accent-400" />
                <div>
                  <p className="text-slate-500">End Time</p>
                  <p className="text-white font-medium">{formatDate(auction.endTime)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Bidding Panel + History (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price summary */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Starting Price</p>
                <p className="text-lg font-bold text-slate-300">{formatCurrency(bike.startingPrice)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  {status === 'ended' ? 'Final Bid' : 'Current Bid'}
                </p>
                <p className="text-lg font-bold gradient-text">
                  {formatCurrency(auction.currentBid || auction.highestBid || bike.startingPrice)}
                </p>
              </div>
            </div>
          </div>

          {/* Bid Panel */}
          <BidPanel auction={auction} onBidPlaced={handleBidPlaced} />

          {/* Bid History */}
          <BidHistory bids={bids} />
        </div>
      </div>
    </div>
  );
}
