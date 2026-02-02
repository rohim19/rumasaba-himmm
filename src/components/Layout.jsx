import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Receipt, CreditCard, UtensilsCrossed, FileBarChart, User, Clock, Key, LogOut, Package, History } from 'lucide-react';
import { format } from 'date-fns'; 
import logoSaba from '../assets/logo.png';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ambil nama user
  const username = localStorage.getItem('userRumaSaba');

  useEffect(() => {
    if (!username) {
      navigate('/login');
    }
  }, [username, navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const closeDropdown = (e) => {
        if (!e.target.closest('#user-dropdown-trigger')) {
            setIsDropdownOpen(false);
        }
    };
    document.addEventListener('click', closeDropdown);
    return () => {
        clearInterval(timer);
        document.removeEventListener('click', closeDropdown);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRumaSaba'); 
    navigate('/login'); 
  };

  const menus = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Kasir', path: '/kasir', icon: <ShoppingCart size={20} /> },
    { name: 'Transaksi', path: '/transaksi', icon: <Receipt size={20} /> },
    { name: 'Hutang', path: '/hutang', icon: <CreditCard size={20} /> },
    { name: 'Menu', path: '/menu', icon: <UtensilsCrossed size={20} /> },
    { name: 'Stok Bahan', path: '/stok', icon: <Package size={20} /> },
    { name: 'Activity Log', path: '/activity-log', icon: <History size={20} /> },
    { name: 'Laporan', path: '/laporan', icon: <FileBarChart size={20} /> },
  ];

  
  if (!username) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 flex flex-col">
        <div className="h-16 flex items-center px-8 border-b border-gray-100">
          <img src={logoSaba} alt="Logo Ruma Saba" className="w-48 h-auto max-h-40 object-contain" />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menus.map((menu) => (
            <Link key={menu.name} to={menu.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
              ${location.pathname === menu.path ? 'bg-emerald-50 text-emerald-600 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}>
              {menu.icon} <span>{menu.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* KONTEN KANAN */}
      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20 px-8 flex justify-end items-center">
          <div className="flex items-center gap-6">
            
            {/* JAM */}
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200">
              <Clock size={14} className="text-gray-400" /> 
              <span className="font-medium text-gray-600">
                  Timezone Asia/Jakarta GMT+7 - {format(currentTime, 'EEE dd MMM HH.mm')}
              </span>
            </div>

            {/* USER PROFILE AREA */}
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200 h-8 relative">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800 capitalize">{username}</p>
              </div>
              
              {/* AVATAR TRIGGER & DROPDOWN MENU */}
              <div className="relative" id="user-dropdown-trigger">
                <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border cursor-pointer transition-all
                    ${isDropdownOpen ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-emerald-100 text-emerald-600 border-emerald-200 hover:bg-emerald-200'}`}
                >
                    <User size={18} />
                </div>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="absolute -top-2 right-3 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                             <p className="text-xs text-gray-400">Login sebagai</p>
                             <p className="font-bold text-gray-800 capitalize truncate">{username}</p>
                        </div>
                        <button onClick={() => setIsDropdownOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left">
                            <Key size={18} className="text-gray-400" /> Ubah Password
                        </button>
                        <div className="my-1 border-t border-gray-50"></div>
                        <button 
                            onClick={handleLogout} 
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left rounded-b-2xl"
                        >
                            <LogOut size={18} /> Keluar
                        </button>
                    </div>
                )}
              </div>
            </div>

          </div>
        </header>

        <main className="p-8 flex-1 overflow-auto"><Outlet /></main>
      </div>
    </div>
  );
};
export default Layout;