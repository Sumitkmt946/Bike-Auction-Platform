import { Link } from 'react-router-dom';
import { 
  RiMotorbikeFill, 
  RiHeartFill, 
  RiTwitterXFill, 
  RiInstagramFill, 
  RiGithubFill, 
  RiLinkedinFill,
  RiArrowRightLine
} from 'react-icons/ri';

export default function Footer() {
  return (
    <footer className="relative bg-slate-50 pt-16 pb-8 border-t border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-accent-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-400/5 border border-accent-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <RiMotorbikeFill className="text-xl text-accent-400" />
              </div>
              <span className="text-xl font-bold gradient-text tracking-tight">BikeAuction</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
              The premier destination for motorcycle enthusiasts to discover, bid on, and win exclusive two-wheeled masterpieces from around the globe.
            </p>
            <div className="flex items-center gap-4">
              {[RiTwitterXFill, RiInstagramFill, RiGithubFill, RiLinkedinFill].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-accent-400 hover:border-accent-500/50 hover:bg-accent-500/10 transition-all duration-300 hover:-translate-y-1">
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-900 font-semibold mb-6 tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Active Auctions', path: '/auctions?status=active' },
                { name: 'Past Auctions', path: '/auctions?status=ended' },
                { name: 'Sell Your Bike', path: '/admin/bikes/create' },
                { name: 'How it Works', path: '/#how-it-works' }
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-slate-600 hover:text-accent-400 text-sm flex items-center gap-2 group transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-100 group-hover:bg-accent-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-slate-900 font-semibold mb-6 tracking-wide">Support</h3>
            <ul className="space-y-3">
              {[
                { name: 'Help Center', path: '/info/help' },
                { name: 'Terms of Service', path: '/info/terms' },
                { name: 'Privacy Policy', path: '/info/privacy' },
                { name: 'Bidding Rules', path: '/info/rules' },
                { name: 'Contact Us', path: '/info/contact' }
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-slate-600 hover:text-accent-400 text-sm flex items-center gap-2 group transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-100 group-hover:bg-accent-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-slate-900 font-semibold mb-6 tracking-wide">Stay Updated</h3>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              Subscribe to our newsletter to get the latest auction alerts and motorcycle news.
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/50 transition-all"
              />
              <button 
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 w-9 rounded-lg bg-accent-500 text-slate-900 flex items-center justify-center hover:bg-accent-600 transition-colors shadow-lg shadow-accent-500/20"
              >
                <RiArrowRightLine />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} BikeAuction. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 text-center md:text-right flex items-center gap-1.5">
            Built with <RiHeartFill className="text-red-500 animate-pulse" /> by Sumit for Bike Auction
          </p>
        </div>
      </div>
    </footer>
  );
}
