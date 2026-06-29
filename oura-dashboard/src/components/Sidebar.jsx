import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Activity,
  Heart,
  Moon,
  Sun,
  BarChart3,
  Gauge,
  Clock,
  PanelLeftClose,
  PanelLeftOpen,
  SportShoe,
  BatteryCharging,
  Shield,
  HeartPulse,
  FingerprintPattern
} from 'lucide-react';

const navItems = [
  { id: 'scores', label: 'Scores', icon: Gauge },
  { id: 'readiness', label: 'Readiness', icon: BatteryCharging },
  { id: 'sleep', label: 'Sleep', icon: Moon },
  { id: 'activity', label: 'Activity', icon: SportShoe },
  { id: 'stress-resilience', label: 'Stress & Resilience', icon: Shield },
  { id: 'cardio', label: 'Cardiovascular', icon: HeartPulse },
  { id: 'biometrics', label: 'Biometrics', icon: FingerprintPattern },
];

export default function Sidebar({ isCollapsed, onToggleCollapsed }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeSection, setActiveSection] = useState(navItems[0]?.id || 'scores');
  const activeSectionRef = useRef(activeSection);

  // Detect desktop screen size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  // Intersection Observer for active section highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id && activeSectionRef.current !== visible.target.id) {
          activeSectionRef.current = visible.target.id;
          setActiveSection(visible.target.id);
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0.1, 0.25, 0.5],
      }
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    setActiveSection(id);
    setIsOpen(false);
    const offset = 80; // header height
    const targetTop = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
    activeSectionRef.current = id;
  };

  const collapsedClass = isCollapsed ? 'w-20' : 'w-72';
  const shouldShow = isOpen || isDesktop;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 xl:hidden bg-slate-800/80 backdrop-blur-xl p-2.5 rounded-xl border border-white/10 shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {shouldShow && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed top-0 left-0 h-full ${collapsedClass} bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-r border-white/10 shadow-xl z-30 overflow-y-auto overflow-x-hidden transition-[width] duration-300`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className={`${isCollapsed ? 'xl:p-3.5 p-6' : 'p-6'} border-b border-white/10`}>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-full blur-2xl"></div>
                  <div className="relative hidden xl:flex justify-end">
                    <button
                      onClick={onToggleCollapsed}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-300 transition-all hover:border-cyan-400/45 hover:text-cyan-300 ${
                        isCollapsed ? 'mx-auto' : ''
                      }`}
                      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                      title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                      {isCollapsed ? (
                        <PanelLeftOpen className="h-5 w-5" />
                      ) : (
                        <PanelLeftClose className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <div className={`relative ${isCollapsed ? 'xl:hidden' : ''}`}>
                    <p className="text-base font-semibold uppercase tracking-[0.2em] bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      Oura
                    </p>
                    <h1 className="mt-1 text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                      Insights
                    </h1>
                  </div>
                </motion.div>
              </div>

              {/* Navigation */}
              <nav className={`flex-1 ${isCollapsed ? 'xl:px-3 px-4' : 'px-4'} py-6`}>
                <ul className="space-y-2">
                  {navItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <button
                          onClick={() => scrollToSection(item.id)}
                          title={isCollapsed ? item.label : undefined}
                          className={`w-full flex items-center gap-3 rounded-xl transition-all duration-300 group ${
                            isCollapsed ? 'xl:justify-center xl:px-0 px-4 py-3' : 'px-4 py-3'
                          } ${
                            isActive
                              ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30'
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                          </motion.div>
                          <span className={`text-sm font-medium ${isCollapsed ? 'xl:hidden' : ''} ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                            {item.label}
                          </span>
                          {isActive && !isCollapsed && (
                            <motion.div
                              layoutId="active"
                              className="ml-auto w-1 h-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                          )}
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* Footer */}
              <div className={`${isCollapsed ? 'xl:p-4 p-6' : 'p-6'} border-t border-white/10`}>
                <p className="text-xs text-slate-500 text-center">Oura Insights • v1.0</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}