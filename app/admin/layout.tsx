'use client';

import { SITE_NAME, LOGO_PATH } from '@/lib/site-brand';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { OFFICE_FEATURES, canOpenPath, clearOfficeSession, homePathFor, readOfficeEmail, resolveAccess } from '@/lib/admin-team';

const ADMIN_ROUTES = [...OFFICE_FEATURES.map((feature) => feature.path), '/admin/team'];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [officeAccess, setOfficeAccess] = useState<string[] | 'owner'>('owner');

  // Module Filtering State
  const [enabledModules, setEnabledModules] = useState<string[]>([]);
  const warmedRoutes = useRef(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }

    if (isAuthenticated) return;

    let cancelled = false;

    async function checkAuth() {
      if (document.cookie.split('; ').includes('ot-admin-demo=1') || !isSupabaseConfigured()) {
        if (cancelled) return;
        const person = resolveAccess(readOfficeEmail());
        setUser({ email: person.email, name: person.name });
        setUserRole(person.role);
        setOfficeAccess(person.access);
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;

      if (!session) {
        router.push('/admin/login');
        return;
      }

      // Ensure auth cookie is set (in case user already had a session from before)
      document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;

      // Check user role from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile) {
        console.error('Failed to fetch user profile');
        router.push('/admin/login');
        return;
      }

      // Only allow admin and staff roles
      if (profile.role !== 'admin' && profile.role !== 'staff') {
        console.warn('User does not have admin/staff role');
        document.cookie = 'sb-access-token=; path=/; max-age=0; SameSite=Lax; Secure';
        await supabase.auth.signOut();
        router.push('/admin/login?error=unauthorized');
        return;
      }

      setUser(session.user);
      setUserRole(profile.role);
      setIsAuthenticated(true);
      setIsLoading(false);
    }

    checkAuth();

    if (!isSupabaseConfigured()) {
      return () => {
        cancelled = true;
      };
    }

    // Keep cookie in sync when session refreshes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' && session) {
        document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
      }
      if (event === 'SIGNED_OUT') {
        document.cookie = 'sb-access-token=; path=/; max-age=0; SameSite=Lax; Secure';
        document.cookie = 'sb-refresh-token=; path=/; max-age=0; SameSite=Lax; Secure';
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [pathname, router, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || warmedRoutes.current) return;
    warmedRoutes.current = true;
    const paths = ADMIN_ROUTES.filter((path) => path !== pathname);
    if (process.env.NODE_ENV === 'development') {
      // Dev skips link prefetch, so a quiet request is what compiles the page before the click.
      paths.forEach((path) => {
        fetch(path, { credentials: 'same-origin' }).catch(() => {});
      });
      return;
    }
    paths.forEach((path) => router.prefetch(path));
  }, [isAuthenticated, pathname, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  // Fetch Modules Effect
  useEffect(() => {
    async function fetchModules() {
      try {
        const { data, error } = await supabase.from('store_modules').select('id, enabled');
        if (error) {
          console.warn('Error fetching modules:', error);
          return;
        }
        if (data) {
          setEnabledModules(data.filter((m: any) => m.enabled).map((m: any) => m.id));
        }
      } catch (err) {
        console.warn('Fetch modules failed:', err);
      }
    }
    fetchModules();
  }, []);

  // Screen size check for initial state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // Only set to false if it's currently true? 
        // Actually, let's just default to open on desktop, closed on mobile on mount only
      }
    };

    // Set initial state based on width
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }

    // Optional: Auto-close on resize to mobile? For now, leave as is.
  }, []);

  const handleLogout = async () => {
    // Clear auth cookies set during login
    clearOfficeSession();
    document.cookie = 'sb-access-token=; path=/; max-age=0; SameSite=Lax; Secure';
    document.cookie = 'sb-refresh-token=; path=/; max-age=0; SameSite=Lax; Secure';
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading Admin...</div>;
  }

  const visibleMenuItems = OFFICE_FEATURES.filter((item) => {
    if (item.moduleId && !enabledModules.includes(item.moduleId)) return false;
    if (officeAccess === 'owner') return true;
    return officeAccess.includes(item.id);
  });

  // Special layout for Login Page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="admin-office min-h-screen text-[#2a241e]">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#2a241e]/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`admin-rail fixed top-0 left-0 z-40 h-screen border-r border-[#efe8dc]/10 transition-all duration-300
          w-64
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isSidebarOpen ? 'lg:w-64' : 'lg:w-0 lg:overflow-hidden'}
          lg:translate-x-0
        `}
      >
        <div className="flex h-full flex-col px-4 py-6">
          <Link href={homePathFor(officeAccess)} className="mb-6 flex items-center justify-between gap-3 px-2">
            <img src={LOGO_PATH} alt={SITE_NAME} className="h-9 w-auto max-w-[150px] object-contain" />
          </Link>
          <p className="mb-4 px-3 text-[10px] uppercase tracking-[0.28em] text-[#c4a15a]">The office</p>

          <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            {visibleMenuItems.map((item) => {
              const isActive = item.exact ? pathname === item.path : pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${isActive
                    ? 'border border-[#c4a15a]/50 bg-[#c4a15a]/15 font-medium text-[#c4a15a]'
                    : 'border border-transparent text-[#efe8dc]/75 hover:bg-white/10 hover:text-[#efe8dc]'
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <i className={`${item.icon} text-lg`}></i>
                    <span>{item.title}</span>
                  </span>
                </Link>
              );
            })}
            {officeAccess === 'owner' && (
              <Link
                href="/admin/team"
                onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${pathname.startsWith('/admin/team')
                  ? 'border border-[#c4a15a]/50 bg-[#c4a15a]/15 font-medium text-[#c4a15a]'
                  : 'border border-transparent text-[#efe8dc]/75 hover:bg-white/10 hover:text-[#efe8dc]'
                  }`}
              >
                <span className="flex items-center gap-3">
                  <i className="ri-team-line text-lg"></i>
                  <span>Team</span>
                </span>
              </Link>
            )}
          </nav>

          <div className="mt-4 border-t border-[#efe8dc]/15 pt-4">
            <Link
              href="/"
              target="_blank"
              onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#efe8dc]/75 hover:bg-white/10 hover:text-[#c4a15a]"
            >
              <i className="ri-external-link-line text-lg"></i>
              <span>View store</span>
            </Link>
          </div>
        </div>
      </aside>

      <div className={`transition-all duration-300 ml-0 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <header className="admin-glass sticky top-0 z-30 border-b border-[#e4d8c4]">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4d8c4] text-[#2a241e] hover:border-[#c4a15a]"
              >
                <i className={`${isSidebarOpen ? 'ri-menu-fold-line' : 'ri-menu-unfold-line'} text-xl`}></i>
              </button>
              <div className="hidden sm:block">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#6b6156]">Opulence Ties</p>
                <p className="text-sm text-[#2a241e]">{officeAccess === 'owner' ? "Owner's desk" : userRole || 'Team'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4d8c4] text-[#2a241e] hover:border-[#c4a15a]">
                <i className="ri-notification-3-line text-xl"></i>
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#c4a15a]"></span>
              </button>

              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-xl border border-[#e4d8c4] bg-[#f7f3eb] px-2 py-1.5 hover:border-[#c4a15a]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3f342c] text-sm font-semibold text-[#efe8dc]">
                    {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden text-left md:block">
                    <p className="text-sm font-medium capitalize text-[#2a241e]">{userRole || 'Admin'}</p>
                    <p className="max-w-[140px] truncate text-[11px] text-[#6b6156]">{user?.email}</p>
                  </div>
                  <i className="ri-arrow-down-s-line text-[#6b6156]"></i>
                </button>

                {showUserMenu && (
                  <div className="admin-glass absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-[#e4d8c4]">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#2a241e] hover:bg-[#c4a15a]/10"
                    >
                      <i className="ri-logout-box-line"></i>
                      <span>Leave the office</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          {canOpenPath(pathname, officeAccess) ? children : (
            <div className="admin-panel mx-auto max-w-lg rounded-2xl p-8 text-center">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#c4a15a]">Closed</p>
              <h1 className="mt-2 text-2xl font-bold text-[#2a241e]">This part of the office is not open for you.</h1>
              <p className="mt-2 text-sm text-[#6b6156]">The owner chooses what each person can use.</p>
              <Link href={homePathFor(officeAccess)} className="mt-6 inline-block rounded-xl bg-[#c4a15a] px-5 py-3 text-sm font-semibold text-[#2a241e]">
                Go to your desk
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
