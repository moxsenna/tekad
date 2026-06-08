import { getAppRoute } from './lib/routing';
import { AffiliatePage } from './pages/AffiliatePage';
import { WebinarLandingPage } from './pages/WebinarLandingPage';

export default function App() {
  const route = getAppRoute();

  if (route === 'affiliate') {
    return <AffiliatePage />;
  }

  return <WebinarLandingPage />;
}