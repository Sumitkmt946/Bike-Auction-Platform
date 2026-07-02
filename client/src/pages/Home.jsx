import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RiMotorbikeFill, RiAuctionLine, RiUserLine, RiArrowRightLine, RiShieldCheckLine, RiSearchLine } from 'react-icons/ri';
import api from '../api/axios';
import AuctionCard from '../components/auction/AuctionCard';

export default function Home() {
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const { data } = await api.get('/auctions?status=active');
        setActiveAuctions((data.auctions || data || []).slice(0, 6));
      } catch {
        setActiveAuctions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActive();
  }, []);

  return (
    <div className="fade-in">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION (Vutto-style Banner)
         ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-slate-50 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-accent-600 to-accent-800 rounded-3xl overflow-hidden relative shadow-2xl">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              {/* Text Content */}
              <div className="p-10 lg:p-16 relative z-10 text-white">
                <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6">
                  Premium Bidding Platform
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                  Live Motorcycle<br />
                  <span className="text-accent-200">Auctions</span>
                </h1>
                <p className="text-lg text-white/90 mb-10 max-w-lg font-medium">
                  Experience the thrill of real-time bidding on the world's most exclusive motorcycles. Register, browse, and ride away with your dream machine.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/auctions" 
                    className="bg-white text-accent-700 hover:bg-slate-50 px-8 py-4 rounded-xl font-bold transition-all shadow-lg text-center flex items-center justify-center gap-2 text-lg"
                  >
                    Browse Auctions <RiArrowRightLine />
                  </Link>
                </div>
              </div>

              {/* Image Content */}
              <div className="relative h-64 lg:h-full hidden lg:block">
                <img 
                  src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop" 
                  alt="Premium Motorcycle" 
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                {/* Gradient mask to blend the image smoothly into the left background */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent-800 via-accent-800/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STATS SECTION (Vutto-style Badges)
         ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-12 relative z-20">
        <div className="flex flex-nowrap overflow-x-auto gap-4 sm:gap-6 pb-4 snap-x hide-scrollbar">
          {[
            { label: 'Active Auctions', value: activeAuctions.length || '0', icon: RiAuctionLine, color: 'text-accent-600', bg: 'bg-accent-50' },
            { label: 'Registered Users', value: '500+', icon: RiUserLine, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Bikes Listed', value: '120+', icon: RiMotorbikeFill, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Successful Sales', value: '80+', icon: RiShieldCheckLine, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex-none w-64 glass rounded-2xl p-5 flex items-center gap-4 border border-slate-200 snap-center hover:shadow-md transition-shadow bg-white"
            >
              <div className={`w-14 h-14 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`text-2xl ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURED AUCTIONS
         ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Featured Auctions
            </h2>
            <p className="text-slate-500 mt-2 font-medium">Bikes currently open for bidding</p>
          </div>
          <Link
            to="/auctions"
            className="hidden sm:flex items-center gap-1.5 text-accent-600 hover:text-accent-700 font-bold transition-colors bg-accent-50 px-4 py-2 rounded-lg"
          >
            View All <RiArrowRightLine />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-56 bg-slate-100" />
                <div className="p-5 space-y-4">
                  <div className="h-6 bg-slate-100 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-10 bg-slate-100 rounded w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : activeAuctions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {activeAuctions.map((auction, i) => (
              <AuctionCard key={auction._id} auction={auction} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
            <RiAuctionLine className="text-6xl text-slate-300 mx-auto mb-4" />
            <p className="text-xl font-bold text-slate-700">No active auctions right now</p>
            <p className="text-slate-500 mt-2">Check back soon for new listings!</p>
          </div>
        )}

        <Link
          to="/auctions"
          className="sm:hidden flex items-center justify-center gap-1.5 text-white font-bold bg-accent-600 hover:bg-accent-700 transition-colors mt-8 py-3 px-6 rounded-xl"
        >
          View All Auctions <RiArrowRightLine />
        </Link>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW IT WORKS
         ══════════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How It Works
            </h2>
            <p className="text-slate-500 mt-3 font-medium text-lg">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Register',
                desc: 'Create your free account in seconds and join our community of bike enthusiasts.',
                icon: RiUserLine,
              },
              {
                step: '02',
                title: 'Browse',
                desc: 'Explore our curated collection of motorcycles available for auction.',
                icon: RiSearchLine,
              },
              {
                step: '03',
                title: 'Bid & Win',
                desc: 'Place your bids in real-time and win your dream motorcycle at the best price.',
                icon: RiAuctionLine,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 text-center hover:shadow-xl transition-shadow duration-300 border border-slate-100 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="text-9xl text-slate-900" />
                </div>
                
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent-50 text-accent-600 mb-6 relative z-10">
                  <item.icon className="text-4xl" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">{item.step}. {item.title}</h3>
                <p className="text-slate-600 leading-relaxed relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
