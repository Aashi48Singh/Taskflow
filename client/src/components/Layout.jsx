import { useState } from "react";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

function Layout({ children, activePage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMobileMenuOpen((current) => !current);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">

      <Navbar onMenuClick={handleMenuClick} />

      <div className="relative flex min-h-[calc(100vh-64px)] w-full">

        {/* Desktop Sidebar */}
        <aside className="hidden shrink-0 md:block">
          <Sidebar activePage={activePage} />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <>
            {/* Background Overlay */}
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMobileMenu}
              className="fixed inset-0 z-40 cursor-default bg-black/40 md:hidden"
            />

            {/* Mobile Sidebar */}
            <aside
              className="
                fixed
                left-0
                top-16
                z-50
                h-[calc(100vh-64px)]
                w-[280px]
                max-w-[85vw]
                overflow-y-auto
                bg-white
                shadow-2xl
                md:hidden
              "
            >
              <Sidebar
                activePage={activePage}
                onNavigate={closeMobileMenu}
              />
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1 overflow-x-hidden">
          <div
            className="
              mx-auto
              w-full
              max-w-[1800px]
              px-3
              py-4
              sm:px-5
              sm:py-5
              md:px-6
              md:py-6
              lg:px-8
              lg:py-8
              xl:px-10
              xl:py-8
              2xl:px-12
              2xl:py-10
            "
          >
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}

export default Layout;