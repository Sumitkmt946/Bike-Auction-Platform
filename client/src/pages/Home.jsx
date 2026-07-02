import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RiMotorbikeFill, RiAuctionLine, RiUserLine, RiArrowRightLine, RiShieldCheckLine, RiSearchLine, RiFlashlightLine } from 'react-icons/ri';
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
          HERO SECTION
         ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Background gradient mesh */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[200px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center max-w-4xl mx-auto">


            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              <span className="text-slate-900">Live </span>
              <span className="gradient-text">Motorcycle</span>
              <br />
              <span className="text-slate-900">Auctions</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Experience the thrill of real-time bidding on the world's most exclusive and sought-after motorcycles. 
              Whether you are a passionate collector searching for a rare classic or a speed enthusiast chasing the 
              latest high-performance superbike, our platform connects you with unparalleled two-wheeled masterpieces. 
              Join a community of dedicated riders, place your bids with confidence, and ride away with your dream machine today.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auctions" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                Browse Auctions
                <RiArrowRightLine />
              </Link>
              <Link
                to="/register"
                className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STATS SECTION
         ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Live Auctions', value: activeAuctions.length || '0', icon: RiAuctionLine, color: 'text-emerald-400' },
            { label: 'Registered Users', value: '500+', icon: RiUserLine, color: 'text-blue-400' },
            { label: 'Bikes Listed', value: '120+', icon: RiMotorbikeFill, color: 'text-accent-400' },
            { label: 'Successful Sales', value: '80+', icon: RiShieldCheckLine, color: 'text-purple-400' },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-5 text-center hover:scale-105 transition-all duration-500"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <stat.icon className={`text-3xl ${stat.color} mx-auto mb-2`} />
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURED AUCTIONS
         ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Featured <span className="gradient-text">Auctions</span>
            </h2>
            <p className="text-slate-600 mt-1">Active auctions you can bid on right now</p>
          </div>
          <Link
            to="/auctions"
            className="hidden sm:flex items-center gap-1.5 text-accent-400 hover:text-accent-300 font-medium transition-colors"
          >
            View All <RiArrowRightLine />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-50" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-50 rounded w-3/4" />
                  <div className="h-4 bg-slate-50 rounded w-1/2" />
                  <div className="h-8 bg-slate-50 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : activeAuctions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAuctions.map((auction, i) => (
              <AuctionCard key={auction._id} auction={auction} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass rounded-2xl">
            <RiAuctionLine className="text-5xl text-slate-700 mx-auto mb-3" />
            <p className="text-lg text-slate-600">No active auctions right now</p>
            <p className="text-sm text-slate-500 mt-1">Check back soon for new listings!</p>
          </div>
        )}

        <Link
          to="/auctions"
          className="sm:hidden flex items-center justify-center gap-1.5 text-accent-400 hover:text-accent-300 font-medium transition-colors mt-6"
        >
          View All Auctions <RiArrowRightLine />
        </Link>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW IT WORKS
         ══════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-slate-600 mt-2">Get started in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              step: '01',
              title: 'Register',
              desc: 'Create your free account in seconds and join our community of bike enthusiasts.',
              icon: RiUserLine,
              gradient: 'from-blue-500/20 to-blue-500/5',
              border: 'border-blue-500/20',
              iconColor: 'text-blue-400',
            },
            {
              step: '02',
              title: 'Browse',
              desc: 'Explore our curated collection of motorcycles available for auction.',
              icon: RiSearchLine,
              gradient: 'from-accent-500/20 to-accent-500/5',
              border: 'border-accent-500/20',
              iconColor: 'text-accent-400',
            },
            {
              step: '03',
              title: 'Bid & Win',
              desc: 'Place your bids in real-time and win your dream motorcycle at the best price.',
              icon: RiAuctionLine,
              gradient: 'from-emerald-500/20 to-emerald-500/5',
              border: 'border-emerald-500/20',
              iconColor: 'text-emerald-400',
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`relative glass rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-500`}
            >
              {/* Step number */}
              <span className="absolute top-4 right-4 text-5xl font-extrabold text-slate-800/50">
                {item.step}
              </span>

              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.border} mb-5`}>
                <item.icon className={`text-3xl ${item.iconColor}`} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
