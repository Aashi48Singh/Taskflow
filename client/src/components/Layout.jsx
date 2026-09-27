import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

function Layout({ children, activePage }) {
  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <div className="flex">

        <Sidebar activePage={activePage} />

        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>

    </div>
  );
}

export default Layout;