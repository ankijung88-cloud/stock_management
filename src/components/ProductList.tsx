import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Product } from '../db/db.ts';
import { useNavigate } from 'react-router-dom';
import { Plus, Camera, Trash2, PlusSquare } from 'lucide-react';

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const products = useLiveQuery(() => db.products.orderBy('createdAt').reverse().toArray());
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    image: '',
    costPrice: 0,
    salePrice: 0,
    logisticsCost: 0,
    additionalCost: 0,
    quantity: 1
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;

    await db.products.add({
      ...newProduct,
      createdAt: Date.now()
    });

    setNewProduct({
      name: '',
      image: '',
      costPrice: 0,
      salePrice: 0,
      logisticsCost: 0,
      additionalCost: 0,
      quantity: 1
    });
    setShowAddForm(false);
  };

  const deleteProduct = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('품목을 삭제하시겠습니까?')) {
      await db.products.delete(id);
    }
  };

  const startOrder = (product: Product) => {
    const params = new URLSearchParams({
      name: product.name,
      cost: product.costPrice.toString(),
      sale: product.salePrice.toString(),
      logistics: product.logisticsCost.toString(),
      qty: product.quantity.toString()
    });
    navigate(`/add?${params.toString()}`);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  // 공통 숫자 입력 핸들러
  const handleNumberInput = (field: string, val: string) => {
    if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
      setNewProduct(prev => ({ ...prev, [field]: val === '' ? 0 : Number(val) }));
    }
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>품목 관리</h1>
          <p style={{ color: 'var(--text-dim)' }}>사진 클릭 시 즉시 주문 가능</p>
        </div>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="btn-primary" style={{ padding: '0.75rem' }}>
            <Plus size={24} />
          </button>
        )}
      </header>

      {showAddForm && (
        <form onSubmit={addProduct} className="glass-card fade-in" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <label style={{ width: '120px', height: '120px', borderRadius: '24px', border: '2px dashed var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
              {newProduct.image ? (
                <img src={newProduct.image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <Camera size={32} color="var(--text-dim)" />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>사진 촬영 또는 선택</span>
                </>
              )}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </label>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <input 
              className="glass-input" 
              placeholder="품목 이름" 
              value={newProduct.name} 
              onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
              onFocus={handleFocus}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="input-group">
              <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>기본 수량</label>
              <input 
                type="text" 
                inputMode="numeric" 
                className="glass-input" 
                value={newProduct.quantity === 0 ? '' : newProduct.quantity} 
                onChange={e => handleNumberInput('quantity', e.target.value)} 
                onFocus={handleFocus}
                placeholder="0"
              />
            </div>
            <div className="input-group">
              <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>공급가</label>
              <input 
                type="text" 
                inputMode="decimal" 
                className="glass-input" 
                value={newProduct.costPrice === 0 ? '' : newProduct.costPrice} 
                onChange={e => handleNumberInput('costPrice', e.target.value)} 
                onFocus={handleFocus}
                placeholder="0"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="input-group">
              <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>판매가</label>
              <input 
                type="text" 
                inputMode="decimal" 
                className="glass-input" 
                value={newProduct.salePrice === 0 ? '' : newProduct.salePrice} 
                onChange={e => handleNumberInput('salePrice', e.target.value)} 
                onFocus={handleFocus}
                placeholder="0"
              />
            </div>
            <div className="input-group">
              <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>물류비</label>
              <input 
                type="text" 
                inputMode="decimal" 
                className="glass-input" 
                value={newProduct.logisticsCost === 0 ? '' : newProduct.logisticsCost} 
                onChange={e => handleNumberInput('logisticsCost', e.target.value)} 
                onFocus={handleFocus}
                placeholder="0"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn-primary" style={{ flex: 2 }}>저장하기</button>
            <button type="button" onClick={() => setShowAddForm(false)} style={{ flex: 1, background: 'none', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '12px' }}>취소</button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {products?.map(product => {
          const margin = product.salePrice - product.costPrice - (product.logisticsCost / product.quantity) - (product.additionalCost / product.quantity);
          return (
            <div key={product.id} className="glass-card fade-in" style={{ padding: '0', overflow: 'hidden' }}>
              <div 
                style={{ height: '140px', background: 'rgba(0,0,0,0.2)', position: 'relative', cursor: 'pointer' }}
                onClick={() => startOrder(product)}
              >
                {product.image ? (
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PlusSquare size={40} color="var(--glass-border)" />
                  </div>
                )}
                <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                  <button 
                    onClick={(e) => deleteProduct(product.id!, e)}
                    style={{ background: 'rgba(239, 68, 68, 0.8)', border: 'none', borderRadius: '8px', padding: '4px', color: 'white' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '12px 8px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{product.name}</h3>
                </div>
              </div>

              <div style={{ padding: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>단가</span>
                    <div style={{ fontWeight: '500' }}>₩{product.costPrice.toLocaleString()}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>판매</span>
                    <div style={{ fontWeight: '500' }}>₩{product.salePrice.toLocaleString()}</div>
                  </div>
                </div>
                
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold' }}>단위 차액</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold' }}>₩{Math.round(margin).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
