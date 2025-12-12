import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { authRoutes } from '@/constants/ClientRoute';
import { useAuth } from '@/providers/AuthProvider';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, BarChart3, Bell, BookOpen, Brain, Briefcase, Building2, ChevronDown, FileText, Heart, Lightbulb, Menu, MonitorPlay, Rocket, Target, Users, Video, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
// using public assets for Next.js Image

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveMenu, setMobileActiveMenu] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, userDetails, userRoutes, logoutUser } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  type IconComponent = ComponentType<{ className?: string }>;
  type MenuItem = { name: string; desc: string; href: string; icon?: IconComponent };
  type MenuSection = { title: string; items: MenuItem[] };
  type MenuData = { title: string; sections: MenuSection[] };

  const featuresMenu: MenuData = {
    title: 'Features',
    sections: [
      {
        title: 'Core Features',
        items: [
          { icon: Target, name: 'Signal Detection', desc: 'Real-time buying signals', href: '/signals' },
          { icon: Brain, name: 'AI Analysis', desc: 'Contextual intelligence', href: '/signal-detection' },
          { icon: Bell, name: 'Smart Alerts', desc: 'Instant notifications', href: '/features' },
        ],
      },
      {
        title: 'Tools',
        items: [
          { icon: BarChart3, name: 'ROI Calculator', desc: 'Measure your returns', href: '/tools/roi-calculator' },
          { icon: Zap, name: 'Chrome Extension', desc: 'Browser integration', href: '/tools/chrome-extension' },
        ],
      },
    ],
  };

  const solutionsMenu: MenuData = {
    title: 'Solutions',
    sections: [
      {
        title: 'Integrations',
        items: [
          { icon: Building2, name: 'CRM Sync', desc: 'Connect your CRM', href: '/tools/crm-sync' },
          { icon: Users, name: 'All Integrations', desc: 'Salesforce, HubSpot & more', href: '/integrations' },
          { icon: Award, name: 'Lead Finder', desc: 'Discover prospects', href: '/tools/lead-finder' },
        ],
      },
      {
        title: 'Company',
        items: [
          { name: 'About Us', desc: 'Our mission & story', href: '/company/about' },
          { name: 'Partners', desc: 'Partner program', href: '/company/partners' },
          { name: 'Careers', desc: 'Join our team', href: '/company/careers' },
        ],
      },
    ],
  };

  const useCaseMenu: MenuData = {
    title: 'Use Case',
    sections: [
      {
        title: 'By Role',
        items: [
          { icon: Briefcase, name: 'For Business Owners', desc: 'Drive growth with insights', href: '/business-owners' },
          { icon: Users, name: 'For Agencies', desc: 'Create data-led campaigns', href: '/agencies' },
          { icon: Rocket, name: 'For Startups', desc: 'Accelerate traction', href: '/startups' },
          { icon: Lightbulb, name: 'For Product Teams', desc: 'Inform product decisions', href: '/product-teams' },
          { icon: MonitorPlay, name: 'For Media & Entertainment', desc: 'Engage audiences', href: '/media-and-entertainment' },
          { icon: Heart, name: 'For Non-Profits', desc: 'Do good with insights', href: '/nonprofits' },
        ],
      },
    ],
  };

  const resourcesMenu: MenuData = {
    title: 'Resources',
    sections: [
      {
        title: 'Learn',
        items: [
          { icon: FileText, name: 'Blog', desc: 'Latest insights & tips', href: '/resources/blog' },
          { icon: BookOpen, name: 'Guides', desc: 'In-depth tutorials', href: '/resources/guides' },
          { icon: Video, name: 'Case Studies', desc: 'Success stories', href: '/resources/case-studies' },
        ],
      },
      {
        title: 'Support',
        items: [
          { name: 'Help Center', desc: 'FAQs & support', href: '/resources/help-center' },
          { name: 'Contact', desc: 'Get in touch', href: '/company/contact' },
          { name: 'Security', desc: 'Data protection', href: '/legal/security' },
        ],
      },
    ],
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-sm' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
              <Image src="/assets/images/landing/logo.png" alt="URI Logo" width={120} height={40} className="h-8 sm:h-10 w-auto" />
            </motion.div>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {/* Features Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveMenu('features')} onMouseLeave={() => setActiveMenu(null)}>
              <button className="flex items-center gap-1 text-foreground/70 hover:text-foreground transition-colors font-medium">
                Features
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {activeMenu === 'features' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] z-50"
                  >
                    <div className="bg-background border border-border rounded-2xl shadow-strong p-8">
                      <div className="grid grid-cols-2 gap-8">
                        {featuresMenu.sections.map((section, idx) => (
                          <div key={idx}>
                            <h3 className="text-sm font-bold text-primary mb-4">{section.title}</h3>
                            <div className="space-y-3">
                              {section.items.map((item, itemIdx) => (
                                <Link
                                  key={itemIdx}
                                  href={item.href || '#'}
                                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                                  onClick={() => setActiveMenu(null)}
                                >
                                  {item.icon && (
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                      <item.icon className="w-5 h-5 text-primary" />
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-semibold text-sm mb-1">{item.name}</div>
                                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Use Case Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveMenu('usecase')} onMouseLeave={() => setActiveMenu(null)}>
              <button className="flex items-center gap-1 text-foreground/70 hover:text-foreground transition-colors font-medium">
                Use Case
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {activeMenu === 'usecase' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[400px] z-50"
                  >
                    <div className="bg-background border border-border rounded-2xl shadow-strong p-8">
                      {useCaseMenu.sections.map((section, idx) => (
                        <div key={idx}>
                          <h3 className="text-sm font-bold text-primary mb-4">{section.title}</h3>
                          <div className="space-y-3">
                            {section.items.map((item, itemIdx) => (
                              <Link key={itemIdx} href={item.href || '#'} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors group" onClick={() => setActiveMenu(null)}>
                                {item.icon && (
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <item.icon className="w-5 h-5 text-primary" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-semibold text-sm mb-1">{item.name}</div>
                                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resources Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveMenu('resources')} onMouseLeave={() => setActiveMenu(null)}>
              <button className="flex items-center gap-1 text-foreground/70 hover:text-foreground transition-colors font-medium">
                Resources
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {activeMenu === 'resources' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] z-50"
                  >
                    <div className="bg-background border border-border rounded-2xl shadow-strong p-8">
                      <div className="grid grid-cols-2 gap-8">
                        {resourcesMenu.sections.map((section, idx) => (
                          <div key={idx}>
                            <h3 className="text-sm font-bold text-primary mb-4">{section.title}</h3>
                            <div className="space-y-3">
                              {section.items.map((item, itemIdx) => (
                                <Link
                                  key={itemIdx}
                                  href={item.href || '#'}
                                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                                  onClick={() => setActiveMenu(null)}
                                >
                                  {item.icon && (
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                      <item.icon className="w-5 h-5 text-primary" />
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-semibold text-sm mb-1">{item.name}</div>
                                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/pricing" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
              Pricing
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {!isAuthenticated ? (
              <>
                <Link href={authRoutes.login} className="text-foreground/70 hover:text-foreground transition-colors font-medium hidden lg:block text-sm">
                  Login
                </Link>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold rounded-xl shadow-soft text-xs sm:text-sm px-3 sm:px-4 py-2 hidden sm:block"
                  onClick={() => router.push(authRoutes.login)}
                >
                  Start Free
                </Button>
              </>
            ) : (
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold rounded-xl shadow-soft text-xs sm:text-sm px-3 sm:px-4 py-2"
                onClick={() => router.push('/dashboard')}
              >
                Dashboard
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] overflow-y-auto">
                <div className="flex flex-col gap-6 mt-8">
                  {/* Features Mobile */}
                  <div>
                    <button onClick={() => setMobileActiveMenu(mobileActiveMenu === 'features' ? null : 'features')} className="flex items-center justify-between w-full text-lg font-semibold mb-3">
                      Features
                      <ChevronDown className={`w-5 h-5 transition-transform ${mobileActiveMenu === 'features' ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {mobileActiveMenu === 'features' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          {featuresMenu.sections.map((section, idx) => (
                            <div key={idx} className="mb-4">
                              <h4 className="text-sm font-bold text-primary mb-2">{section.title}</h4>
                              <div className="space-y-2">
                                {section.items.map((item, itemIdx) => (
                                  <Link
                                    key={itemIdx}
                                    href={item.href || '#'}
                                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {item.icon && (
                                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-4 h-4 text-primary" />
                                      </div>
                                    )}
                                    <div>
                                      <div className="font-semibold text-sm">{item.name}</div>
                                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Use Case Mobile */}
                  <div>
                    <button onClick={() => setMobileActiveMenu(mobileActiveMenu === 'usecase' ? null : 'usecase')} className="flex items-center justify-between w-full text-lg font-semibold mb-3">
                      Use Case
                      <ChevronDown className={`w-5 h-5 transition-transform ${mobileActiveMenu === 'usecase' ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {mobileActiveMenu === 'usecase' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          {useCaseMenu.sections.map((section, idx) => (
                            <div key={idx} className="mb-4">
                              <h4 className="text-sm font-bold text-primary mb-2">{section.title}</h4>
                              <div className="space-y-2">
                                {section.items.map((item, itemIdx) => (
                                  <Link
                                    key={itemIdx}
                                    href={item.href || '#'}
                                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {item.icon && (
                                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-4 h-4 text-primary" />
                                      </div>
                                    )}
                                    <div>
                                      <div className="font-semibold text-sm">{item.name}</div>
                                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Resources Mobile */}
                  <div>
                    <button onClick={() => setMobileActiveMenu(mobileActiveMenu === 'resources' ? null : 'resources')} className="flex items-center justify-between w-full text-lg font-semibold mb-3">
                      Resources
                      <ChevronDown className={`w-5 h-5 transition-transform ${mobileActiveMenu === 'resources' ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {mobileActiveMenu === 'resources' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          {resourcesMenu.sections.map((section, idx) => (
                            <div key={idx} className="mb-4">
                              <h4 className="text-sm font-bold text-primary mb-2">{section.title}</h4>
                              <div className="space-y-2">
                                {section.items.map((item, itemIdx) => (
                                  <Link
                                    key={itemIdx}
                                    href={item.href || '#'}
                                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {item.icon && (
                                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-4 h-4 text-primary" />
                                      </div>
                                    )}
                                    <div>
                                      <div className="font-semibold text-sm">{item.name}</div>
                                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Pricing Mobile */}
                  <Link href="/pricing" className="text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>
                    Pricing
                  </Link>

                  {/* Mobile Actions */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-border">
                    {!isAuthenticated ? (
                      <>
                        <Link href={authRoutes.login} className="text-center py-2 text-foreground/70 hover:text-foreground transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                          Login
                        </Link>
                        <Button
                          className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold rounded-xl shadow-soft w-full"
                          onClick={() => {
                            router.push(authRoutes.login);
                            setMobileMenuOpen(false);
                          }}
                        >
                          Start Free
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/dashboard" className="text-center py-2 font-medium" onClick={() => setMobileMenuOpen(false)}>
                          Dashboard
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
