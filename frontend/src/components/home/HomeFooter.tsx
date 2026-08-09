import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Check } from 'lucide-react';

export const HomeFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  return (
    <footer className="bg-neutral-100/90 border-t border-neutral-200/80 pt-16 pb-12 px-6 lg:px-16 text-neutral-700">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-4 space-y-3">
            <Link to="/" className="inline-flex items-center gap-1 text-xl font-bold tracking-tight text-neutral-900">
              <span className="font-extrabold text-2xl tracking-tighter">Twin6</span>
              <span className="font-medium text-2xl tracking-tight text-neutral-800">Rental</span>
            </Link>
            <p className="text-xs text-neutral-500 max-w-xs leading-relaxed font-medium">
              Curating architectural excellence and premium goods for refined living. Rent what you need, when you need it.
            </p>
          </div>

          {/* Col 2: Company */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block">Company</span>
            <ul className="space-y-2 text-xs font-medium text-neutral-500">
              <li>
                <Link to="/about" className="hover:text-neutral-900 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-neutral-900 transition-colors">Careers</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-neutral-900 transition-colors">Press</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block">Support</span>
            <ul className="space-y-2 text-xs font-medium text-neutral-500">
              <li>
                <Link to="/contact" className="hover:text-neutral-900 transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-neutral-900 transition-colors">Help Center</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-neutral-900 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-neutral-900 transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Stay Updated */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block">Stay Updated</span>
            <p className="text-xs text-neutral-500 font-medium">
              Join our newsletter for the latest rentals.
            </p>

            <form onSubmit={handleSubscribe} className="flex items-center rounded-xl bg-white border border-neutral-200/90 p-1 shadow-sm max-w-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="text-xs text-neutral-800 placeholder-neutral-400 bg-transparent px-3 focus:outline-none flex-1 font-medium"
              />
              <button
                type="submit"
                className="bg-black text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors shrink-0 flex items-center gap-1"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Subscribed
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-neutral-200/80 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-medium">
          <span>© 2024 Twin6Rental. Curating architectural excellence for refined living.</span>
          <button aria-label="Region selector" className="text-neutral-500 hover:text-neutral-900 transition-colors">
            <Globe className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
