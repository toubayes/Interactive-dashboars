import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  LayoutDashboard, 
  TrendingUp, 
  ShoppingBag, 
  Calendar, 
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  DollarSign,
  Sparkles,
  Languages
} from 'lucide-react';
import { RAW_CSV, parseCSV } from './data';
import { Order } from './types';
import { cn, formatCurrency, formatDate } from './utils';
import { translations, Language } from './translations';

const COLORS = ['#FF4E00', '#00FF80', '#7C3AED', '#3B82F6', '#F59E0B', '#EC4899'];

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const allOrders = useMemo(() => parseCSV(RAW_CSV), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState('All');

  const products = useMemo(() => ['All', ...Array.from(new Set(allOrders.map(o => o.product)))], [allOrders]);
  const paymentMethods = useMemo(() => ['All', ...Array.from(new Set(allOrders.map(o => o.paymentMethod)))], [allOrders]);

  const filteredOrders = useMemo(() => {
    return allOrders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           order.product.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProduct = selectedProduct === 'All' || order.product === selectedProduct;
      const matchesPayment = selectedPayment === 'All' || order.paymentMethod === selectedPayment;
      return matchesSearch && matchesProduct && matchesPayment;
    });
  }, [allOrders, searchTerm, selectedProduct, selectedPayment]);

  const stats = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((acc, curr) => acc + curr.price, 0);
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const uniqueProducts = new Set(filteredOrders.map(o => o.product)).size;

    return { totalRevenue, totalOrders, avgOrderValue, uniqueProducts };
  }, [filteredOrders]);

  const revenueByDate = useMemo(() => {
    const map = new Map<string, number>();
    filteredOrders.forEach(order => {
      map.set(order.date, (map.get(order.date) || 0) + order.price);
    });
    return Array.from(map.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredOrders]);

  const salesByProduct = useMemo(() => {
    const map = new Map<string, number>();
    filteredOrders.forEach(order => {
      map.set(order.product, (map.get(order.product) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredOrders]);

  const paymentDistribution = useMemo(() => {
    const map = new Map<string, number>();
    filteredOrders.forEach(order => {
      map.set(order.paymentMethod, (map.get(order.paymentMethod) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredOrders]);

  return (
    <div className={cn("min-h-screen relative overflow-x-hidden", isRtl ? "font-sans" : "font-sans")} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="atmosphere" />
      
      {/* Header */}
      <header className="glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#FF4E00] to-[#7C3AED] p-2.5 rounded-xl shadow-lg shadow-orange-500/20">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter uppercase italic">{t.title}</h1>
                <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">{t.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative hidden md:block">
                <Search className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-white/30", isRtl ? "right-4" : "left-4")} />
                <input 
                  type="text" 
                  placeholder={t.searchPlaceholder}
                  className={cn(
                    "py-2.5 bg-white/5 border border-white/10 rounded-full text-sm focus:ring-2 focus:ring-[#FF4E00] transition-all w-72 outline-none placeholder:text-white/20",
                    isRtl ? "pr-12 pl-6" : "pl-12 pr-6"
                  )}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button 
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-colors group"
              >
                <Languages className="w-4 h-4 text-[#FF4E00] group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-mono uppercase tracking-widest">{lang === 'en' ? 'AR' : 'EN'}</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-white/40 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{t.dateRange}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters Bar */}
        <div className="flex flex-wrap gap-4 mb-10 items-center glass-card p-5">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-white/40">
            <Filter className="w-3 h-3" />
            <span>{t.parameters}</span>
          </div>
          
            <select 
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#FF4E00] outline-none hover:bg-white/10 transition-colors cursor-pointer"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="All" className="bg-[#1a1a1a]">{t.all}</option>
            {products.filter(p => p !== 'All').map(p => (
              <option key={p} value={p} className="bg-[#1a1a1a]">
                {t.products[p as keyof typeof t.products] || p}
              </option>
            ))}
          </select>

          <select 
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#FF4E00] outline-none hover:bg-white/10 transition-colors cursor-pointer"
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
          >
            <option value="All" className="bg-[#1a1a1a]">{t.all}</option>
            {paymentMethods.filter(pm => pm !== 'All').map(pm => (
              <option key={pm} value={pm} className="bg-[#1a1a1a]">
                {t.paymentMethods[pm as keyof typeof t.paymentMethods] || pm}
              </option>
            ))}
          </select>

          <button 
            onClick={() => { setSearchTerm(''); setSelectedProduct('All'); setSelectedPayment('All'); }}
            className={cn("text-[10px] font-mono tracking-widest uppercase text-white/20 hover:text-white transition-colors", isRtl ? "mr-auto" : "ml-auto")}
          >
            {t.resetSystem}
          </button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title={t.totalRevenue} 
            value={formatCurrency(stats.totalRevenue, lang)} 
            icon={<DollarSign className="w-5 h-5" />}
            trend="+12.5%"
            positive={true}
            color="#FF4E00"
            isRtl={isRtl}
          />
          <StatCard 
            title={t.totalOrders} 
            value={stats.totalOrders.toString()} 
            icon={<ShoppingBag className="w-5 h-5" />}
            trend="+8.2%"
            positive={true}
            color="#00FF80"
            isRtl={isRtl}
          />
          <StatCard 
            title={t.avgTicket} 
            value={formatCurrency(stats.avgOrderValue, lang)} 
            icon={<TrendingUp className="w-5 h-5" />}
            trend="-2.4%"
            positive={false}
            color="#7C3AED"
            isRtl={isRtl}
          />
          <StatCard 
            title={t.activeSkus} 
            value={stats.uniqueProducts.toString()} 
            icon={<Package className="w-5 h-5" />}
            trend="+1"
            positive={true}
            color="#3B82F6"
            isRtl={isRtl}
          />
        </div>

        {/* Main Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 glass-card p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold tracking-tight">{t.revenueTrajectory}</h3>
                <p className="text-xs text-white/40 font-mono">{t.dailySales}</p>
              </div>
              <Sparkles className="w-5 h-5 text-[#FF4E00] animate-pulse" />
            </div>
            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueByDate}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF4E00" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF4E00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(val) => val.split('-').slice(1).join('/')}
                    tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                    reversed={isRtl}
                  />
                  <YAxis 
                    orientation={isRtl ? 'right' : 'left'}
                    tickFormatter={(val) => formatCurrency(val, lang)}
                    tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)', textAlign: isRtl ? 'right' : 'left' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(val: number) => [formatCurrency(val, lang), t.totalRevenue]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#FF4E00" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#areaGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-lg font-bold tracking-tight mb-2">{t.paymentFlow}</h3>
            <p className="text-xs text-white/40 font-mono mb-8">{t.channelDistribution}</p>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {paymentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: isRtl ? 'right' : 'left' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3">
              {paymentDistribution.map((item, i) => (
                <div key={item.name} className="flex justify-between items-center text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-white/60 uppercase tracking-wider">
                      {t.paymentMethods[item.name as keyof typeof t.paymentMethods] || item.name}
                    </span>
                  </div>
                  <span className="font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-8">
            <h3 className="text-lg font-bold tracking-tight mb-2">{t.inventoryVelocity}</h3>
            <p className="text-xs text-white/40 font-mono mb-8">{t.unitsSold}</p>
            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByProduct} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" hide reversed={isRtl} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={140} 
                    tickFormatter={(val) => t.products[val as keyof typeof t.products] || val}
                    tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                    orientation={isRtl ? 'right' : 'left'}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: isRtl ? 'right' : 'left' }}
                  />
                  <Bar dataKey="value" fill="#7C3AED" radius={isRtl ? [8, 0, 0, 8] : [0, 8, 8, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-8 overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold tracking-tight">{t.liveLedger}</h3>
                <p className="text-xs text-white/40 font-mono">{t.realTimeStream}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">{t.live}</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-start">
                <thead>
                  <tr className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] border-b border-white/5">
                    <th className="pb-4 text-start">{t.reference}</th>
                    <th className="pb-4 text-start">{t.asset}</th>
                    <th className="pb-4 text-start">{t.timestamp}</th>
                    <th className="pb-4 text-end">{t.value}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.slice(0, 8).map((order, i) => (
                    <tr key={`${order.orderNumber}-${i}`} className="group hover:bg-white/5 transition-colors">
                      <td className="py-4 text-xs font-mono text-white/40">{order.orderNumber}</td>
                      <td className="py-4 text-xs font-bold text-white/80">
                        {t.products[order.product as keyof typeof t.products] || order.product}
                      </td>
                      <td className="py-4 text-xs font-mono text-white/40">{formatDate(order.date, lang)}</td>
                      <td className="py-4 text-xs font-black text-end text-[#00FF80]">{formatCurrency(order.price, lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-white/5 mt-10">
        <div className="flex justify-between items-center opacity-20 grayscale">
          <div className="text-[10px] font-mono tracking-widest uppercase">{t.systemStatus}</div>
          <div className="text-[10px] font-mono tracking-widest uppercase">{t.copyright}</div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ title, value, icon, trend, positive, color, isRtl }: { title: string, value: string, icon: React.ReactNode, trend: string, positive: boolean, color: string, isRtl: boolean }) {
  return (
    <div className="glass-card p-6 group hover:border-white/20 transition-all duration-500 relative overflow-hidden">
      <div className={cn("absolute w-24 h-24 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity", isRtl ? "-left-4 -top-4" : "-right-4 -top-4")} style={{ color }}>
        {icon}
      </div>
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 rounded-xl text-white/80 border border-white/10 group-hover:scale-110 transition-transform duration-500" style={{ color }}>
          {icon}
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full border",
          positive ? "text-green-400 bg-green-400/10 border-green-400/20" : "text-red-400 bg-red-400/10 border-red-400/20"
        )}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/30 mb-2">{title}</p>
        <h4 className="text-3xl font-black tracking-tighter italic">{value}</h4>
      </div>
    </div>
  );
}
