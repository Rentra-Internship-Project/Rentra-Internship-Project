import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PiWrenchFill, PiListBold, PiXBold } from 'react-icons/pi';
import Button from './Button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className="w-full fixed top-0 left-0 right-0 z-[100] transition-all duration-300 bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
        
        {/* Logo (Text Only as requested) */}
        <Link to="/" className="flex items-center text-brand-primary z-50 hover:opacity-80 transition-opacity">
          <span className="font-black text-2xl md:text-3xl tracking-tight">Rentra</span>
        </Link>

        {/* Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-8 text-m font-semibold text-gray-600">
          <Link to="/" className="hover:text-brand-primary transition-colors">Browse Equipments</Link>
          <Link to="/" className="hover:text-brand-primary transition-colors">How it Works</Link>
          <Link to="/" className="hover:text-brand-primary transition-colors">About</Link>
          <Link to="/" className="hover:text-brand-primary transition-colors">Contact</Link>
        </div>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-3">
          <Link to="/login">
            <Button variant="ghost" className="text-gray-700 font-semibold hover:bg-gray-100 hover:text-gray-900 rounded-sm">
              Log in
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" className="rounded-sm shadow-lg shadow-brand-primary/30 hover:shadow-brand-primary/40 hover:-translate-y-0.5 transition-all font-bold">
              Sign up
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-900 z-50 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <PiXBold className="w-7 h-7" /> : <PiListBold className="w-7 h-7" />}
        </button>
      </div>

      {/* Fail-Proof Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-gray-200 shadow-2xl px-6 py-8 flex flex-col space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <Link to="/" className="text-lg font-bold text-gray-800 hover:text-brand-primary p-3 rounded-sm hover:bg-brand-primary/5 transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/" className="text-lg font-bold text-gray-800 hover:text-brand-primary p-3 rounded-sm hover:bg-brand-primary/5 transition-colors" onClick={() => setMobileMenuOpen(false)}>Browse Equiments</Link>
          <Link to="/" className="text-lg font-bold text-gray-800 hover:text-brand-primary p-3 rounded-sm hover:bg-brand-primary/5 transition-colors" onClick={() => setMobileMenuOpen(false)}>How it Works</Link>
          <Link to="/" className="text-lg font-bold text-gray-800 hover:text-brand-primary p-3 rounded-sm hover:bg-brand-primary/5 transition-colors" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link to="/" className="text-lg font-bold text-gray-800 hover:text-brand-primary p-3 rounded-sm hover:bg-brand-primary/5 transition-colors" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          
          <div className="pt-6 mt-4 border-t border-gray-100 flex flex-col space-y-4">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center py-3.5 rounded-sm text-base font-bold text-gray-800 border-2 border-gray-200">
                Log in
              </Button>
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full justify-center py-3.5 rounded-sm shadow-lg shadow-brand-primary/30 text-base font-bold">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
