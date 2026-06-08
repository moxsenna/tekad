import { useCallback, useMemo, useState } from 'react';
import { Header } from './components/layout/Header';
import { TypeformLeadForm } from './components/form/TypeformLeadForm';
import { HeroSection } from './components/sections/HeroSection';
import { ProblemSection } from './components/sections/ProblemSection';
import { HopeSection } from './components/sections/HopeSection';
import { BenefitSection } from './components/sections/BenefitSection';
import { AudienceSection } from './components/sections/AudienceSection';
import { MaterialSection } from './components/sections/MaterialSection';
import { TekadSection } from './components/sections/TekadSection';
import { FormCtaSection } from './components/sections/FormCtaSection';
import { captureTracking } from './lib/tracking';

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const tracking = useMemo(() => captureTracking(), []);

  const openForm = useCallback(() => {
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  return (
    <>
      <Header onOpenForm={openForm} />
      <main>
        <HeroSection onOpenForm={openForm} />
        <ProblemSection />
        <HopeSection />
        <BenefitSection />
        <AudienceSection />
        <MaterialSection />
        <TekadSection />
        <FormCtaSection onOpenForm={openForm} />
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} LPK TEKAD. Semua hak dilindungi.</p>
        </div>
      </footer>
      <TypeformLeadForm isOpen={isFormOpen} onClose={closeForm} tracking={tracking} />
    </>
  );
}