import { useEffect, useState } from "react";
import { FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Shop", "/shop"],
  ["AI", "/ai"],
  ["Business", "/business"],
  ["Request", "/request-service"]
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("vriksham_theme") === "dark");
  const { user, logout } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("vriksham_theme", dark ? "dark" : "light");
  }, [dark]);

  const dashboardPath = user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-leaf-100/70 bg-mist/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#07140e]/85">
      <nav className="container-page flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-600 text-xl font-black text-white shadow-glow">
            V
          </span>
          <span>
            <span className="block text-lg font-black tracking-wide text-slate-950 dark:text-white">VRIKSHAM</span>
            <span className="block text-xs font-semibold text-leaf-700 dark:text-leaf-300">Green Infrastructure</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map(([label, href]) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${isActive ? "text-leaf-700 dark:text-leaf-300" : "text-slate-600 hover:text-leaf-700 dark:text-slate-300"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            aria-label="Toggle dark mode"
            onClick={() => setDark((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full border border-leaf-100 bg-white text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-white"
          >
            {dark ? <FiSun /> : <FiMoon />}
          </button>
          {user ? (
            <>
              <Link to={dashboardPath} className="btn-secondary px-5 py-2.5">
                Dashboard
              </Link>
              <button onClick={logout} className="btn-primary px-5 py-2.5">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary px-5 py-2.5">
              Login
            </Link>
          )}
        </div>

        <button
          aria-label="Open navigation"
          className="grid h-11 w-11 place-items-center rounded-full border border-leaf-100 bg-white lg:hidden dark:border-white/10 dark:bg-white/10"
          onClick={() => setOpen(true)}
        >
          <FiMenu />
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="ml-auto h-full w-[84%] max-w-sm bg-white p-6 shadow-soft dark:bg-[#0b1d14]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span className="text-lg font-black">VRIKSHAM</span>
              <button aria-label="Close navigation" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-leaf-50 dark:bg-white/10">
                <FiX />
              </button>
            </div>
            <div className="mt-8 grid gap-4">
              {navItems.map(([label, href]) => (
                <Link key={href} to={href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-leaf-50 dark:text-slate-200 dark:hover:bg-white/10">
                  {label}
                </Link>
              ))}
              <Link to={user ? dashboardPath : "/login"} onClick={() => setOpen(false)} className="btn-primary mt-2">
                {user ? "Dashboard" : "Login"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
