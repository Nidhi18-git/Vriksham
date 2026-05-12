import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-leaf-100 bg-white dark:border-white/10 dark:bg-[#07140e]">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <h3 className="text-2xl font-black text-slate-950 dark:text-white">VRIKSHAM</h3>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">
            Managed green infrastructure for homes, offices, and commercial spaces with centralized quality control and AI-ready plant intelligence.
          </p>
        </div>
        <div>
          <p className="font-bold">Platform</p>
          <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <Link to="/services">Services</Link>
            <Link to="/request-service">Request Service</Link>
            <Link to="/ai">AI Ecosystem</Link>
          </div>
        </div>
        <div>
          <p className="font-bold">Operations</p>
          <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <Link to="/dashboard">User Dashboard</Link>
            <Link to="/admin">Admin Dashboard</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
