import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { SupportedCropsSection } from '@/components/landing/SupportedCropsSection';
import { AdvisorySection } from '@/components/landing/AdvisorySection';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="landing">
      <PublicHeader />
      <main id="main-content">
        <HeroSection />
        <HowItWorksSection />
        <SupportedCropsSection />
        <AdvisorySection />
      </main>
      <Footer />
    </div>
  );
}
