import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Order } from '../db/db.ts';
import { Trash2, Search, Calendar, User, Package } from 'lucide-react';
import { format } from 'date-fns';

const OrderList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const orders = useLiveQuery(
    () => db.orders.orderBy('createdAt').reverse().toArray()
  );

  const filteredOrders = orders?.filter((order: Order) => 
    order.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.productName.toLowerCase().includes(searchTerm.toLowerCase())
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
        <p style={{ color: 'var(--text-dim)' }}>전체 리스트 및 검색</p>
      </header>

      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}>
          <Search size={18} />
        </div>
        <input
          className="glass-input"
          style={{ paddingLeft: '40px' }}
          placeholder="이름 또는 품목으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredOrders?.map((order: Order) => (
          <div key={order.id} className="glass-card fade-in" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Package size={18} color="var(--primary)" />
                  {order.productName}
                </h3>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <User size={14} /> {order.personName}
                  <span style={{ margin: '0 0.5rem' }}>|</span>
                  <Calendar size={14} /> {format(order.createdAt, 'yyyy-MM-dd')}
                </div>
              </div>
              <button 
                onClick={() => deleteOrder(order.id!)}
                style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.3)', padding: '0.5rem', borderRadius: '8px' }}>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>수량</div>
                <div>{order.quantity}개</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.3)', padding: '0.5rem', borderRadius: '8px' }}>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>매출</div>
                <div>₩{order.totalSalePrice.toLocaleString()}</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--primary-dark)' }}>
                <div style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 'bold' }}>순이익</div>
                <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>₩{order.netProfit.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders?.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
