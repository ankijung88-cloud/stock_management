import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, Settings as SettingsIcon, Package, Users } from 'lucide-react';
import Dashboard from './components/Dashboard.tsx';
import OrderEntry from './components/OrderEntry.tsx';
import OrderList from './components/OrderList.tsx';
import Settings from './components/Settings.tsx';
import ProductList from './components/ProductList.tsx';
import CustomerList from './components/CustomerList.tsx';
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
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>

        <nav className="nav-bar">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={24} />
            <span>홈</span>
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Package size={24} />
            <span>품목</span>
          </NavLink>
          <NavLink to="/add" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <PlusCircle size={24} />
            <span>입력</span>
          </NavLink>
          <NavLink to="/customers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={24} />
            <span>고객</span>
          </NavLink>
          <NavLink to="/list" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <List size={24} />
            <span>내역</span>
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
