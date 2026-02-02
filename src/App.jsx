import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Stok from './components/Stok'; 
import Menu from './components/Menu'; 
import Kasir from './components/Kasir';
import Hutang from './components/Hutang';
import Transaksi from './components/Transaksi';
import Laporan from './components/Laporan';
import ActivityLog from './components/ActivityLog'; 

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} /> 
        <Route path="kasir" element={<Kasir />} />
        <Route path="transaksi" element={<Transaksi/>} />
        <Route path="hutang" element={<Hutang />} />
        <Route path="menu" element={<Menu />} /> 
        <Route path="stok" element={<Stok />} /> 
        <Route path="laporan" element={<Laporan />} />
        <Route path="activity-log" element={<ActivityLog />} />
      </Route>
    </Routes>
  );
}

export default App;