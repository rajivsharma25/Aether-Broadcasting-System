'use client';
import { Radio, Globe, Link as LinkIcon, MessageSquare } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Radio className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tighter text-foreground uppercase leading-none">Aether</span>
                <span className="text-[8px] font-bold text-primary tracking-[0.2em] mt-1 leading-none uppercase">Broadcast System</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Empowering education through seamless content broadcasting and real-time announcement management.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageSquare className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <LinkIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Live View</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Scheduling</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Approvals</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-muted-foreground font-medium">
            © {new Date().getFullYear()} Aether Broadcasting System. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-xs text-muted-foreground font-medium">
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              System Online
            </div>
            <span>v1.2.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
