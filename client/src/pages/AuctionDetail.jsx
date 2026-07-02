import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { RiMotorbikeFill, RiCalendarLine, RiPriceTag3Line, RiInformationLine } from 'react-icons/ri';
import api from '../api/axios';
import { useSocket } from '../context/SocketContext';
import AuctionTimer from '../components/auction/AuctionTimer';
import BidPanel from '../components/auction/BidPanel';
import BidHistory from '../components/auction/BidHistory';
import Specifications from '../components/auction/Specifications';
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
        <p className="text-xl text-slate-600">Auction not found</p>
      </div>
    );
  }

  const bike = auction.bike || {};
  const images = bike.images && bike.images.length > 0 ? bike.images : [];
  const status = auction.status || 'upcoming';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* ── Two Column Layout (Vutto Style) ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* LEFT: Images (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Image Gallery */}
          <div className="glass rounded-2xl overflow-hidden border border-slate-200">
            {/* Main Image */}
            <div className="relative aspect-[16/10] bg-white">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={bike.name}
                  className="w-full h-full object-contain bg-slate-50"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                  <RiMotorbikeFill className="text-7xl text-slate-300" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto bg-white border-t border-slate-100">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === i
                        ? 'border-accent-500 shadow-sm'
                        : 'border-transparent hover:border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${bike.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Bike Description */}
          {bike.description && (
            <div className="glass rounded-2xl p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Description</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{bike.description}</p>
            </div>
          )}

          {/* Specifications */}
          <Specifications specs={bike.specifications} />
        </div>

        {/* RIGHT: Details, Bidding Panel + History (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Product Header Card */}
          <div className="glass rounded-2xl p-6 border border-slate-200 space-y-5">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}
                >
                  {status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                  {getStatusLabel(status)}
                </span>
                <span className="text-sm font-medium text-slate-500">{bike.year || 'N/A'} Model</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {bike.name || 'Auction'}
              </h1>
              <p className="text-slate-500 mt-1 font-medium">
                {bike.brand} {bike.model && `· ${bike.model}`}
              </p>
            </div>

            {/* Price block */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Starting Price</p>
                <p className="text-xl font-semibold text-slate-700">{formatCurrency(bike.startingPrice)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">
                  {status === 'ended' ? 'Final Bid' : 'Current Bid'}
                </p>
                <p className="text-2xl font-black text-accent-600">
                  {formatCurrency(auction.currentBid || auction.highestBid || bike.startingPrice)}
                </p>
              </div>
            </div>

            {/* Timer */}
            <div className="pt-2">
              <AuctionTimer endTime={auction.endTime} startTime={auction.startTime} status={status} />
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
