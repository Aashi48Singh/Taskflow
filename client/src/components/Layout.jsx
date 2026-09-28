import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

function Layout({ children, activePage }) {
  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <div className="flex min-h-[calc(100vh-64px)]">

        <Sidebar activePage={activePage} />

        <main className="flex-1 min-w-0 overflow-x-hidden">
          {children}
        </main>

      </div>

    </div>
  );
}

export default Layout;