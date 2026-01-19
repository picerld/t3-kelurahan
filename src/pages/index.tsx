import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ModeToggle } from '@/components/ModeToggle';

const KreatopAuthForms = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (formData.email === '' || formData.password === '') {
      toast.error('Oops!', {
        description: 'Please fill in all fields',
      });
      return;
    }

    toast.success('Yeay!', {
      description: 'You are now logged in',
    });

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#07041B] flex items-center justify-center p-6">
      <Card className="w-full max-w-[1000px] bg-[#FFFFFF] dark:bg-[#110E24] dark:border-[#23203A] border-none rounded-[32px] overflow-hidden shadow-2xl py-0">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 min-h-[600px]">
            {/* Left Section - Visual/Branding */}
            <div className="bg-primary p-12 flex flex-col justify-between overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white">KREATOP</h1>
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-bold text-white leading-tight">
                    Welcome Back!
                  </h2>
                  <p className="text-lg text-white/80">
                    Track your growth, manage clients, and optimize your content performance with powerful analytics.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="relative z-10 grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <p className="text-2xl font-bold text-white">50K+</p>
                  <p className="text-sm text-white/70">Creators</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <p className="text-2xl font-bold text-white">1M+</p>
                  <p className="text-sm text-white/70">Analytics</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <p className="text-2xl font-bold text-white">99%</p>
                  <p className="text-sm text-white/70">Uptime</p>
                </div>
              </div>
            </div>

            {/* Right Section - Form */}
            <div className="p-12 flex flex-col justify-center bg-[#110E24]">
              <div className="w-full max-w-md mx-auto">
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-4xl font-bold text-white mb-2">
                      Sign In
                    </h3>
                    <p className="text-[#89869A]">
                      Enter your credentials to access your dashboard
                    </p>
                  </div>
                  <ModeToggle />
                </div>

                <div className="space-y-5">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white font-semibold">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#89869A]" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-12 h-12 bg-[#07041B] border-[#23203A] text-white placeholder:text-[#89869A] rounded-xl focus:border-[#312ECB] focus:ring-[#312ECB]"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white font-semibold">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#89869A]" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-12 pr-12 h-12 bg-[#07041B] border-[#23203A] text-white placeholder:text-[#89869A] rounded-xl focus:border-[#312ECB] focus:ring-[#312ECB]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#89869A] hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        className="border-[#23203A] data-[state=checked]:bg-[#312ECB] data-[state=checked]:border-[#312ECB]"
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm text-[#89869A] cursor-pointer"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-primary hover:text-primary/80 p-0 h-auto"
                    >
                      Forgot Password?
                    </Button>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmit}
                    className="w-full h-12 bg-primary hover:bg-primary/80 text-white font-semibold rounded-xl transition-all duration-300 group"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#23203A]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-[#110E24] text-[#89869A]">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-[#23203A] bg-[#07041B] hover:bg-[#23203A] text-white rounded-xl"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-[#23203A] bg-[#07041B] hover:bg-[#23203A] text-white rounded-xl"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-[#89869A]">
                      Don&apos;t have an account?
                      <Link href={"/register"}>
                        <Button
                          type="button"
                          variant="link"
                          className="text-[#312ECB] hover:text-[#732ECB] ml-1 p-0 h-auto font-semibold"
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KreatopAuthForms;