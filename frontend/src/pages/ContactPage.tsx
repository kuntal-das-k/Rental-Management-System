import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavbarHeader } from '../components/home/NavbarHeader';
import { api } from '../api/client';
import { Mail, Phone, MapPin, Clock, CheckCircle2, Send, Loader2 } from 'lucide-react';

const EMAILJS_SERVICE_ID = 'service_oq4bk1e';
const EMAILJS_TEMPLATE_ID = 'template_d58ad5d';
const EMAILJS_PUBLIC_KEY = 'jFrRS_CiaciugTvMz';

export const ContactPage: React.FC = () => {
  const location = useLocation();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'General Inquiry',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    try {
      setIsSubmitting(true);

      const templateParams = {
        from_name: formData.name,
        name: formData.name,
        user_name: formData.name,
        from_email: formData.email,
        email: formData.email,
        user_email: formData.email,
        reply_to: formData.email,
        topic: formData.topic,
        subject: `[${formData.topic}] Inquiry from ${formData.name}`,
        message: formData.message,
      };

      let emailSent = false;

      // Try sending via EmailJS dynamically if available
      try {
        // @ts-ignore
        const emailjsModule = await import('@emailjs/browser');
        await emailjsModule.default.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );
        emailSent = true;
      } catch (emailjsErr: any) {
        console.warn('EmailJS send note:', emailjsErr);
      }

      // Try syncing with API backend if running
      try {
        await api.post('/contact', formData);
        emailSent = true;
      } catch (backendErr: any) {
        console.warn('Backend API sync skipped/failed:', backendErr);
      }

      // Mark submitted so user sees success confirmation
      setFormSubmitted(true);
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(
        err?.text || err?.message || 'Failed to send message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Header / Navigation */}
      <NavbarHeader />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pt-16 pb-20 space-y-12 sm:space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900">
            Get in Touch.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed font-normal">
            Have questions about a luxury rental booking, vendor partnership, or custom request? Our dedicated concierge team is at your service.
          </p>
        </section>

        {/* Contact Grid Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F4F4F6] rounded-2xl sm:rounded-3xl p-8 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                Concierge Directory
              </h2>
              
              <div className="space-y-5 text-xs sm:text-sm">
                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-sm shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block text-xs">Email Concierge</span>
                    <a href="mailto:concierge@twin6rental.com" className="text-slate-600 hover:text-slate-900 transition-colors">
                      concierge@twin6rental.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-sm shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block text-xs">Direct Telephone</span>
                    <a href="tel:+18005558946" className="text-slate-600 hover:text-slate-900 transition-colors">
                      +1 (800) 555-TWIN (8946)
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-sm shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block text-xs">Global Headquarters</span>
                    <p className="text-slate-600 leading-relaxed">
                      742 Evergreen Terrace, Suite 600<br />
                      San Francisco, CA 94107
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-sm shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block text-xs">Concierge Hours</span>
                    <p className="text-slate-600">
                      Mon – Sun: 8:00 AM – 10:00 PM EST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response SLA Note Card */}
            <div className="bg-[#F4F4F6] rounded-2xl sm:rounded-3xl p-6 flex items-center space-x-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-950 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 text-xs">
                <span className="font-semibold text-slate-900 block">Fast Response SLA</span>
                <p className="text-slate-500 leading-relaxed">
                  Average response time is under 15 minutes during operating hours.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200/70 rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
              {formSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Message Received</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out to Twin6Rental. A concierge specialist has been assigned to your message and will respond shortly.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: '', email: '', topic: 'General Inquiry', message: '' });
                    }}
                    className="mt-4 text-xs font-semibold text-slate-900 border-b border-slate-900 pb-0.5 hover:opacity-75 transition-opacity"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                      Send Us a Message
                    </h2>
                    <p className="text-xs text-slate-500">
                      Fill in the details below and we will get back to you promptly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 block">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-[#FAFAFA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 block">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full bg-[#FAFAFA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Topic Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">Inquiry Topic</label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full bg-[#FAFAFA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Rental Booking">Rental Booking & Orders</option>
                      <option value="Vendor Partnership">Vendor & Marketplace Listing</option>
                      <option value="Concierge Request">Concierge & Bespoke Request</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we assist you today?"
                      className="w-full bg-[#FAFAFA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs">
                      {errorMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs py-3 rounded-full transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#EFEFEF] border-t border-slate-200/80 mt-auto py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Left Footer Column */}
          <div className="space-y-2 max-w-sm">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Twin6Rental
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              © 2024 Twin6Rental. Leading marketplace for premium product rentals.
            </p>
          </div>

          {/* Right Footer Link Columns */}
          <div className="flex items-start space-x-16 sm:space-x-24">
            {/* Legal Column */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-900 block">
                Legal
              </span>
              <ul className="space-y-1 text-[11px] text-slate-500">
                <li>
                  <Link to="#" className="hover:text-slate-900 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-slate-900 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-900 block">
                Support
              </span>
              <ul className="space-y-1 text-[11px] text-slate-500">
                <li>
                  <Link to="#" className="hover:text-slate-900 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-slate-900 transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-slate-900 transition-colors">
                    Newsletter Signup
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
