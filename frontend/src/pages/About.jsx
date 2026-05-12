import { FiCompass, FiHeart, FiShield, FiTrendingUp } from "react-icons/fi";
import AnimatedPage from "../components/AnimatedPage";
import SectionHeader from "../components/SectionHeader";

const values = [
  [FiShield, "Managed Trust", "Centralized assignment protects user privacy and keeps quality measurable."],
  [FiHeart, "Sustainable Care", "Plants are treated as living infrastructure that needs planned maintenance."],
  [FiTrendingUp, "Scalable Operations", "The model supports homes, offices, and commercial rollouts without vendor chaos."],
  [FiCompass, "AI Direction", "Future intelligence will improve design, diagnosis, scheduling, and environmental impact."]
];

const team = [
  {
    role: "Full Stack Development and AI Integration",
    names: "Nidhi and Harshita",
    text: "Responsible for building the managed-service standards, partner network, and future AI workflows."
  },
  {
    role: "Plant Care Lead",
    names: "Avaya and Amar",
    text: "Responsible for building the managed-service standards, partner network, and future AI workflows."
  },
  {
    role: "Business Management",
    names: "Badal and Amar",
    text: "Responsible for building the managed-service standards, partner network, and future AI workflows."
  }
];

export default function About() {
  return (
    <AnimatedPage>
      <section className="section-pad bg-gradient-to-br from-white to-leaf-100 dark:from-[#07140e] dark:to-leaf-950">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            center={false}
            eyebrow="About Vriksham"
            title="A managed green infrastructure company for the next generation of spaces."
            text="Vriksham exists to make professional gardening reliable, private, and measurable. We do not operate as a public marketplace. Customers submit requests, our admin team reviews needs, and suitable gardening or nursery partners are assigned internally."
          />
          <div className="glass rounded-[2rem] p-8">
            <h3 className="text-2xl font-black">Why Centralized Management Works Better</h3>
            <p className="mt-5 leading-8 text-slate-600 dark:text-slate-300">
              Plant care fails when it is treated as a one-time transaction. Vriksham structures installation, maintenance, replacement, subscription renewals, and service quality inside one operating system. Users get clarity. Experts get organized assignments. Admins keep accountability.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <SectionHeader eyebrow="Mission" title="Sustainability That Is Operational, Not Decorative" text="Our vision is to make green coverage a managed layer of modern real estate, with healthier plants, cleaner indoor environments, and measurable environmental contribution." />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {values.map(([Icon, title, text]) => (
              <div key={title} className="card">
                <Icon className="text-3xl text-leaf-600" />
                <h3 className="mt-5 text-lg font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white dark:bg-white/5">
        <div className="container-page">
          <SectionHeader eyebrow="Team" title="Built by Operators, Plant Experts, and Product Thinkers" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {team.map((member, index) => (
              <div key={member.role} className="card text-center">
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-leaf-200 to-emerald-400 text-3xl font-black text-leaf-900">
                  {index + 1}
                </div>
                <h3 className="mt-6 text-xl font-black">{member.role}</h3>
                <p className="mt-2 text-sm font-bold text-leaf-700 dark:text-leaf-300">{member.names}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{member.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
