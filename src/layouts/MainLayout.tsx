/**
 * Layout route: shared chrome with <Outlet /> for nested routes. Spacing/layout via Tailwind utilities.
 *
 * Shell uses h-full + overflow-hidden on the root flex column so only <main> and the sidebar scroll,
 * not the document (navbar stays visible). Child flex rows need min-h-0 so overflow can shrink.
 */
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
interface MainLayoutProps {
  showSideBar?: boolean;
}

export function MainLayout({ showSideBar = true }: MainLayoutProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <Navbar />
      <div className="min-h-0 flex-1">
        <div className={['flex h-full min-h-0', showSideBar ? 'flex-col lg:flex-row' : 'flex-col'].join(' ')}>
          {showSideBar ? <Sidebar /> : null}
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-background p-4 md:px-12 md:py-20">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
