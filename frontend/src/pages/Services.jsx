import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import SectionHeader from "../components/SectionHeader";
import { services } from "../data/siteData";

export default function Services() {
  return (
    <AnimatedPage>
      <section className="section-pad bg-gradient-to-br from-white to-leaf-100 dark:from-[#07140e] dark:to-leaf-950">
        <div className="container-page">
          <SectionHeader eyebrow="Services" title="Professional Plant Services Under One Managed System" text="Every service request is reviewed by Vriksham operations and assigned internally to suitable experts for controlled execution." />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.title} className="card grid gap-6 sm:grid-cols-[auto_1fr]">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-leaf-100 text-2xl text-leaf-700 dark:bg-white/10 dark:text-leaf-300">
                    <Icon />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{service.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{service.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {service.benefits.map((benefit) => (
                        <span key={benefit} className="rounded-full bg-leaf-50 px-3 py-1 text-xs font-bold text-leaf-800 dark:bg-white/10 dark:text-leaf-200">
                          {benefit}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <span className="font-black text-leaf-700 dark:text-leaf-300">{service.price}</span>
                      <Link to="/request-service" className="btn-primary px-5 py-2.5">
                        Request <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
