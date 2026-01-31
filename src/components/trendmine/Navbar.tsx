import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onSignUpClick: () => void;
  onLogInClick: () => void;
}

export function Navbar({ onSignUpClick, onLogInClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            {/* Placeholder for logo - will be replaced */}
            <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-semibold text-lg text-foreground">TrendMine</span>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogInClick}
              className="text-muted-foreground"
            >
              Log In
            </Button>
            <Button
              size="sm"
              onClick={onSignUpClick}
              className="bg-gradient-accent hover:opacity-90 text-white font-medium rounded-lg"
            >
              Sign Up Free
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogInClick();
                }}
                className="justify-start text-muted-foreground"
              >
                Log In
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignUpClick();
                }}
                className="bg-gradient-accent hover:opacity-90 text-white font-medium rounded-lg"
              >
                Sign Up Free
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
