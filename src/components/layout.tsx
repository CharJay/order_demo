import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { MenuIcon, XIcon, PackageIcon, PlusCircleIcon } from "lucide-react";

const navItems = [
  { label: "订单列表", path: "/" },
  { label: "创建订单", path: "/create" },
];

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Topbar */}
      <header className="sticky top-0 z-50 bg-card border-b border-border h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <PackageIcon className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg tracking-tight hidden sm:inline">订单管理系统</span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Create Button */}
          <div className="hidden md:block">
            <NavLink
              to="/create"
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 hover:text-primary-foreground transition-colors"
            >
              <PlusCircleIcon className="w-4 h-4" />
              创建订单
            </NavLink>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-xl text-muted-foreground hover:bg-slate-100 hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/create"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 hover:text-primary-foreground transition-colors mt-2"
            >
              <PlusCircleIcon className="w-4 h-4" />
              创建订单
            </NavLink>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
