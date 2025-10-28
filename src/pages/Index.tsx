import Hero from '@/components/Hero';
import FeaturesSection from '@/components/FeaturesSection';
// CORREÇÃO: Remover a importação do Footer daqui
// import Footer from '@/components/Footer'; 

const Index = () => {
  return (
    // Removido min-h-screen daqui, pois o App.tsx já controla a altura mínima
    <div className="bg-background"> 
      <main>
        <Hero />
        <FeaturesSection />
        {/* CORREÇÃO: Remover a chamada do Footer daqui */}
        {/* <Footer /> */}
      </main>
    </div>
  );
};

export default Index;
