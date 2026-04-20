import React from 'react';
import { db } from '../db/db.ts';
import { Download, Upload, Trash2, Info, Globe } from 'lucide-react';

const Settings: React.FC = () => {
  const exportData = async () => {
    const orders = await db.orders.toArray();
    const products = await db.products.toArray();
    const data = JSON.stringify({ orders, products }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profit_master_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        
        // Handle both old format (array of orders) and new format (object with orders/products)
        let ordersToImport = [];
        let productsToImport = [];

        if (Array.isArray(parsed)) {
          ordersToImport = parsed;
        } else if (parsed.orders || parsed.products) {
          ordersToImport = parsed.orders || [];
          productsToImport = parsed.products || [];
        }

        if (window.confirm(`데이터를 가져오시겠습니까?\n주문: ${ordersToImport.length}건, 품목: ${productsToImport.length}건`)) {
          if (ordersToImport.length > 0) await db.orders.bulkAdd(ordersToImport);
          if (productsToImport.length > 0) await db.products.bulkAdd(productsToImport);
          alert('데이터를 성공적으로 가져왔습니다.');
          window.location.reload();
        }
      } catch (err) {
        alert('잘못된 파일 형식입니다.');
      }
    };
    reader.readAsText(file);
  };

  const clearData = async () => {
    if (window.confirm('모든 데이터(주문 내역 및 품목 리스트)가 영구적으로 삭제됩니다. 계속하시겠습니까?')) {
      await db.orders.clear();
      await db.products.clear();
      alert('모든 데이터가 초기화되었습니다.');
      window.location.reload();
    }
  };

  const Card = ({ title, description, icon: Icon, onClick, color, children }: any) => (
    <div className="glass-card fade-in" style={{ marginBottom: '1rem' }} onClick={onClick}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ padding: '0.75rem', borderRadius: '12px', background: `${color}20`, color }}>
          <Icon size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.125rem' }}>{title}</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>{description}</p>
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>설정</h1>
        <p style={{ color: 'var(--text-dim)' }}>데이터 관리 및 앱 정보</p>
      </header>

      <Card 
        title="데이터 내보내기" 
        description="모든 주문 내역과 품목 리스트를 JSON 파일로 저장합니다." 
        icon={Download} 
        color="#10b981"
        onClick={exportData}
      />

      <label style={{ display: 'block', cursor: 'pointer' }}>
        <input type="file" style={{ display: 'none' }} accept=".json" onChange={importData} />
        <Card 
          title="데이터 가져오기" 
          description="백업된 JSON 파일로부터 데이터를 복구합니다." 
          icon={Upload} 
          color="#6366f1"
        />
      </label>

      <Card 
        title="데이터 초기화" 
        description="모든 데이터를 삭제하고 앱을 초기 상태로 돌립니다." 
        icon={Trash2} 
        color="#ef4444"
        onClick={clearData}
      />

      <div className="glass-card" style={{ marginTop: '2rem', borderStyle: 'dashed' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
          <Info size={20} />
          <h3 style={{ fontSize: '1rem' }}>PWA 정보</h3>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
          이 앱은 브라우저의 IndexedDB를 사용하여 데이터를 안전하게 로컬에 저장합니다. 
          별도의 서버가 없으므로 정기적으로 백업 파일을 생성하는 것을 권장합니다.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <a href="https://github.com/ankijung88-cloud/stock_management.git" target="_blank" rel="noreferrer" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.875rem' }}>
            <Globe size={18} />
            GitHub에서 프로젝트 소스 보기
          </a>
        </div>
      </div>
    </div>
  );
};

export default Settings;
