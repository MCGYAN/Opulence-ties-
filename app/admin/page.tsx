'use client';

import { SITE_NAME, SITE_TAGLINE, LOGO_PATH, CONTACT_EMAIL, CONTACT_PHONE, BUSINESS_ADDRESS, SOCIAL_INSTAGRAM, SOCIAL_TIKTOK, CATALOG_PDF_PREFIX, OG_IMAGE_PATH, HERO_IMAGE_PATH, DEFAULT_PRODUCT_BRAND } from '@/lib/site-brand';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('7days'); // logic not implemented for this demo, just UI
  const [loading, setLoading] = useState(isSupabaseConfigured());

  // Real Stats
  const [stats, setStats] = useState([
    {
      title: 'Total Revenue',
      value: 'GH₵ 0.00',
      change: '0%', // Placeholder trend
      trend: 'up',
      icon: 'ri-money-dollar-circle-line',
      color: 'blue'
    },
    {
      title: 'Orders',
      value: '0',
      change: '0%',
      trend: 'up',
      icon: 'ri-shopping-bag-line',
      color: 'blue'
    },
    {
      title: 'Customers', // This is total active users for us currently
      value: '0',
      change: '0%',
      trend: 'up',
      icon: 'ri-group-line',
      color: 'purple'
    },
    {
      title: 'Avg Order Value',
      value: 'GH₵ 0.00',
      change: '0%',
      trend: 'up',
      icon: 'ri-line-chart-line',
      color: 'amber'
    }
  ]);

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    async function fetchDashboardData() {
      try {
        // 1. Fetch ALL Orders for count & customers
        const { data: allOrdersData, error: ordersError } = await supabase
          .from('orders')
          .select('total, status, payment_status, created_at, email');

        if (ordersError) throw ordersError;

        // Only count PAID orders for revenue & avg order value
        const paidOrders = allOrdersData?.filter(o => o.payment_status === 'paid') || [];
        const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        const totalOrders = allOrdersData?.length || 0;
        const paidOrderCount = paidOrders.length;
        const avgOrderValue = paidOrderCount > 0 ? totalRevenue / paidOrderCount : 0;

        // 2. Fetch Customers Count (approximation using orders unique emails if we don't have user metrics access)
        // Since we can't query auth.users directly from client, we'll estimate active customers via orders or just keep it 0 if we can't.
        // Actually, best to just show "Orders" or "Recent Signups" if we had a public profiles table.
        // We'll use unique emails from orders as a proxy for "Customers"
        const uniqueCustomers = new Set(allOrdersData?.map(o => o.email)).size;


        // Process Chart Data (Last 7 Days) - only count PAID orders as revenue
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toISOString().split('T')[0];
        });

        const chartMap = last7Days.reduce((acc: any, date) => {
          acc[date] = 0;
          return acc;
        }, {});

        paidOrders.forEach(order => {
          const date = new Date(order.created_at).toISOString().split('T')[0];
          if (chartMap[date] !== undefined) {
            chartMap[date] += (order.total || 0);
          }
        });

        const processedChartData = Object.keys(chartMap).map(date => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: chartMap[date]
        }));
        setChartData(processedChartData);

        setStats([
          {
            title: 'Total Revenue',
            value: `GH₵ ${totalRevenue.toFixed(2)}`,
            change: '+0%', // Dynamic change requires date filtering logic which is complex
            trend: 'up',
            icon: 'ri-money-dollar-circle-line',
            color: 'blue'
          },
          {
            title: 'Orders',
            value: totalOrders.toString(),
            change: '+0%',
            trend: 'up',
            icon: 'ri-shopping-bag-line',
            color: 'blue'
          },
          {
            title: 'Customers (Active)',
            value: uniqueCustomers.toString(), // Proxy
            change: '+0%',
            trend: 'up',
            icon: 'ri-group-line',
            color: 'purple'
          },
          {
            title: 'Avg Order Value',
            value: `GH₵ ${avgOrderValue.toFixed(2)}`,
            change: '+0%',
            trend: 'up',
            icon: 'ri-line-chart-line',
            color: 'amber'
          }
        ]);

        // 3. Fetch Recent Orders (only paid orders)
        const { data: recentOrdersData } = await supabase
          .from('orders')
          .select('id, order_number, user_id, email, created_at, total, status, shipping_address')
          .eq('payment_status', 'paid')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentOrdersData) {
          const formattedRecent = recentOrdersData.map((o: any) => {
            const addr = o.shipping_address || {};
            const customerName = (addr.firstName && addr.lastName)
              ? `${addr.firstName.trim()} ${addr.lastName.trim()}`
              : addr.full_name || addr.firstName || o.email.split('@')[0];
            return {
              id: o.id,
              displayId: o.order_number,
              customer: customerName,
              email: o.email,
              date: new Date(o.created_at).toLocaleDateString(),
              total: o.total,
              status: o.status,
              items: 1
            };
          });
          setRecentOrders(formattedRecent);
        }

        // 4. Fetch Low Stock Products
        const { data: lowStockData } = await supabase
          .from('products')
          .select('name, quantity')
          .lt('quantity', 10)
          .limit(5);

        if (lowStockData) {
          setLowStockProducts(lowStockData.map((p: any) => ({
            name: p.name,
            stock: p.quantity,
            status: p.quantity === 0 ? 'critical' : 'low'
          })));
        }

        // 5. Fetch Top Products (Approximation: High Price or just Random for now, 
        // real top selling requires aggregation on order_items which is complex for client-side)
        // real top selling requires aggregation on order_items which is complex for client-side)
        const { data: productData } = await supabase.from('products').select('*, product_images(url)').limit(4);
        if (productData) {
          setTopProducts(productData.map((p: any) => ({
            id: p.slug, // Use slug for link
            name: p.name,
            image: p.product_images?.[0]?.url || LOGO_PATH,
            sales: 0, // Mocked for now
            revenue: 0, // Mocked for now
            stock: p.quantity
          })));
        }

      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const statusColors: any = {
    'pending': 'bg-amber-100 text-amber-700',
    'processing': 'bg-blue-100 text-blue-700',
    'shipped': 'bg-purple-100 text-purple-700',
    'delivered': 'bg-blue-100 text-blue-700',
    'cancelled': 'bg-red-100 text-red-700'
  };

  const quickActions = [
    {
      title: 'Feature Modules',
      description: 'Manage 40+ store features',
      icon: 'ri-puzzle-line',
      color: 'purple',
      link: '/admin/modules',
      badge: '40 Features'
    },
    {
      title: 'Inventory Management',
      description: 'Track stock & manage reorders',
      icon: 'ri-stack-line',
      color: 'amber',
      link: '/admin/inventory'
    },
    // ... reduced list for brevity or keep all if desired
  ];

  if (loading) {
    return <div className="p-8 text-center text-[#c4a15a]">Opening the desk...</div>;
  }

  return (
    <div>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#c4a15a]">Today</p>
          <h1 className="mt-1 text-3xl font-bold text-[#2a241e]">Dashboard</h1>
          <p className="mt-1 text-sm text-[#2a241e]/60">The floor, the stock, and the orders, in one place.</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.title} className="admin-panel rounded-2xl p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#c4a15a]/30 text-[#c4a15a]">
                  <i className={`${stat.icon} text-xl`}></i>
                </div>
              </div>
              <h3 className="mb-1 text-2xl font-bold text-[#2a241e]">{stat.value}</h3>
              <p className="text-sm text-[#2a241e]/55">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Revenue Chart & Quick Actions */}
        <div className="mb-8 grid gap-4 lg:grid-cols-3">
          <div className="admin-panel rounded-2xl p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#2a241e]">Revenue</h2>
              <select
                className="rounded-lg border border-[#c4a15a]/20 bg-white/80 p-2 text-sm text-[#2a241e]/80"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c4a15a" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#c4a15a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(92,78,58,0.15)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#57534e' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#57534e' }} tickFormatter={(value) => `GH₵${value}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f7f3eb', borderRadius: '12px', border: '1px solid #e4d8c4', color: '#2a241e' }}
                    formatter={(value) => [`GH₵${(value as number)?.toFixed(2) ?? '0.00'}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#c4a15a" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="admin-panel rounded-2xl p-5">
            <h2 className="mb-4 text-lg font-semibold text-[#2a241e]">On the desk</h2>
            <div className="space-y-2">
              {[
                { href: '/admin/products/new', icon: 'ri-add-line', label: 'Add a piece' },
                { href: '/admin/pos', icon: 'ri-computer-line', label: 'Open the counter' },
                { href: '/admin/orders', icon: 'ri-file-list-line', label: 'Review orders' },
                { href: '/admin/coupons', icon: 'ri-coupon-2-line', label: 'Coupons' },
              ].map((action) => (
                <Link key={action.href} href={action.href} className="flex items-center justify-between rounded-xl border border-[#c4a15a]/20 px-3 py-3 text-sm text-[#2a241e]/80 hover:border-[#c4a15a]/40 hover:text-[#8d6230]">
                  <span className="flex items-center gap-3">
                    <i className={action.icon}></i>
                    {action.label}
                  </span>
                  <i className="ri-arrow-right-line"></i>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-3">
          <div className="admin-panel overflow-hidden rounded-2xl p-4 sm:p-5 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#2a241e]">Recent orders</h2>
              <Link href="/admin/orders" className="text-sm text-[#c4a15a] hover:text-[#8d6230]">
                View all <i className="ri-arrow-right-line ml-1"></i>
              </Link>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              {recentOrders.length === 0 ? (
                <p className="py-4 text-center text-[#2a241e]/50">No recent orders.</p>
              ) : (
                <table className="w-full">
                  <thead className="border-b border-[#c4a15a]/20">
                    <tr>
                      <th className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-[#2a241e]/45">Order</th>
                      <th className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-[#2a241e]/45">Customer</th>
                      <th className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-[#2a241e]/45">Date</th>
                      <th className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-[#2a241e]/45">Total</th>
                      <th className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-[#2a241e]/45">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-[#c4a15a]/15">
                        <td className="px-3 py-4">
                          <Link href={`/admin/orders/${order.id}`} className="font-medium text-[#c4a15a]">
                            {order.displayId}
                          </Link>
                        </td>
                        <td className="px-3 py-4">
                          <p className="whitespace-nowrap font-medium text-[#2a241e]">{order.customer}</p>
                          <p className="text-sm text-[#2a241e]/45">{order.email}</p>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-[#2a241e]/70">{order.date}</td>
                        <td className="whitespace-nowrap px-3 py-4 font-semibold text-[#2a241e]">GH₵ {order.total.toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusColors[order.status] || 'bg-gray-100'}`}>
                            {order.status === 'shipped' ? 'Packaged' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="admin-panel rounded-2xl p-5">
              <h2 className="mb-4 text-lg font-semibold text-[#2a241e]">Low stock</h2>
              {lowStockProducts.length === 0 ? (
                <p className="text-[#2a241e]/50">The rails are stocked.</p>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between rounded-xl border border-[#c4a15a]/20 p-3">
                      <div className="flex-1">
                        <p className="truncate pr-2 text-sm font-medium text-[#2a241e]">{product.name}</p>
                        <p className="mt-1 text-xs text-[#2a241e]/45">Stock: {product.stock}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${product.status === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {product.status === 'critical' ? 'Critical' : 'Low'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/admin/products?filter=low-stock" className="mt-4 block text-center text-sm text-[#c4a15a] hover:text-[#8d6230]">
                View all pieces <i className="ri-arrow-right-line ml-1"></i>
              </Link>
            </div>
          </div>
        </div>

        <div className="admin-panel overflow-hidden rounded-2xl p-4 sm:p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#2a241e]">Pieces on the floor</h2>
            <Link href="/admin/products" className="text-sm text-[#c4a15a] hover:text-[#8d6230]">
              View all <i className="ri-arrow-right-line ml-1"></i>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topProducts.map((product) => (
              <div key={product.id} className="rounded-xl border border-[#c4a15a]/20 p-3">
                <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-[#f3eee6]">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="mb-2 line-clamp-2 font-medium text-[#2a241e]">{product.name}</h3>
                <div className="mt-3 flex items-center justify-between border-t border-[#c4a15a]/20 pt-3">
                  <span className="text-sm text-[#2a241e]/50">Stock: {product.stock}</span>
                  <Link href={`/admin/products/${product.id}`} className="text-sm text-[#c4a15a]">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
