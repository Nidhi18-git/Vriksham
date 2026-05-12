import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import HeroVisual from "../components/HeroVisual";
import SectionHeader from "../components/SectionHeader";
import { aiFeatures, features, impactMetrics, services, shopProducts } from "../data/siteData";

const testimonials = [
  ["Aarav Mehta", "Facility Head", "Vriksham gave our office a managed plant system instead of a one-time decoration project. The maintenance quality is consistent."],
  ["Nisha Rao", "Homeowner", "The request process was clean, private, and professional. I could track every step without coordinating with multiple vendors."],
  ["Karan Shah", "Co-working Founder", "Their centralized model makes green infrastructure operationally reliable for a growing workspace."]
];

export default function Home() {
  return (
    <AnimatedPage>
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-mist to-leaf-100/70 py-16 dark:from-[#07140e] dark:via-[#0b1d14] dark:to-leaf-900">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="inline-flex rounded-full border border-leaf-200 bg-white/80 px-4 py-2 text-sm font-bold text-leaf-700 dark:border-white/10 dark:bg-white/10 dark:text-leaf-200">
              Managed gardening services for modern spaces
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
              Smart Green Infrastructure for Modern Spaces
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-600 dark:text-slate-300">
              Professional plant installation, maintenance, and AI-powered green management solutions.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/request-service" className="btn-primary">
                Request Service <FiArrowRight />
              </Link>
              <Link to="/services" className="btn-secondary">
                Explore Services
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {["Admin-assigned experts", "Privacy-first workflow", "AI-ready operations"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <FiCheckCircle className="text-leaf-600" /> {item}
                </div>
              ))}
            </div>
          </motion.div>
          <HeroVisual />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <SectionHeader eyebrow="Services" title="Complete Green Infrastructure Operations" text="From indoor plant programs to corporate green spaces, Vriksham manages the full lifecycle through a centralized service model." />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div key={service.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="card hover:-translate-y-1 hover:border-leaf-300">
                  <Icon className="text-3xl text-leaf-600" />
                  <h3 className="mt-5 text-xl font-black">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{service.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white dark:bg-white/5">
        <div className="container-page">
          <SectionHeader eyebrow="Workflow" title="How Vriksham Works" text="A managed service system designed for privacy, quality control, and scalable operations." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {["User submits request", "Admin assigns expert team", "Service execution & maintenance"].map((step, index) => (
              <div key={step} className="glass rounded-2xl p-7">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-leaf-600 text-lg font-black text-white">{index + 1}</span>
                <h3 className="mt-6 text-xl font-black">{step}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {index === 0 && "Customers describe their space, budget, and preferred service window."}
                  {index === 1 && "Operations reviews the request and assigns a trusted gardener or nursery partner internally."}
                  {index === 2 && "The service is delivered professionally with status updates and maintenance history."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <SectionHeader eyebrow="Platform" title="Built for Professional Green Operations" />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.slice(0, 6).map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card">
                  <Icon className="text-3xl text-leaf-600" />
                  <h3 className="mt-4 text-lg font-black">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white dark:bg-white/5">
        <div className="container-page">
          <SectionHeader eyebrow="Shop" title="Buy Plants and Flowers Through Vriksham" text="Purchase curated indoor plants, flowering plants, bouquets, and office greenery with centralized quality control." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {shopProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="overflow-hidden rounded-2xl border border-leaf-100 bg-white shadow-soft dark:border-white/10 dark:bg-white/10">
                <img src={product.image} alt={product.name} className="h-56 w-full object-cover" />
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-leaf-600">{product.type}</p>
                  <h3 className="mt-2 text-xl font-black">{product.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{product.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-lg font-black text-leaf-700 dark:text-leaf-300">Rs {product.price.toLocaleString("en-IN")}</span>
                    <Link to="/shop" className="btn-primary px-4 py-2">Shop</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-gradient-to-br from-leaf-950 via-emerald-950 to-[#06140d] text-white">
        <div className="container-page">
          <SectionHeader tone="inverse" eyebrow="AI" title="AI-Powered Green Ecosystem" text="AI Integration modules for plant diagnosis, smart recommendations, and garden design generation." />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {aiFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-2xl border border-white/15 bg-white/[0.09] p-6 shadow-soft backdrop-blur">
                  <Icon className="text-3xl text-leaf-200" />
                  <h3 className="mt-5 text-xl font-black text-white">{feature.title}</h3>
                  <div className="mt-5 grid gap-2">
                    {feature.points.map((point) => (
                      <span key={point} className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-emerald-50">
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white dark:bg-white/5">
        <div className="container-page">
          <SectionHeader eyebrow="Business" title="Built for AMC, Subscriptions, and Corporate Green Analytics" text="Vriksham is designed as a managed green infrastructure business with recurring care plans and measurable impact." />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {impactMetrics.map(([label, value, note]) => (
              <div key={label} className="card">
                <p className="text-3xl font-black text-leaf-700 dark:text-leaf-300">{value}</p>
                <h3 className="mt-3 font-black">{label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{note}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/business" className="btn-primary">Explore Business Plans</Link>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <SectionHeader eyebrow="Clients" title="Trusted by Modern Spaces" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map(([name, role, quote]) => (
              <div key={name} className="card">
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">"{quote}"</p>
                <p className="mt-6 font-black">{name}</p>
                <p className="text-sm text-leaf-700 dark:text-leaf-300">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="container-page rounded-[2rem] bg-gradient-to-r from-leaf-700 to-emerald-500 px-6 py-14 text-center text-white shadow-glow">
          <h2 className="text-3xl font-black sm:text-5xl">Transform Your Space Into a Smart Green Environment</h2>
          <p className="mx-auto mt-5 max-w-2xl text-white/85">Submit a managed service request and let Vriksham coordinate the right expert team internally.</p>
          <Link to="/request-service" className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-black text-leaf-800">
            Start Request
          </Link>
        </div>
      </section>
    </AnimatedPage>
  );
}
