import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db.ts';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, DollarSign, Truck } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const orders = useLiveQuery(() => db.orders.orderBy('createdAt').toArray());

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalOrders: 0,
    totalLogistics: 0
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (orders) {
      const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalSalePrice, 0);
      const totalProfit = orders.reduce((acc, curr) => acc + curr.netProfit, 0);
      const totalOrders = orders.length;
      const totalLogistics = orders.reduce((acc, curr) => acc + curr.logisticsCost, 0);

      setStats({ totalRevenue, totalProfit, totalOrders, totalLogistics });

      // Group by date for chart
      const groups = orders.reduce((acc: any, curr) => {
        const date = format(curr.createdAt, 'MM/dd');
        if (!acc[date]) acc[date] = { date, profit: 0, revenue: 0 };
        acc[date].profit += curr.netProfit;
        acc[date].revenue += curr.totalSalePrice;
        return acc;
      }, {});

      setChartData(Object.values(groups).slice(-7)); // Last 7 days
    }
  }, [orders]);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="glass-card fade-in" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>{title}</span>
        <div style={{ padding: '0.5rem', borderRadius: '10px', background: `${color}20`, color }}>
          <Icon size={20} />
        </div>
      </div>
      <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
        {typeof value === 'number' ? `₩${value.toLocaleString()}` : value}
      </div>
    </div>
  );

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>수익마스터 대시보드</h1>
        <p style={{ color: 'var(--text-dim)' }}>실시간 주문 및 수익 현황</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard title="누적 순이익" value={stats.totalProfit} icon={TrendingUp} color="#10b981" />
        <StatCard title="총 매출액" value={stats.totalRevenue} icon={DollarSign} color="#6366f1" />
        <StatCard title="총 주문건수" value={stats.totalOrders} icon={Package} color="#f59e0b" />
        <StatCard title="총 물류비" value={stats.totalLogistics} icon={Truck} color="#ef4444" />
      </div>

      <div className="glass-card" style={{ height: '300px', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>최근 수익 추이 (7일)</h3>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ background: 'var(--bg-dark-alt)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}
              itemStyle={{ color: 'var(--primary)' }}
            />
            <Area type="monotone" dataKey="profit" stroke="var(--primary)" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
