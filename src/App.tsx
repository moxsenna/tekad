import { useEffect } from 'react';
import { initMetaPixel } from './lib/metaPixel';
import { getAppRoute } from './lib/routing';
import { AffiliatePage } from './pages/AffiliatePage';
import { LandingPageV2 } from './pages/LandingPageV2';
import { WebinarLandingPage } from './pages/WebinarLandingPage';

export default function App() {
  useEffect(() => {
    initMetaPixel();
  }, []);

  const route = getAppRoute();

  if (route === 'affiliate') {
    return <AffiliatePage />;
  }

  if (route === 'v2') {
    return <LandingPageV2 />;
  }

  return <WebinarLandingPage />;
}