import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, Settings as SettingsIcon, Package } from 'lucide-react';
import Dashboard from './components/Dashboard.tsx';
import OrderEntry from './components/OrderEntry.tsx';
import OrderList from './components/OrderList.tsx';
import Settings from './components/Settings.tsx';
import ProductList from './components/ProductList.tsx';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-height-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<OrderEntry />} />
          <Route path="/list" element={<OrderList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>

        <nav className="nav-bar">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={24} />
            <span>대시보드</span>
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Package size={24} />
            <span>품목관리</span>
          </NavLink>
          <NavLink to="/add" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <PlusCircle size={24} />
            <span>주문입력</span>
          </NavLink>
          <NavLink to="/list" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <List size={24} />
            <span>주문내역</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <SettingsIcon size={24} />
            <span>설정</span>
          </NavLink>
        </nav>
      </div>
    </Router>
  );
};

export default App;
