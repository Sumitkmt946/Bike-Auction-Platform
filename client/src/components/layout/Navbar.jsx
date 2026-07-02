import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RiMotorbikeFill, RiMenuLine, RiCloseLine, RiDashboardLine, RiAuctionLine, RiUserLine, RiLogoutBoxRLine, RiLoginBoxLine, RiUserAddLine, RiShieldUserLine, RiHomeLine } from 'react-icons/ri';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'text-accent-400 bg-accent-500/10'
        : 'text-slate-300 hover:text-white hover:bg-white/5'
    }`;

  return (
    <nav className="sticky top-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ────────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 group" onClick={closeMobile}>
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-accent-500 to-accent-400 shadow-lg shadow-accent-500/25 group-hover:shadow-accent-500/40 transition-shadow duration-300">
              <RiMotorbikeFill className="text-xl text-white" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">BikeAuction</span>
          </Link>

          {/* ── Desktop Nav ─────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={linkClasses} end>
              <RiHomeLine /> Home
            </NavLink>
            <NavLink to="/auctions" className={linkClasses}>
              <RiAuctionLine /> Auctions
            </NavLink>

            {isAuthenticated && (
              <NavLink to="/dashboard" className={linkClasses}>
                <RiDashboardLine /> Dashboard
              </NavLink>
            )}

            {isAdmin && (
              <NavLink to="/admin" className={linkClasses}>
                <RiShieldUserLine /> Admin
              </NavLink>
            )}
          </div>

          {/* ── Desktop Auth ────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-500 to-accent-400 flex items-center justify-center text-xs font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-300">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all duration-300"
                >
                  <RiLogoutBoxRLine /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-300"
                >
                  <RiLoginBoxLine /> Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-accent-500 to-accent-400 rounded-lg hover:from-accent-600 hover:to-accent-500 transition-all duration-300 shadow-lg shadow-accent-500/20"
                >
                  <RiUserAddLine /> Register
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ─────────────────────────────────────── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            {mobileOpen ? <RiCloseLine className="text-2xl" /> : <RiMenuLine className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Slide-Out Menu ──────────────────────────────────── */}
      <div
        className={`md:hidden fixed inset-0 top-16 z-40 transition-all duration-300 ${
          mobileOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMobile}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 w-72 h-full bg-slate-900 border-l border-slate-800 p-6 transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col gap-2">
            <NavLink to="/" className={linkClasses} onClick={closeMobile} end>
              <RiHomeLine /> Home
            </NavLink>
            <NavLink to="/auctions" className={linkClasses} onClick={closeMobile}>
              <RiAuctionLine /> Auctions
            </NavLink>

            {isAuthenticated && (
              <NavLink to="/dashboard" className={linkClasses} onClick={closeMobile}>
                <RiDashboardLine /> Dashboard
              </NavLink>
            )}

            {isAdmin && (
              <NavLink to="/admin" className={linkClasses} onClick={closeMobile}>
                <RiShieldUserLine /> Admin Panel
              </NavLink>
            )}

            <hr className="border-slate-800 my-3" />

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-500 to-accent-400 flex items-center justify-center text-sm font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all mt-2"
                >
                  <RiLogoutBoxRLine /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                  onClick={closeMobile}
                >
                  <RiLoginBoxLine /> Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-accent-500 to-accent-400 rounded-lg text-center justify-center mt-1"
                  onClick={closeMobile}
                >
                  <RiUserAddLine /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
