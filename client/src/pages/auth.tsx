import { LoginForm } from "@/components/LoginForm";
import { FloatingWord } from "@/components/FloatingWord";
import liquidBg from "@/assets/images/liquid-bg.png"; // Assuming the image was generated here
import { motion } from "framer-motion";

export default function AuthPage() {
  const words = [
    { text: "Learn", className: "top-[10%] left-[10%] text-6xl" },
    { text: "Speak", className: "top-[20%] right-[15%] text-7xl" },
    { text: "Fluent", className: "bottom-[15%] left-[20%] text-5xl" },
    { text: "Practice", className: "bottom-[25%] right-[10%] text-6xl" },
    { text: "Listen", className: "top-[40%] left-[5%] text-4xl" },
    { text: "Connect", className: "top-[10%] right-[35%] text-4xl" },
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-black">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: `url(${liquidBg})` }}
      />
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-black/60 mix-blend-overlay" />
      
      {/* Floating Words Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {words.map((word, i) => (
          <FloatingWord 
            key={i} 
            word={word.text} 
            className={word.className} 
            delay={i * 0.5} 
          />
        ))}
      </div>

      {/* Glass Panel Content */}
      <div className="relative z-10 w-full px-4 flex justify-center">
        <LoginForm />
      </div>

      {/* Decorative Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2 
        }}
        className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"
      />
    </div>
  );
}
