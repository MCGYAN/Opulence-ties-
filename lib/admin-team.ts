export const OWNER_EMAIL = 'owner@opulenceties.com';

const TEAM_KEY = 'opulence-admin-team';
const EMAIL_COOKIE = 'ot-admin-email';
const SESSION_SECONDS = 60 * 60 * 8;

export type OfficeFeature = {
  id: string;
  title: string;
  icon: string;
  path: string;
  exact?: boolean;
  moduleId?: string;
};

export const OFFICE_FEATURES: OfficeFeature[] = [
  { id: 'dashboard', title: 'Dashboard', icon: 'ri-dashboard-line', path: '/admin', exact: true },
  { id: 'orders', title: 'Orders', icon: 'ri-shopping-bag-line', path: '/admin/orders' },
  { id: 'pos', title: 'POS System', icon: 'ri-store-3-line', path: '/admin/pos' },
  { id: 'products', title: 'Products', icon: 'ri-box-3-line', path: '/admin/products' },
  { id: 'categories', title: 'Categories', icon: 'ri-folder-line', path: '/admin/categories' },
  { id: 'customers', title: 'Customers', icon: 'ri-group-line', path: '/admin/customers' },
  { id: 'reviews', title: 'Reviews', icon: 'ri-chat-smile-2-line', path: '/admin/reviews' },
  { id: 'inventory', title: 'Inventory', icon: 'ri-stack-line', path: '/admin/inventory' },
  { id: 'analytics', title: 'Analytics', icon: 'ri-bar-chart-line', path: '/admin/analytics' },
  { id: 'coupons', title: 'Coupons', icon: 'ri-coupon-2-line', path: '/admin/coupons' },
  { id: 'customer-insights', title: 'Customer Insights', icon: 'ri-user-search-line', path: '/admin/customer-insights', moduleId: 'customer-insights' },
  { id: 'notifications', title: 'Notifications', icon: 'ri-notification-3-line', path: '/admin/notifications', moduleId: 'notifications' },
  { id: 'sms', title: 'SMS Debugger', icon: 'ri-message-2-line', path: '/admin/test-sms' },
  { id: 'content', title: 'Content', icon: 'ri-edit-2-line', path: '/admin/content' },
  { id: 'dms', title: 'DMs', icon: 'ri-chat-3-line', path: '/admin/dms' },
  { id: 'blog', title: 'Blog', icon: 'ri-article-line', path: '/admin/blog', moduleId: 'blog' },
  { id: 'modules', title: 'Modules', icon: 'ri-puzzle-line', path: '/admin/modules' },
];

export const ROLE_PRESETS: { role: string; access: string[] }[] = [
  { role: 'Sales attendant', access: ['pos'] },
  { role: 'Business manager', access: ['dashboard'] },
  { role: 'Inventory', access: ['inventory', 'products', 'categories'] },
];

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  access: string[];
};

const SAMPLE_TEAM: TeamMember[] = [
  { id: 'sample-sales', name: 'Sales attendant', email: 'sales@opulenceties.com', role: 'Sales attendant', access: ['pos'] },
  { id: 'sample-manager', name: 'Business manager', email: 'manager@opulenceties.com', role: 'Business manager', access: ['dashboard'] },
  { id: 'sample-stock', name: 'Inventory', email: 'stock@opulenceties.com', role: 'Inventory', access: ['inventory', 'products', 'categories'] },
];

export function loadTeam(): TeamMember[] {
  if (typeof window === 'undefined') return SAMPLE_TEAM;
  try {
    const raw = window.localStorage.getItem(TEAM_KEY);
    if (!raw) {
      window.localStorage.setItem(TEAM_KEY, JSON.stringify(SAMPLE_TEAM));
      return SAMPLE_TEAM;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((member) => member && typeof member.email === 'string');
  } catch {
    return [];
  }
}

export function saveTeam(members: TeamMember[]) {
  window.localStorage.setItem(TEAM_KEY, JSON.stringify(members));
}

export function featureTitle(id: string) {
  return OFFICE_FEATURES.find((feature) => feature.id === id)?.title || id;
}

export function homePathFor(access: string[] | 'owner') {
  if (access === 'owner') return '/admin';
  const feature = OFFICE_FEATURES.find((item) => access.includes(item.id));
  return feature?.path || '/admin';
}

export function canOpenPath(pathname: string, access: string[] | 'owner') {
  if (pathname === '/admin/login') return true;
  if (access === 'owner') return true;
  if (pathname === '/admin/team' || pathname.startsWith('/admin/team/')) return false;
  const feature = OFFICE_FEATURES.find((item) =>
    item.exact ? pathname === item.path : pathname === item.path || pathname.startsWith(`${item.path}/`)
  );
  if (!feature) return false;
  return access.includes(feature.id);
}

export function resolveAccess(email: string): { email: string; name: string; role: string; access: string[] | 'owner' } {
  const normalized = email.trim().toLowerCase();
  const member = loadTeam().find((person) => person.email.trim().toLowerCase() === normalized);
  if (!member || !normalized || normalized === OWNER_EMAIL) {
    return { email: OWNER_EMAIL, name: 'Owner', role: 'Owner', access: 'owner' };
  }
  return { email: member.email, name: member.name, role: member.role || 'Team', access: member.access };
}

function cookieValue(name: string) {
  if (typeof document === 'undefined') return '';
  const row = document.cookie.split('; ').find((part) => part.startsWith(`${name}=`));
  if (!row) return '';
  return decodeURIComponent(row.slice(name.length + 1));
}

export function readOfficeEmail() {
  return cookieValue(EMAIL_COOKIE);
}

export function writeOfficeSession(email: string) {
  document.cookie = `ot-admin-demo=1; path=/; max-age=${SESSION_SECONDS}; SameSite=Lax`;
  document.cookie = `${EMAIL_COOKIE}=${encodeURIComponent(email)}; path=/; max-age=${SESSION_SECONDS}; SameSite=Lax`;
}

export function clearOfficeSession() {
  document.cookie = 'ot-admin-demo=; path=/; max-age=0; SameSite=Lax';
  document.cookie = `${EMAIL_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
