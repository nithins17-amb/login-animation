import { LoginForm } from "@/components/LoginForm";
import { FloatingWord } from "@/components/FloatingWord";
import liquidBg from "@/assets/images/liquid-bg.png";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ArrowRight, User, Lock, Mail, Phone, Github } from "lucide-react"; // Added Github import
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// Google Icon Component
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>Google</title>
    <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.013-1.147 8.027-3.267 2.053-2.08 2.627-5.12 2.627-7.467 0-.573-.053-1.093-.12-1.627h-10.53z" />
  </svg>
);

const step1Schema = z.object({
  fullName: z.string().min(2, "Full name required"),
  contact: z.string().min(5, "Email or phone number required"),
});

const step2Schema = step1Schema.extend({
  otp: z.string().length(4, "OTP must be 4 digits"),
});

const step3Schema = step2Schema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  username: z.string().min(3, "Username required"),
  password: z.string().min(6, "Password required"),
});

type AuthStep = "credentials" | "otp" | "account";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<AuthStep>("credentials");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Refs to avoid stale closures in resolver
  const stepRef = useRef(step);
  const isLoginRef = useRef(isLogin);
  stepRef.current = step;
  isLoginRef.current = isLogin;

  const getSchema = (currentStep: AuthStep, loginMode: boolean) => {
    if (loginMode) return loginSchema;
    switch (currentStep) {
      case "credentials":
        return step1Schema;
      case "otp":
        return step2Schema;
      case "account":
        return step3Schema;
      default:
        return step1Schema;
    }
  };

  const form = useForm<any>({
    resolver: (values, context, options) => {
      const schema = getSchema(stepRef.current, isLoginRef.current);
      return zodResolver(schema)(values, context, options);
    },
    defaultValues: {
      fullName: "",
      contact: "",
      otp: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        // Login Flow
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (res.ok) {
          const data = await res.json();
          toast({ title: "Success", description: `Welcome back, ${data.user.username}!` });
        } else {
          const error = await res.json();
          toast({ title: "Error", description: error.message || "Login failed", variant: "destructive" });
        }
      } else {
        // Signup Flow
        if (step === "credentials") {
          // Step 1: Send OTP
          const res = await fetch("/api/otp/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contact: values.contact }),
          });

          if (res.ok) {
            setStep("otp");
            toast({ title: "OTP Sent", description: "Check your console (dev mode)" });
          } else {
            toast({ title: "Error", description: "Failed to send OTP", variant: "destructive" });
          }

        } else if (step === "otp") {
          // Step 2: Verify OTP
          const res = await fetch("/api/otp/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contact: values.contact, otp: values.otp }),
          });
          const data = await res.json();

          if (data.success) {
            setStep("account");
          } else {
            toast({ title: "Error", description: "Invalid OTP", variant: "destructive" });
          }

        } else if (step === "account") {
          // Step 3: Create Account
          const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: values.username,
              password: values.password,
              fullName: values.fullName,
              email: values.contact.includes("@") ? values.contact : undefined,
              phoneNumber: !values.contact.includes("@") ? values.contact : undefined,
            }),
          });

          if (res.ok) {
            toast({ title: "Success", description: "Registration successful! Please login." });
            setIsLogin(true);
            setStep("credentials"); // Reset step for switching back to generic state
            form.reset();
          } else {
            const error = await res.json();
            toast({ title: "Error", description: error.message || "Registration failed", variant: "destructive" });
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const words = [
    { text: "Learn", className: "top-[10%] left-[10%] text-6xl" },
    { text: "Speak", className: "top-[20%] right-[15%] text-7xl" },
    { text: "Fluent", className: "bottom-[15%] left-[20%] text-5xl" },
    { text: "Practice", className: "bottom-[25%] right-[10%] text-6xl" },
  ];

  const getStepTitle = () => {
    if (isLogin) return "Welcome Back";
    return step === "otp" ? "Verify OTP" : step === "account" ? "Final Details" : "Create Account";
  };

  const getStepDescription = () => {
    if (isLogin) return "Enter your credentials to access your account";
    return step === "otp" ? "Enter the code sent to you" : step === "account" ? "Secure your account" : "Enter your details to register";
  };

  const handleSocialLogin = (provider: string) => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      `/api/auth/mock/${provider}`,
      `Login with ${provider}`,
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'oauth-success') {
        toast({
          title: "Login Successful",
          description: `Successfully authenticated with ${event.data.provider}`
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [toast]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-[#0a0a0a] p-4 font-sans">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${liquidBg})` }}
      />

      <div className="absolute inset-0 z-0 pointer-events-none">
        {words.map((word, i) => (
          <FloatingWord key={i} word={word.text} className={word.className} delay={i * 0.5} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-4xl min-h-[500px] rounded-xl border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden bg-black flex"
      >
        <motion.div
          animate={{ x: isLogin ? "0%" : "100%", skewX: isLogin ? -20 : 20 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 z-20 w-1/2 h-full bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-900 pointer-events-none origin-bottom"
          style={{
            left: isLogin ? "50%" : "-50%",
            boxShadow: isLogin ? "-20px 0 50px rgba(0,0,0,0.5)" : "20px 0 50px rgba(0,0,0,0.5)"
          }}
        />

        <div className={`w-1/2 h-full p-12 flex flex-col justify-center transition-all duration-700 ${isLogin ? 'order-1' : 'order-2'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${isLogin ? 'login' : 'signup'}-${step}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-white mb-2">
                {getStepTitle()}
              </h1>
              <p className="text-gray-400 text-sm">
                {getStepDescription()}
              </p>
            </motion.div>
          </AnimatePresence>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {isLogin ? (
                // Login Form
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <FormField control={form.control} name="username" render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-gray-400 text-xs uppercase tracking-widest">Username</FormLabel>
                      <FormControl>
                        <div className="relative border-b border-gray-700 focus-within:border-purple-500 transition-colors">
                          <User className="absolute right-0 top-1 text-gray-500" size={16} />
                          <Input {...field} className="bg-transparent border-none text-white px-0 h-10 rounded-none focus-visible:ring-0" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-400 text-xs uppercase tracking-widest">Password</FormLabel>
                      <FormControl>
                        <div className="relative border-b border-gray-700 focus-within:border-purple-500 transition-colors">
                          <Lock className="absolute right-0 top-1 text-gray-500" size={16} />
                          <Input type="password" {...field} className="bg-transparent border-none text-white px-0 h-10 rounded-none focus-visible:ring-0" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </motion.div>
              ) : (
                // Sign Up Flow
                <>
                  {/* Step 1: Credentials */}
                  <motion.div className={step !== "credentials" ? "hidden" : ""}>
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-gray-400 text-xs uppercase tracking-widest">Full Name</FormLabel>
                        <FormControl>
                          <div className="relative border-b border-gray-700 focus-within:border-purple-500 transition-colors">
                            <User className="absolute right-0 top-1 text-gray-500" size={16} />
                            <Input {...field} placeholder="Enter your name" className="bg-transparent border-none text-white px-0 h-10 rounded-none focus-visible:ring-0" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="contact" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400 text-xs uppercase tracking-widest">Email or Phone</FormLabel>
                        <FormControl>
                          <div className="relative border-b border-gray-700 focus-within:border-purple-500 transition-colors">
                            <Mail className="absolute right-0 top-1 text-gray-500" size={16} />
                            <Input {...field} placeholder="email@example.com" className="bg-transparent border-none text-white px-0 h-10 rounded-none focus-visible:ring-0" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </motion.div>

                  {/* Step 2: OTP */}
                  {step === "otp" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <FormField control={form.control} name="otp" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400 text-xs uppercase tracking-widest">OTP Code</FormLabel>
                          <FormControl>
                            <div className="relative border-b border-gray-700 focus-within:border-purple-500 transition-colors">
                              <Lock className="absolute right-0 top-1 text-gray-500" size={16} />
                              <Input {...field} maxLength={4} placeholder="####" className="bg-transparent border-none text-white px-0 h-10 rounded-none focus-visible:ring-0 tracking-[1em] text-center" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </motion.div>
                  )}

                  {/* Step 3: Account */}
                  {step === "account" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <FormField control={form.control} name="username" render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel className="text-gray-400 text-xs uppercase tracking-widest">Username</FormLabel>
                          <FormControl>
                            <div className="relative border-b border-gray-700 focus-within:border-purple-500 transition-colors">
                              <User className="absolute right-0 top-1 text-gray-500" size={16} />
                              <Input {...field} className="bg-transparent border-none text-white px-0 h-10 rounded-none focus-visible:ring-0" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400 text-xs uppercase tracking-widest">Password</FormLabel>
                          <FormControl>
                            <div className="relative border-b border-gray-700 focus-within:border-purple-500 transition-colors">
                              <Lock className="absolute right-0 top-1 text-gray-500" size={16} />
                              <Input type="password" {...field} className="bg-transparent border-none text-white px-0 h-10 rounded-none focus-visible:ring-0" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </motion.div>
                  )}
                </>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-full h-12 text-lg font-semibold shadow-lg shadow-purple-500/20 transition-all hover:scale-105"
              >
                {isLoading ? "Processing..." : (
                  isLogin ? "Login" :
                    step === "credentials" ? "Next" :
                      step === "otp" ? "Verify" :
                        "Register"
                )}
              </Button>
            </form>
          </Form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0a] px-2 text-gray-500 font-medium tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="bg-transparent border-gray-800 text-white hover:bg-gray-800 hover:text-white hover:border-gray-700 transition-all duration-300"
            >
              <GoogleIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => handleSocialLogin('github')}
              className="bg-transparent border-gray-800 text-white hover:bg-gray-800 hover:text-white hover:border-gray-700 transition-all duration-300"
            >
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setStep("credentials");
                form.reset();
              }}
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              {isLogin ? "Dont have an account? " : "Already have an account? "}
              <span className="text-purple-400 font-bold">{isLogin ? "Sign Up" : "Login"}</span>
            </button>
          </div>
        </div>

        <div className={`w-1/2 h-full p-12 flex flex-col items-center text-center relative z-30 transition-all duration-700 ${isLogin ? 'order-2' : 'order-1'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "welcome-back" : "welcome-new"}
              initial={{ opacity: 0, x: isLogin ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? -50 : 50 }}
              transition={{ duration: 0.6 }}
              className="mt-32"
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                {isLogin ? "WELCOME BACK!" : "HELLO FRIEND!"}
              </h2>
              <p className="text-gray-300 text-base leading-relaxed max-w-[280px] mb-8">
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
