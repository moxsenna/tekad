import { useCallback, useMemo, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { StickyMobileCta } from '../components/layout/StickyMobileCta';
import { TypeformLeadForm } from '../components/form/TypeformLeadForm';
import { HeroSection } from '../components/sections/HeroSection';
import { TrustStrip } from '../components/sections/TrustStrip';
import { ProblemSection } from '../components/sections/ProblemSection';
import { RoadmapSection } from '../components/sections/RoadmapSection';
import { BenefitSection } from '../components/sections/BenefitSection';
import { AudienceSection } from '../components/sections/AudienceSection';
import { MaterialSection } from '../components/sections/MaterialSection';
import { AfterRegisterSection } from '../components/sections/AfterRegisterSection';
import { TekadSection } from '../components/sections/TekadSection';
import { FormCtaSection } from '../components/sections/FormCtaSection';
import { getEffectiveReferral, isDirectReferral } from '../lib/referral';
import { captureTracking } from '../lib/tracking';

export function WebinarLandingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const refCode = useMemo(() => getEffectiveReferral(), []);
  const tracking = useMemo(
    () => ({
      ...captureTracking(),
      ref_code: refCode,
    }),
    [refCode]
  );

  const openForm = useCallback(() => {
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  return (
    <>
      <Header onOpenForm={openForm} />
      {!isDirectReferral(refCode) && (
        <div className="referral-badge" role="status">
          Direkomendasikan oleh <span className="referral-badge__code">{refCode}</span>
        </div>
      )}
      <main>
        <HeroSection onOpenForm={openForm} />
        <TrustStrip />
        <ProblemSection />
        <RoadmapSection onOpenForm={openForm} />
        <BenefitSection />
        <AudienceSection />
        <MaterialSection />
        <AfterRegisterSection />
        <TekadSection />
        <FormCtaSection onOpenForm={openForm} />
      </main>
      <Footer />
      <StickyMobileCta onOpenForm={openForm} isFormOpen={isFormOpen} />
      <TypeformLeadForm
        isOpen={isFormOpen}
        onClose={closeForm}
        tracking={tracking}
        refCode={refCode}
      />
    </>
  );
}