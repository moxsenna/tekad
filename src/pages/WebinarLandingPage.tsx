import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { CommitmentSection } from '../components/sections/CommitmentSection';
import { MaterialSection } from '../components/sections/MaterialSection';
import { AfterRegisterSection } from '../components/sections/AfterRegisterSection';
import { TekadSection } from '../components/sections/TekadSection';
import { FormCtaSection } from '../components/sections/FormCtaSection';
import { WhyImportantSection } from '../components/sections/WhyImportantSection';
import { BonusFreeSection } from '../components/sections/BonusFreeSection';
import { SpeakerSection } from '../components/sections/SpeakerSection';
import { TrustLPKSection } from '../components/sections/TrustLPKSection';
import { lookupAffiliateByCode } from '../lib/lookupAffiliateByCode';
import { getEffectiveReferral, isDirectReferral } from '../lib/referral';
import {
  clearReferralDisplay,
  loadReferralDisplay,
  saveReferralDisplay,
} from '../lib/referralDisplay';
import { trackLandingPageView, trackWebinarFormOpen, type CtaLocation } from '../lib/metaPixel';
import { captureTracking } from '../lib/tracking';

export function WebinarLandingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const refCode = useMemo(() => getEffectiveReferral(), []);
  const [referralDisplayName, setReferralDisplayName] = useState<string | null>(() => {
    if (isDirectReferral(refCode)) return null;
    return loadReferralDisplay(refCode)?.affiliate_name ?? null;
  });

  const tracking = useMemo(
    () => ({
      ...captureTracking(),
      ref_code: refCode,
    }),
    [refCode]
  );

  useEffect(() => {
    trackLandingPageView('main');
  }, []);

  useEffect(() => {
    if (isDirectReferral(refCode)) {
      clearReferralDisplay();
      setReferralDisplayName(null);
      return;
    }

    const cached = loadReferralDisplay(refCode);
    if (cached?.affiliate_name) {
      setReferralDisplayName(cached.affiliate_name);
      return;
    }

    let cancelled = false;

    lookupAffiliateByCode(refCode).then((result) => {
      if (cancelled) return;

      if ('ok' in result && result.ok && result.affiliate_name.trim()) {
        setReferralDisplayName(result.affiliate_name.trim());
        saveReferralDisplay(refCode, result.affiliate_name);
        return;
      }

      setReferralDisplayName(null);
      clearReferralDisplay();
    });

    return () => {
      cancelled = true;
    };
  }, [refCode]);

  const openForm = useCallback((location: CtaLocation) => {
    trackWebinarFormOpen('main', location);
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
        <TrustStrip />
        <ProblemSection />
        <WhyImportantSection />
        <RoadmapSection onOpenForm={openForm} />
        <BenefitSection />
        <AudienceSection />
        <CommitmentSection />
        <MaterialSection />
        <BonusFreeSection />
        <AfterRegisterSection />
        <TekadSection />
        <SpeakerSection />
        <TrustLPKSection />
        <FormCtaSection onOpenForm={openForm} />
      </main>
      {referralDisplayName && (
        <div className="referral-badge" role="status">
          <div className="container referral-badge__inner">
            Direkomendasikan oleh{' '}
            <span className="referral-badge__name">{referralDisplayName}</span>
          </div>
        </div>
      )}
      <Footer />
      <StickyMobileCta onOpenForm={openForm} isFormOpen={isFormOpen} />
      <TypeformLeadForm
        isOpen={isFormOpen}
        onClose={closeForm}
        tracking={tracking}
        refCode={refCode}
        lpVariant="main"
      />
    </>
  );
}