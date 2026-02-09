import { LoginForm } from "@/components/LoginForm";
import { FloatingWord } from "@/components/FloatingWord";
import liquidBg from "@/assets/images/liquid-bg.png";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ArrowRight, User, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const words = [
    { text: "Learn", className: "top-[10%] left-[10%] text-6xl" },
    { text: "Speak", className: "top-[20%] right-[15%] text-7xl" },
    { text: "Fluent", className: "bottom-[15%] left-[20%] text-5xl" },
    { text: "Practice", className: "bottom-[25%] right-[10%] text-6xl" },
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-[#0a0a0a] p-4 font-sans">
      {/* Background Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${liquidBg})` }}
      />
      
      {/* Floating Words Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {words.map((word, i) => (
          <FloatingWord key={i} word={word.text} className={word.className} delay={i * 0.5} />
        ))}
      </div>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-4xl h-[500px] rounded-xl border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden bg-black flex"
      >
        {/* Animated Diagonal Overlay */}
        <motion.div 
          animate={{ 
            x: isLogin ? "0%" : "100%",
            skewX: isLogin ? -20 : 20,
          }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 z-20 w-1/2 h-full bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-900 pointer-events-none origin-bottom"
          style={{ 
            left: isLogin ? "50%" : "-50%",
            boxShadow: isLogin ? "-20px 0 50px rgba(0,0,0,0.5)" : "20px 0 50px rgba(0,0,0,0.5)"
          }}
        />

        {/* Form Side */}
        <div className={`w-1/2 h-full p-12 flex flex-col justify-center transition-all duration-700 ${isLogin ? 'order-1' : 'order-2'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-title" : "signup-title"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-white mb-2">{isLogin ? "Login" : "Sign Up"}</h1>
            </motion.div>
          </AnimatePresence>

          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400 text-xs uppercase tracking-widest">Username</FormLabel>
                    <FormControl>
                      <div className="relative border-b border-gray-700 focus-within:border-purple-500 transition-colors">
                        <User className="absolute right-0 top-1 text-gray-500" size={16} />
                        <Input 
                          {...field} 
                          className="bg-transparent border-none text-white placeholder:text-gray-600 px-0 h-10 rounded-none focus-visible:ring-0"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400 text-xs uppercase tracking-widest">Password</FormLabel>
                    <FormControl>
                      <div className="relative border-b border-gray-700 focus-within:border-purple-500 transition-colors">
                        <Lock className="absolute right-0 top-1 text-gray-500" size={16} />
                        <Input 
                          type="password"
                          {...field} 
                          className="bg-transparent border-none text-white placeholder:text-gray-600 px-0 h-10 rounded-none focus-visible:ring-0"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button 
                type="button"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-full h-12 text-lg font-semibold shadow-lg shadow-purple-500/20 transition-all hover:scale-105"
              >
                {isLogin ? "Login" : "Register"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              {isLogin ? "Dont have an account? " : "Already have an account? "}
              <span className="text-purple-400 font-bold">{isLogin ? "Sign Up" : "Login"}</span>
            </button>
          </div>
        </div>

        {/* Content Side */}
        <div className={`w-1/2 h-full p-12 flex flex-col justify-center items-center text-center relative z-30 transition-all duration-700 ${isLogin ? 'order-2' : 'order-1'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "welcome-back" : "welcome-new"}
              initial={{ opacity: 0, x: isLogin ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? -50 : 50 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                {isLogin ? "WELCOME BACK!" : "HELLO FRIEND!"}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed max-w-[250px]">
                {isLogin 
                  ? "To keep connected with us please login with your personal info"
                  : "Enter your personal details and start journey with us"}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
