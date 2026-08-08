import React from 'react';

// Import modular Home & HowItWorks components
import { NavbarHeader } from '../components/home/NavbarHeader';
import { HowItWorksHero } from '../components/how-it-works/HowItWorksHero';
import { RentalProcessSteps } from '../components/how-it-works/RentalProcessSteps';
import { CommonQuestionsFAQ } from '../components/how-it-works/CommonQuestionsFAQ';
import { HomeFooter } from '../components/home/HomeFooter';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8f8fa] text-neutral-900 flex flex-col font-sans">
      {/* Navbar Header */}
      <NavbarHeader />

      {/* Main Content */}
      <main className="flex-1 space-y-4">
        {/* Hero Section */}
        <HowItWorksHero />

        {/* 4-Step Process Timeline */}
        <RentalProcessSteps />

        {/* FAQ Grid & Contact Support Callout */}
        <CommonQuestionsFAQ />
      </main>

      {/* Home Footer */}
      <HomeFooter />
    </div>
  );
};

export default HowItWorksPage;
