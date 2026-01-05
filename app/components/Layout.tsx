'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe, FileText, Wrench, Info, Phone, Shield } from 'lucide-react';

const translations = {
  en: {
    home: 'Home',
    tools: 'PDF Tools',
    about: 'About Us',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    pdfMaker: 'PDF Maker',
    tagline: 'Create, Convert & Edit PDFs Online',
    language: 'Language'
  },
  hi: {
    home: 'होम',
    tools: 'पीडीएफ टूल्स',
    about: 'हमारे बारे में',
    contact: 'संपर्क',
    privacy: 'गोपनीयता नीति',
    terms: 'नियम और शर्तें',
    pdfMaker: 'पीडीएफ मेकर',
    tagline: 'ऑनलाइन पीडीएफ बनाएं, कन्वर्ट करें और एडिट करें',
    language: 'भाषा'
  }
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const t = translations[language];

  const navigation = [
    { name: t.home, href: '/', icon: FileText },
    { name: t.tools, href: '/tools', icon: Wrench },
    { name: t.about, href: '/about', icon: Info },
    { name: t.contact, href: '/contact', icon: Phone },
  ];

  const footerLinks = [
    { name: t.privacy, href: '/privacy' },
    { name: t.terms, href: '/terms' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">{t.pdfMaker}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Language Toggle & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center space-x-1"
              >
                <Globe className="h-4 w-4" />
                <span>{language === 'en' ? 'हिं' : 'En'}</span>
              </Button>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Tagline */}
      <div className="bg-blue-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg">{t.tagline}</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-6 w-6" />
                <span className="text-lg font-bold">{t.pdfMaker}</span>
              </div>
              <p className="text-gray-400">
                {t.tagline}
              </p>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security & Trust */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security & Trust</span>
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>• HTTPS Protected</li>
                <li>• Auto File Deletion</li>
                <li>• Privacy First</li>
                <li>• Secure Processing</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 {t.pdfMaker}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
