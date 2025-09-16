import React from 'react';
import Hero from '@/components/Hero';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="bg-background min-h-screen">
      <main>
        {/* Renderize as seções da sua página inicial */}
        <Hero />
        <FeaturesSection />
        <Footer />
      </main>
    </div>
  );
};

export default Index;
