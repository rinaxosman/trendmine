import { useState, useEffect } from 'react';
import { Mail, Lock, User, Rocket, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface SignUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultIsLogin?: boolean;
}

export function SignUpModal({ open, onOpenChange, defaultIsLogin = false }: SignUpModalProps) {
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(defaultIsLogin);

  // Sync with defaultIsLogin when modal opens
  useEffect(() => {
    if (open) {
      setIsLogin(defaultIsLogin);
    }
  }, [open, defaultIsLogin]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock submission - just show success toast
    toast({
      title: isLogin ? 'Welcome back!' : 'Account created!',
      description: isLogin
        ? 'You have successfully logged in.'
        : 'Check your email to verify your account.',
    });

    onOpenChange(false);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-card shadow-warm-lg border-border/50">
        {/* Header with gradient */}
        <div className="bg-gradient-accent px-6 py-8 text-center text-white">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
            {isLogin ? <LogIn className="w-6 h-6" /> : <Rocket className="w-6 h-6" />}
          </div>
          <DialogTitle className="text-2xl font-bold">
            {isLogin ? 'Welcome Back' : 'Join TrendMine'}
          </DialogTitle>
          <p className="text-white/80 mt-2 text-sm">
            {isLogin
              ? 'Log in to access your saved ideas'
              : 'Start generating business ideas today'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 bg-secondary/50 border-border focus:border-primary"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 bg-secondary/50 border-border focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 bg-secondary/50 border-border focus:border-primary"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-accent hover:opacity-90 text-white font-semibold py-5 rounded-xl mt-6"
          >
            {isLogin ? 'Log In' : 'Create Account'}
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <span className="font-medium text-primary">Sign up</span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span className="font-medium text-primary">Log in</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer note */}
        <div className="px-6 pb-6 pt-2">
          <p className="text-xs text-center text-muted-foreground">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
