import { FiBarChart2, FiBriefcase, FiCheckCircle, FiShield } from "react-icons/fi";
import AnimatedPage from "../components/AnimatedPage";
import SectionHeader from "../components/SectionHeader";
import { impactMetrics, subscriptionPlans } from "../data/siteData";

export default function Business() {
  return (
    <AnimatedPage>
      <section className="section-pad bg-gradient-to-br from-white to-leaf-100 dark:from-[#07140e] dark:to-leaf-950">
        <div className="container-page">
          <SectionHeader eyebrow="Business" title="Investor-Ready Green Infrastructure Plans" text="Vriksham combines AMC maintenance, subscriptions, corporate green programs, and environmental analytics into one managed platform." />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <div key={plan.name} className="card">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-leaf-600">{plan.audience}</p>
                <h3 className="mt-3 text-3xl font-black">{plan.name}</h3>
                <p className="mt-3 text-2xl font-black text-leaf-700 dark:text-leaf-300">{plan.price}</p>
                <div className="mt-6 grid gap-3">
                  {plan.features.map((feature) => (
                    <p key={feature} className="flex gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      <FiCheckCircle className="mt-0.5 shrink-0 text-leaf-600" /> {feature}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="card">
              <FiBriefcase className="text-3xl text-leaf-600" />
              <h3 className="mt-5 text-2xl font-black">Corporate Green Solutions</h3>
              <p className="mt-3 leading-8 text-slate-600 dark:text-slate-300">
                Vriksham supports offices, co-working spaces, retail buildings, and campuses with plant installation, AMC care, replacement planning, and centralized reporting.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {["Office plant programs", "Campus green coverage", "Reception and lobby design", "Monthly AMC tracking"].map((item) => (
                  <span key={item} className="rounded-2xl bg-leaf-50 px-4 py-3 text-sm font-bold text-leaf-900 dark:bg-white/10 dark:text-leaf-100">{item}</span>
                ))}
              </div>
            </div>

            <div className="card">
              <FiBarChart2 className="text-3xl text-leaf-600" />
              <h3 className="mt-5 text-2xl font-black">Smart Green Analytics</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {impactMetrics.map(([label, value, note]) => (
                  <div key={label} className="rounded-2xl bg-leaf-50 p-5 dark:bg-white/10">
                    <p className="text-3xl font-black text-leaf-700 dark:text-leaf-300">{value}</p>
                    <p className="mt-2 font-black">{label}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-[2rem] bg-leaf-950 p-8 text-white shadow-glow">
            <FiShield className="text-3xl text-leaf-200" />
            <h3 className="mt-5 text-3xl font-black">AMC Maintenance Engine</h3>
            <p className="mt-4 max-w-4xl leading-8 text-emerald-50/85">
              Annual Maintenance Contracts can track scheduled visits, completed visits, renewal dates, predicted next maintenance, replacement needs, and AI scan history. This is the recurring revenue layer behind Vriksham.
            </p>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
