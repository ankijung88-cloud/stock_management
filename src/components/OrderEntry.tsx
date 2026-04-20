import React, { useState, useEffect } from 'react';
import { db } from '../db/db.ts';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, User, Box, Hash, CreditCard, Tag, Truck, FileText } from 'lucide-react';

// 외부로 컴포넌트 이동하여 포커스 이슈 해결
const InputField = ({ label, name, value, onChange, type = 'text', icon: Icon, isTextArea = false }: any) => (
  <div style={{ marginBottom: '1rem' }}>
    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)', fontSize: '0.875rem' }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: '12px', top: isTextArea ? '18px' : '50%', transform: isTextArea ? 'none' : 'translateY(-50%)', color: 'var(--primary)' }}>
        <Icon size={18} />
      </div>
      {isTextArea ? (
        <textarea
          className="glass-input"
          style={{ paddingLeft: '40px', minHeight: '100px', paddingTop: '12px', resize: 'vertical' }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
        />
      ) : (
        <input
          type={type}
          className="glass-input"
          style={{ paddingLeft: '40px' }}
          value={value}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          placeholder={label}
        />
      )}
    </div>
  </div>
);

const OrderEntry: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [form, setForm] = useState({
    personName: '',
    productName: '',
    quantity: 1,
    costPrice: 0,
    salePrice: 0,
    logisticsCost: 0,
    notes: ''
  });

  const [calcs, setCalcs] = useState({
    totalSalePrice: 0,
    netProfit: 0
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get('name');
    const prefilledPerson = params.get('person'); // 고객 상세에서 넘어올 때
    
    if (name || prefilledPerson) {
      setForm(prev => ({
        ...prev,
        personName: prefilledPerson || prev.personName,
        productName: name || prev.productName,
        quantity: Number(params.get('qty')) || prev.quantity,
        costPrice: Number(params.get('cost')) || prev.costPrice,
        salePrice: Number(params.get('sale')) || prev.salePrice,
        logisticsCost: Number(params.get('logistics')) || prev.logisticsCost
      }));
    }
  }, [location.search]);

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

  const updateField = (name: string, value: any) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>새 주문 입력</h1>
        <p style={{ color: 'var(--text-dim)' }}>수익 정보를 입력하세요</p>
      </header>

      <form onSubmit={handleSubmit} className="glass-card fade-in">
        <InputField label="사람 이름" name="personName" value={form.personName} onChange={(v: any) => updateField('personName', v)} icon={User} />
        <InputField label="품목 이름" name="productName" value={form.productName} onChange={(v: any) => updateField('productName', v)} icon={Box} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <InputField label="구매 수량" name="quantity" type="number" value={form.quantity} onChange={(v: any) => updateField('quantity', v)} icon={Hash} />
          <InputField label="공급가 (단가)" name="costPrice" type="number" value={form.costPrice} onChange={(v: any) => updateField('costPrice', v)} icon={Tag} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <InputField label="판매가 (단가)" name="salePrice" type="number" value={form.salePrice} onChange={(v: any) => updateField('salePrice', v)} icon={CreditCard} />
          <InputField label="물류비 (전체)" name="logisticsCost" type="number" value={form.logisticsCost} onChange={(v: any) => updateField('logisticsCost', v)} icon={Truck} />
        </div>

        <InputField label="비고 및 기타 메모" name="notes" value={form.notes} onChange={(v: any) => updateField('notes', v)} icon={FileText} isTextArea={true} />

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
      <div style={{ height: '80px' }}></div>
    </div>
  );
};

export default OrderEntry;
