import { motion } from "framer-motion";

const plantPhotos = [
  {
    src: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85",
    alt: "Potted green houseplants arranged in a bright room"
  },
  {
    src: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=700&q=85",
    alt: "Professional indoor plant installation with lush foliage"
  },
  {
    src: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=700&q=85",
    alt: "Close-up of healthy green plant leaves"
  }
];

export default function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg">
      <motion.div
        animate={{ scale: [1, 1.03, 1], rotate: [0, 1.2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-8 rounded-[2rem] bg-gradient-to-br from-leaf-200 via-emerald-50 to-white shadow-glow dark:from-leaf-900 dark:via-emerald-950 dark:to-[#0b1d14]"
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-2 top-4 h-72 w-56 overflow-hidden rounded-[2rem] border-4 border-white shadow-soft dark:border-white/10 sm:left-0 sm:h-80 sm:w-64"
      >
        <img className="h-full w-full object-cover" src={plantPhotos[0].src} alt={plantPhotos[0].alt} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 top-20 h-80 w-64 overflow-hidden rounded-[2rem] border-4 border-white shadow-glow dark:border-white/10 sm:right-2"
      >
        <img className="h-full w-full object-cover" src={plantPhotos[1].src} alt={plantPhotos[1].alt} />
      </motion.div>
      <motion.div
        animate={{ x: [0, 8, 0], y: [0, -8, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-2 left-24 h-48 w-64 overflow-hidden rounded-[2rem] border-4 border-white shadow-soft dark:border-white/10 sm:bottom-8 sm:left-28"
      >
        <img className="h-full w-full object-cover" src={plantPhotos[2].src} alt={plantPhotos[2].alt} />
      </motion.div>
    </div>
  );
}
