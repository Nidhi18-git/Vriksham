import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import { useAuth } from "../context/AuthContext";

export default function Auth({ mode }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = isSignup ? await signup(form) : await login({ email: form.email, password: form.password });
      navigate(user.role === "admin" || user.role === "superadmin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <section className="section-pad bg-gradient-to-br from-white to-leaf-100 dark:from-[#07140e] dark:to-leaf-950">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-leaf-600">Secure Access</p>
            <h1 className="mt-4 text-4xl font-black sm:text-6xl">{isSignup ? "Create your Vriksham account" : "Welcome back to Vriksham"}</h1>
            <p className="mt-5 max-w-xl leading-8 text-slate-600 dark:text-slate-300">
              Create an account to manage service requests, shop orders, plant care reminders, and AI scan history.
            </p>
          </div>
          <form onSubmit={submit} className="glass rounded-[2rem] p-8">
            {isSignup && (
              <>
                <input className="input mb-4" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
                <input className="input mb-4" placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
              </>
            )}
            <input className="input mb-4" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            <input className="input mb-4" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required minLength={6} />
            {error && <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
            <button disabled={loading} className="btn-primary w-full">
              {loading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
            </button>
            <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
              {isSignup ? "Already have an account? " : "Need an account? "}
              <Link className="font-bold text-leaf-700 dark:text-leaf-300" to={isSignup ? "/login" : "/signup"}>
                {isSignup ? "Login" : "Sign up"}
              </Link>
            </p>
          </form>
        </div>
      </section>
    </AnimatedPage>
  );
}
