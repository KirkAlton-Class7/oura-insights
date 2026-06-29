import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function Toast({ message, isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[9999]"
        >
          <div className="flex items-center gap-3 bg-slate-800/90 backdrop-blur-md border border-cyan-400/30 rounded-xl px-6 py-3 shadow-2xl">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-slate-200">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}