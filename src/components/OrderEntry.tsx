import React, { useState, useEffect } from 'react';
import { db } from '../db/db.ts';
import { useNavigate } from 'react-router-dom';
import { Save, User, Box, Hash, CreditCard, Tag, Truck } from 'lucide-react';

const OrderEntry: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    personName: '',
    productName: '',
    quantity: 1,
    costPrice: 0,
    salePrice: 0,
    logisticsCost: 0
  });

  const [calcs, setCalcs] = useState({
    totalSalePrice: 0,
    netProfit: 0
  });

  useEffect(() => {
    const totalSalePrice = form.salePrice * form.quantity;
    const netProfit = totalSalePrice - (form.costPrice * form.quantity) - form.logisticsCost;
    setCalcs({ totalSalePrice, netProfit });
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.personName || !form.productName) {
      alert('필수 항목을 입력하세요.');
      return;
    }

    await db.orders.add({
      ...form,
      totalSalePrice: calcs.totalSalePrice,
      netProfit: calcs.netProfit,
      createdAt: Date.now()
    });

    navigate('/list');
  };

  const InputField = ({ label, name, type = 'text', icon: Icon }: any) => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)', fontSize: '0.875rem' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }}>
          <Icon size={18} />
        </div>
        <input
          type={type}
          className="glass-input"
          style={{ paddingLeft: '40px' }}
          value={(form as any)[name]}
          onChange={(e) => setForm({ ...form, [name]: type === 'number' ? Number(e.target.value) : e.target.value })}
          placeholder={label}
        />
      </div>
    </div>
  );

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>새 주문 입력</h1>
        <p style={{ color: 'var(--text-dim)' }}>수익 정보를 입력하세요</p>
      </header>

      <form onSubmit={handleSubmit} className="glass-card fade-in">
        <InputField label="사람 이름" name="personName" icon={User} />
        <InputField label="품목 이름" name="productName" icon={Box} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <InputField label="구매 수량" name="quantity" type="number" icon={Hash} />
          <InputField label="공급가 (단가)" name="costPrice" type="number" icon={Tag} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <InputField label="판매가 (단가)" name="salePrice" type="number" icon={CreditCard} />
          <InputField label="물류비 (전체)" name="logisticsCost" type="number" icon={Truck} />
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>총 판매가</span>
            <span style={{ fontWeight: 'bold', color: 'white' }}>₩{calcs.totalSalePrice.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-dim)' }}>예상 순이익</span>
            <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.25rem' }}>₩{calcs.netProfit.toLocaleString()}</span>
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
          <Save size={20} />
          <span>주문 저장하기</span>
        </button>
      </form>
    </div>
  );
};

export default OrderEntry;
