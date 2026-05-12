import { motion } from "framer-motion";

export default function AnimatedPage({ children }) {
  return (
    <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      {children}
    </motion.main>
  );
}
