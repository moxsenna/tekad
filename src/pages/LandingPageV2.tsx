import { useCallback, useEffect, useMemo, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { StickyMobileCta } from '../components/layout/StickyMobileCta';
import { TypeformLeadForm } from '../components/form/TypeformLeadForm';
import { V2HeroSection } from '../components/v2/V2HeroSection';
import { V2EventInfoSection } from '../components/v2/V2EventInfoSection';
import { V2ProblemSection } from '../components/v2/V2ProblemSection';
import { V2RoadmapSection } from '../components/v2/V2RoadmapSection';
import { V2BenefitSection } from '../components/v2/V2BenefitSection';
import { V2AudienceSection } from '../components/v2/V2AudienceSection';
import { V2MaterialSection } from '../components/v2/V2MaterialSection';
import { V2AfterRegisterSection } from '../components/v2/V2AfterRegisterSection';
import { V2TekadSection } from '../components/v2/V2TekadSection';
import { V2CtaSection } from '../components/v2/V2CtaSection';
import { lookupAffiliateByCode } from '../lib/lookupAffiliateByCode';
import {
  trackLandingPageView,
  trackWebinarFormOpen,
  type CtaLocation,
} from '../lib/metaPixel';
import { getEffectiveReferral, isDirectReferral } from '../lib/referral';
import {
  clearReferralDisplay,
  loadReferralDisplay,
  saveReferralDisplay,
} from '../lib/referralDisplay';
import { captureTracking } from '../lib/tracking';

export function LandingPageV2() {
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
    trackLandingPageView('v2');
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
    trackWebinarFormOpen('v2', location);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  return (
    <div className="lp-v2">
      <Header onOpenForm={openForm} className="v2-header" />
      <main>
        <V2HeroSection onOpenForm={openForm} />
        <V2EventInfoSection />
        <V2ProblemSection />
        <V2RoadmapSection onOpenForm={openForm} />
        <V2BenefitSection />
        <V2AudienceSection />
        <V2MaterialSection />
        <V2AfterRegisterSection />
        <V2TekadSection />
        <V2CtaSection onOpenForm={openForm} />
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
        lpVariant="v2"
      />
    </div>
  );
}