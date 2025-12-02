import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { authRoutes, dashboardRoutes } from '@/constants/ClientRoute';
import { useAuth } from '@/providers/AuthProvider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { Avatar, Menu as MuiMenu, MenuItem as MuiMenuItem } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Award, BarChart3, Bell, BookOpen, Brain, Building2, ChevronDown, FileText, Menu, Target, Users, Video, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveMenu, setMobileActiveMenu] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated, logoutUser, userDetails } = useAuth();
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  type MenuItem = { name: string; desc: string; icon?: LucideIcon; href?: string };
  type MenuSection = { title: string; items: MenuItem[] };

  const featuresMenu: { title: string; sections: MenuSection[] } = {
    title: 'Features',
    sections: [
      {
        title: 'Core Features',
        items: [
          { icon: Target, name: 'Signal Detection', desc: 'Real-time buying signals', href: '/signal-detection' },
          { icon: Brain, name: 'AI Analysis', desc: 'Contextual intelligence', href: '#' },
          { icon: Bell, name: 'Smart Alerts', desc: 'Instant notifications', href: '#' },
        ],
      },
      {
        title: 'Intelligence',
        items: [
          { icon: BarChart3, name: 'Analytics', desc: 'Deep insights & trends' },
          { icon: Zap, name: 'Automation', desc: 'Automated outreach' },
        ],
      },
    ],
  };

  const solutionsMenu: { title: string; sections: MenuSection[] } = {
    title: 'Solutions',
    sections: [
      {
        title: 'By Company Type',
        items: [
          { icon: Building2, name: 'Enterprise', desc: 'Large organizations' },
          { icon: Users, name: 'SMB', desc: 'Small & medium business' },
          { icon: Award, name: 'Startups', desc: 'Growing companies' },
        ],
      },
      {
        title: 'By Industry',
        items: [
          { name: 'Technology', desc: 'SaaS & tech companies' },
          { name: 'Real Estate', desc: 'Property & logistics' },
          { name: 'Professional Services', desc: 'Consulting & agencies' },
        ],
      },
    ],
  };

  const resourcesMenu: { title: string; sections: MenuSection[] } = {
    title: 'Resources',
    sections: [
      {
        title: 'Learn',
        items: [
          { icon: FileText, name: 'Blog', desc: 'Latest insights & tips' },
          { icon: BookOpen, name: 'Guides', desc: 'In-depth tutorials' },
          { icon: Video, name: 'Webinars', desc: 'Live & recorded sessions' },
        ],
      },
      {
        title: 'Support',
        items: [
          { name: 'Documentation', desc: 'Technical resources' },
          { name: 'Case Studies', desc: 'Success stories' },
          { name: 'Help Center', desc: 'FAQs & support' },
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
              <img src="/assets/images/landing/logo.png" alt="URI Logo" className="h-8 sm:h-10 w-auto" />
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

            {/* Solutions Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveMenu('solutions')} onMouseLeave={() => setActiveMenu(null)}>
              <button className="flex items-center gap-1 text-foreground/70 hover:text-foreground transition-colors font-medium">
                Solutions
                <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {activeMenu === 'solutions' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] z-50"
                  >
                    <div className="bg-background border border-border rounded-2xl shadow-strong p-8">
                      <div className="grid grid-cols-2 gap-8">
                        {solutionsMenu.sections.map((section, idx) => (
                          <div key={idx}>
                            <h3 className="text-sm font-bold text-primary mb-4">{section.title}</h3>
                            <div className="space-y-3">
                              {section.items.map((item, itemIdx) => (
                                <a key={itemIdx} href="#" className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                                  {item.icon && (
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                      <item.icon className="w-5 h-5 text-primary" />
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-semibold text-sm mb-1">{item.name}</div>
                                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                                  </div>
                                </a>
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
                                <a key={itemIdx} href="#" className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                                  {item.icon && (
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                      <item.icon className="w-5 h-5 text-primary" />
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-semibold text-sm mb-1">{item.name}</div>
                                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                                  </div>
                                </a>
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
            {!isAuthenticated && (
              <button className="text-foreground/70 hover:text-foreground transition-colors font-medium hidden lg:block text-sm" onClick={() => router.push(authRoutes.login)}>
                Login
              </button>
            )}
            {isAuthenticated ? (
              <>
                <div onClick={(e) => setProfileAnchor(e.currentTarget)} className="hidden sm:flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-accent">
                  <Avatar sx={{ width: 36, height: 36, bgcolor: '#CD1B78', fontSize: '14px', fontWeight: 600 }}>{(userDetails?.firstName?.[0] || '') + (userDetails?.lastName?.[0] || '')}</Avatar>
                  <span className="text-sm font-medium text-foreground">{userDetails?.firstName}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
                <MuiMenu
                  anchorEl={profileAnchor}
                  open={Boolean(profileAnchor)}
                  onClose={() => setProfileAnchor(null)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  sx={{
                    '& .MuiPaper-root': {
                      boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      padding: '10px',
                      minWidth: '200px',
                      mt: 1,
                    },
                  }}
                >
                  <MuiMenuItem
                    onClick={() => {
                      router.push(dashboardRoutes.dashboardClients);
                      setProfileAnchor(null);
                    }}
                    sx={{
                      color: '#111',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      '&:hover': { backgroundColor: '#f5f5f5' },
                    }}
                  >
                    <DashboardIcon sx={{ color: '#CD1B78', fontSize: '20px' }} />
                    Dashboard
                  </MuiMenuItem>
                  <MuiMenuItem
                    onClick={() => {
                      router.push('/profile');
                      setProfileAnchor(null);
                    }}
                    sx={{
                      color: '#111',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      '&:hover': { backgroundColor: '#f5f5f5' },
                    }}
                  >
                    <PersonIcon sx={{ color: '#CD1B78', fontSize: '20px' }} />
                    Profile
                  </MuiMenuItem>
                  <MuiMenuItem
                    onClick={() => {
                      router.push('/settings');
                      setProfileAnchor(null);
                    }}
                    sx={{
                      color: '#111',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      '&:hover': { backgroundColor: '#f5f5f5' },
                    }}
                  >
                    <SettingsIcon sx={{ color: '#CD1B78', fontSize: '20px' }} />
                    Settings
                  </MuiMenuItem>
                  <MuiMenuItem
                    onClick={() => {
                      logoutUser();
                      setProfileAnchor(null);
                    }}
                    sx={{
                      color: '#CD1B78',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      '&:hover': { backgroundColor: '#fff5f9' },
                    }}
                  >
                    <LogoutIcon sx={{ color: '#CD1B78', fontSize: '20px' }} />
                    Logout
                  </MuiMenuItem>
                </MuiMenu>
              </>
            ) : (
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl shadow-soft text-xs sm:text-sm px-3 sm:px-4 py-2 hidden sm:block"
                onClick={() => router.push(authRoutes.signupAs)}
              >
                Start Free
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

                  {/* Solutions Mobile */}
                  <div>
                    <button onClick={() => setMobileActiveMenu(mobileActiveMenu === 'solutions' ? null : 'solutions')} className="flex items-center justify-between w-full text-lg font-semibold mb-3">
                      Solutions
                      <ChevronDown className={`w-5 h-5 transition-transform ${mobileActiveMenu === 'solutions' ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {mobileActiveMenu === 'solutions' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          {solutionsMenu.sections.map((section, idx) => (
                            <div key={idx} className="mb-4">
                              <h4 className="text-sm font-bold text-primary mb-2">{section.title}</h4>
                              <div className="space-y-2">
                                {section.items.map((item, itemIdx) => (
                                  <a key={itemIdx} href="#" className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                    {item.icon && (
                                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-4 h-4 text-primary" />
                                      </div>
                                    )}
                                    <div>
                                      <div className="font-semibold text-sm">{item.name}</div>
                                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                                    </div>
                                  </a>
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
                                  <a key={itemIdx} href="#" className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                    {item.icon && (
                                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-4 h-4 text-primary" />
                                      </div>
                                    )}
                                    <div>
                                      <div className="font-semibold text-sm">{item.name}</div>
                                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                                    </div>
                                  </a>
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
                      <button
                        className="text-center py-2 text-foreground/70 hover:text-foreground transition-colors font-medium"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          router.push(authRoutes.login);
                        }}
                      >
                        Login
                      </button>
                    ) : null}
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold rounded-xl shadow-soft w-full"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        isAuthenticated ? logoutUser() : router.push(authRoutes.signupAs);
                      }}
                    >
                      {isAuthenticated ? 'Logout' : 'Start Free'}
                    </Button>
                  </div>

                  {isAuthenticated ? (
                    <div className="mt-6 border-t pt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar sx={{ width: 40, height: 40, bgcolor: '#CD1B78', fontSize: '16px', fontWeight: 600 }}>
                          {(userDetails?.firstName?.[0] || '') + (userDetails?.lastName?.[0] || '')}
                        </Avatar>
                        <div>
                          <div className="text-sm font-semibold">
                            {userDetails?.firstName} {userDetails?.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">{userDetails?.email}</div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Button
                          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl shadow-soft text-sm py-2"
                          onClick={() => {
                            router.push(dashboardRoutes.dashboardClients);
                            setMobileMenuOpen(false);
                          }}
                        >
                          Go to Dashboard
                        </Button>
                        <Button
                          variant="outline"
                          className="font-semibold rounded-xl text-primary border-primary hover:bg-primary/10 text-sm py-2"
                          onClick={() => {
                            logoutUser();
                            setMobileMenuOpen(false);
                          }}
                        >
                          Logout
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 border-t pt-6 flex flex-col gap-3">
                      <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl shadow-soft text-sm py-2"
                        onClick={() => {
                          router.push(authRoutes.login);
                          setMobileMenuOpen(false);
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        variant="outline"
                        className="font-semibold rounded-xl text-primary border-primary hover:bg-primary/10 text-sm py-2"
                        onClick={() => {
                          router.push(authRoutes.signupAs);
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
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
