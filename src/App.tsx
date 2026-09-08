/**
 * Declares URL → component mapping. Child routes under MainLayout share the same shell (navbar + sidebar).
 */
import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AboutPage } from './pages/AboutPage';
import { FAQPage } from './pages/FAQPage';
import { WelcomePage } from './pages/WelcomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import PageNotFound from './pages/PageNotFound';
import { ProtocolPage } from './pages/ProtocolPage';
import { TestPage } from './pages/TestPage';
import { ROUTES as r, SEGMENTS as s } from './routes';

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Navigate redirects / to /welcome, similar to returning a redirect route in Flutter. */}
        <Route index element={<Navigate to={r.WELCOME} replace />} />
      </Route>
      <Route path={s.WELCOME} element={<MainLayout />}>
        <Route index element={<WelcomePage />} />
      </Route>
      <Route path={s.HOW_IT_WORKS} element={<MainLayout />}>
        <Route index element={<HowItWorksPage />} />
      </Route>
      <Route path={`/${s.PROTOCOL}`} element={<MainLayout />}>
        <Route path={`:${s.PROTOCOL}Id`} element={<ProtocolPage />} />
      </Route>
      <Route path={s.ABOUT} element={<MainLayout showSideBar={false} />}>
        <Route index element={<AboutPage />} />
      </Route>
      <Route path={s.FAQ} element={<MainLayout showSideBar={false} />}>
        <Route index element={<FAQPage />} />
      </Route>
      <Route path={'/test'} element={<MainLayout showSideBar={false} />}>
        <Route index element={<TestPage />} />
      </Route>
      <Route path="*" element={<MainLayout showSideBar={false} />}>
        <Route path="*" element={<PageNotFound />} />
      </Route>
      {/*<Route path="*" element={<Navigate to="/" replace />} />*/}
    </Routes>
  );
};

export default App;
