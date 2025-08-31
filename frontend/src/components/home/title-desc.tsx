import React from "react";
import { motion } from "motion/react";

const TitleDescription = ({ title, desc }: { title: string; desc: string }) => {
  return (
    <div className="max-w-4xl mx-auto text-center mb-6 md:mb-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-xl sm:text-2xl md:text-4xl font-display font-bold text-slate-900"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="mt-4 text-sm md:text-lg text-slate-600 sm:text-xl"
      >
        {desc}
      </motion.p>
    </div>
  );
};

export default TitleDescription;
