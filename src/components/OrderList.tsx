import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Order } from '../db/db.ts';
import { Trash2, Search, Calendar, User, Package, FileText } from 'lucide-react';
import { format } from 'date-fns';

const OrderList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const orders = useLiveQuery(() => 
    db.orders.orderBy('createdAt').reverse().toArray()
  );

  const filteredOrders = orders?.filter(order => 
    order.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.notes && order.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const deleteOrder = async (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await db.orders.delete(id);
    }
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>주문 내역</h1>
        <p style={{ color: 'var(--text-dim)' }}>전체 주문 데이터를 관리합니다</p>
      </header>

      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}>
          <Search size={20} />
        </div>
        <input 
          className="glass-input" 
          style={{ paddingLeft: '45px' }} 
          placeholder="이름, 품목 또는 메모 검색..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredOrders?.map(order => (
          <div key={order.id} className="glass-card fade-in" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <User size={16} color="var(--primary)" />
                  <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{order.personName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.875rem' }}>
                  <Package size={14} />
                  <span>{order.productName} ({order.quantity}개)</span>
                </div>
              </div>
              <button 
                onClick={() => deleteOrder(order.id!)}
                style={{ background: 'rgba(239, 68, 68, 0.14)', border: 'none', borderRadius: '8px', padding: '6px', color: '#ef4444' }}
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* 메모 필드 표시 */}
            {order.notes && (
              <div style={{ 
                background: 'rgba(255,255,255,0.03)', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                marginBottom: '1rem',
                borderLeft: '3px solid var(--primary)',
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', marginBottom: '0.25rem', fontSize: '0.75rem' }}>
                  <FileText size={12} />
                  <span>메모</span>
                </div>
                {order.notes}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--glass-border)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>총 매출</span>
                <div style={{ fontWeight: 'bold' }}>₩{order.totalSalePrice.toLocaleString()}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>순이익</span>
                <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>₩{order.netProfit.toLocaleString()}</div>
              </div>
            </div>

            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
              <Calendar size={12} />
              <span>{format(order.createdAt, 'yyyy.MM.dd HH:mm')}</span>
            </div>
          </div>
        ))}

        {filteredOrders?.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
            검색 결과가 없습니다.
          </div>
        )}
      </div>
      <div style={{ height: '80px' }}></div>
    </div>
  );
};

export default OrderList;
