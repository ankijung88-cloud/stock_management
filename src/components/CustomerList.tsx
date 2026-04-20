import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db.ts';
import { useNavigate } from 'react-router-dom';
import { User, ChevronRight, ShoppingBag, TrendingUp, PlusCircle, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  const orders = useLiveQuery(() => db.orders.toArray());
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  // Group orders by customer name
  const customerStats = useMemo(() => {
    if (!orders) return [];
    
    const groups = orders.reduce((acc: any, order) => {
      const name = order.personName;
      if (!acc[name]) {
        acc[name] = { 
          name, 
          orderCount: 0, 
          totalRevenue: 0, 
          totalProfit: 0,
          lastOrderDate: 0,
          orders: [] 
        };
      }
      acc[name].orderCount += 1;
      acc[name].totalRevenue += order.totalSalePrice;
      acc[name].totalProfit += order.netProfit;
      acc[name].lastOrderDate = Math.max(acc[name].lastOrderDate, order.createdAt);
      acc[name].orders.push(order);
      return acc;
    }, {});

    return Object.values(groups).sort((a: any, b: any) => b.lastOrderDate - a.lastOrderDate);
  }, [orders]);

  const viewCustomerOrders = (name: string) => {
    setSelectedCustomer(name);
  };

  const addOrderForCustomer = (name: string) => {
    navigate(`/add?person=${encodeURIComponent(name)}`);
  };

  const currentCustomerData = useMemo(() => {
    return customerStats.find((c: any) => c.name === selectedCustomer);
  }, [customerStats, selectedCustomer]);

  if (selectedCustomer && currentCustomerData) {
    const data = currentCustomerData as any;
    return (
      <div className="container fade-in">
        <header style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => setSelectedCustomer(null)} style={{ background: 'none', border: 'none', color: 'white' }}>
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedCustomer} 고객정보</h1>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1rem' }}>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>총 주문수</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{data.orderCount}건</div>
          </div>
          <div className="glass-card" style={{ padding: '1rem' }}>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>총 기여 수익</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>₩{data.totalProfit.toLocaleString()}</div>
          </div>
        </div>

        <button 
          className="btn-primary" 
          style={{ width: '100%', marginBottom: '2rem' }}
          onClick={() => addOrderForCustomer(selectedCustomer)}
        >
          <PlusCircle size={20} />
          <span>이 고객의 추가 주문 입력</span>
        </button>

        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>전체 주문 히스토리</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.orders.sort((a: any, b: any) => b.createdAt - a.createdAt).map((order: any) => (
            <div key={order.id} className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: '600' }}>{order.productName}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>
                  {format(order.createdAt, 'yyyy.MM.dd')}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>{order.quantity}개 / 매출 ₩{order.totalSalePrice.toLocaleString()}</span>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>수익 ₩{order.netProfit.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: '80px' }}></div>
      </div>
    );
  }

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>고객 관리</h1>
        <p style={{ color: 'var(--text-dim)' }}>고객별 주문 통계 및 내역 관리</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {customerStats.map((customer: any) => (
          <div 
            key={customer.name} 
            className="glass-card fade-in" 
            style={{ padding: '1.25rem', cursor: 'pointer' }}
            onClick={() => viewCustomerOrders(customer.name)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <User size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{customer.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>최근 주문: {format(customer.lastOrderDate, 'MM.dd')}</div>
                </div>
              </div>
              <ChevronRight size={20} color="var(--text-dim)" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={14} color="var(--text-dim)" />
                <span style={{ fontSize: '0.875rem' }}>{customer.orderCount}건</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={14} color="var(--primary)" />
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>누적 ₩{customer.totalProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}

        {customerStats.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-dim)' }}>
            아직 등록된 고객이 없습니다. 주문을 먼저 생성해주세요.
          </div>
        )}
      </div>
      <div style={{ height: '80px' }}></div>
    </div>
  );
};

export default CustomerList;
