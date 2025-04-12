import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "/favicon.ico"; // use uma imagem de alta resolução aqui

export default function OpeningAnimation() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3500); // Dura 3.5 segundos
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Logo animado */}
          <motion.img
            src={logo}
            alt="Logo Mydia"
            className="w-48 md:w-64 h-auto mb-6"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 12 }}
          />

          {/* Texto de boas-vindas */}
          <motion.h1
            className="text-white text-2xl md:text-3xl font-semibold tracking-wide text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            Seja bem-vinda, My! 💫
          </motion.h1>

          {/* Subtexto opcional */}
          <motion.p
            className="text-white text-base mt-2 opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
          >
            Aproveite a sua ferramenta inteligente.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
