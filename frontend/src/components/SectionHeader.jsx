import { motion } from "framer-motion";

export default function SectionHeader({ eyebrow, title, text, center = true, tone = "default" }) {
  const isInverse = tone === "inverse";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}
    >
      {eyebrow && (
        <p className={`text-sm font-bold uppercase tracking-[0.18em] ${isInverse ? "text-leaf-200" : "text-leaf-600"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`mt-3 text-3xl font-black sm:text-4xl ${isInverse ? "text-white" : "text-slate-950 dark:text-white"}`}>
        {title}
      </h2>
      {text && (
        <p className={`mt-4 text-base leading-8 ${isInverse ? "text-emerald-50/85" : "text-slate-600 dark:text-slate-300"}`}>
          {text}
        </p>
      )}
    </motion.div>
  );
}
