import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "@/components/LoginForm";
import { FloatingWord } from "@/components/FloatingWord";
import liquidBg from "@/assets/images/liquid-bg.png";
import { ChevronRight, ChevronLeft } from "lucide-react";

const slides = [
  {
    title: "Master New Languages",
    description: "Immerse yourself in a world of words and cultures.",
    accent: "from-blue-400 to-cyan-400",
  },
  {
    title: "Speak with Confidence",
    description: "Practice real-world conversations with our AI tutor.",
    accent: "from-purple-400 to-pink-400",
  },
  {
    title: "Global Connection",
    description: "Join a community of millions learning together.",
    accent: "from-emerald-400 to-teal-400",
  }
];

export default function AuthPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const words = [
    { text: "Learn", className: "top-[10%] left-[10%] text-6xl" },
    { text: "Speak", className: "top-[20%] right-[15%] text-7xl" },
    { text: "Fluent", className: "bottom-[15%] left-[20%] text-5xl" },
    { text: "Practice", className: "bottom-[25%] right-[10%] text-6xl" },
    { text: "Listen", className: "top-[40%] left-[5%] text-4xl" },
    { text: "Connect", className: "top-[10%] right-[35%] text-4xl" },
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col lg:flex-row bg-black">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105"
        style={{ backgroundImage: `url(${liquidBg})` }}
      />
      
      {/* Left Side: Animated Slides */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 lg:px-24 py-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {words.map((word, i) => (
            <FloatingWord 
              key={i} 
              word={word.text} 
              className={word.className} 
              delay={i * 0.5} 
            />
          ))}
        </div>

        <div className="relative z-10 max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div 
                className={`h-1 w-12 rounded-full bg-gradient-to-r ${slides[currentSlide].accent} mb-6`}
                layoutId="activeBar"
              />
              <h2 className="text-5xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
                {slides[currentSlide].title}
              </h2>
              <p className="text-xl text-white/60 mb-8 max-w-md leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 bg-white/5 backdrop-blur-md lg:backdrop-blur-none lg:bg-transparent border-t lg:border-t-0 lg:border-l border-white/10">
        <LoginForm />
      </div>

      {/* Decorative Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"
      />
    </div>
  );
}
