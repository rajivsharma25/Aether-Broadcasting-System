'use client';
// Authentication page with dynamic background and role-based redirect logic.
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Radio, Monitor, Bell, FileText, LayoutDashboard, Globe, Zap, Signal } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const floatingIcons = [
    { Icon: Radio, top: '10%', left: '10%', delay: 0, duration: 6, size: 45 },
    { Icon: Monitor, top: '20%', right: '15%', delay: 1, duration: 8, size: 60 },
    { Icon: Bell, bottom: '15%', left: '12%', delay: 2, duration: 7, size: 50 },
    { Icon: FileText, bottom: '25%', right: '10%', delay: 0.5, duration: 9, size: 40 },
    { Icon: LayoutDashboard, top: '40%', left: '5%', delay: 1.5, duration: 10, size: 70 },
    { Icon: Globe, bottom: '10%', right: '25%', delay: 2.5, duration: 12, size: 55 },
    { Icon: Zap, top: '15%', left: '40%', delay: 3, duration: 5, size: 35 },
    { Icon: Signal, bottom: '40%', right: '5%', delay: 0.8, duration: 7.5, size: 65 },
  ];

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    
    if (!password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      toast.success('Login successful!');
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 p-4 overflow-hidden">
      {/* Floating Background Icons */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-primary/10"
            style={{ 
              top: item.top, 
              left: item.left, 
              right: item.right, 
              bottom: item.bottom 
            }}
            animate={{ 
              y: [0, -25, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ 
              duration: item.duration, 
              repeat: Infinity, 
              delay: item.delay,
              ease: "easeInOut"
            }}
          >
            <item.Icon size={item.size} strokeWidth={1.5} />
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-md z-10">
        <Card className="p-8 border border-border shadow-none">
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <Radio className="size-6 text-white" />
              </div>
              <div className="flex flex-col items-start">
                <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase leading-none">Aether</h2>
                <span className="text-[11px] font-bold text-primary tracking-[0.2em] uppercase mt-1">Broadcast System</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Input
              label="Password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            
            <div className="pt-2">
              <Button type="submit" className="w-full py-3.5 font-bold" isLoading={isLoading}>
                Sign In
              </Button>
            </div>
          </form>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button
              onClick={() => { setEmail('teacher@test.com'); setPassword('password'); }}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 cursor-pointer"
            >
              Demo Teacher
            </button>
            <button
              onClick={() => { setEmail('principal@test.com'); setPassword('password'); }}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 cursor-pointer"
            >
              Demo Principal
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
