import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";

export default function DashboardLayout({ title, children }) {
  return (
    <div className="flex h-screen bg-bg text-ink-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
