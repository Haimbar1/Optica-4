import React, { useState } from 'react'; 
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AppointmentSection } from './components/AppointmentSection';
import { AboutSocialOptics } from './components/AboutSocialOptics';
import { FaqSection } from './components/FaqSection';
import { ContactLocationSection } from './components/ContactLocationSection';
import { ChatWidget } from './components/ChatWidget';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('hero') ; 

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' }); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Assistant',sans-serif]">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => scrollToSection('booking')}
      />

      <main className="flex-1">
        <Hero
          onOpenBooking={() => scrollToSection('booking')}
        />

        <AppointmentSection />
        <AboutSocialOptics />
        <FaqSection />
        <ContactLocationSection />
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
