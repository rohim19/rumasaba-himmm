import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Users, AlertCircle, ArrowRight, Package, AlertTriangle, Wallet } from 'lucide-react';

const Dashboard = () => {
  const [stockInventory, setStockInventory] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  
  const [summary, setSummary] = useState({
    omset: 0,
    laba: 0,
    orders: 0,
    customers: 0,
    hutang: 0,
    hutangCount: 0
  });

  useEffect(() => {
    // 1. AMBIL STOK
    const savedStok = localStorage.getItem('rumaSabaStok');
    if (savedStok) setStockInventory(JSON.parse(savedStok));

    // 2. AMBIL MASTER MENU (Buat referensi HPP)
    const savedMenu = localStorage.getItem('rumaSabaMenu');
    const masterMenu = savedMenu ? JSON.parse(savedMenu) : [];

    // 3. AMBIL TRANSAKSI
    const savedTrx = localStorage.getItem('rumaSabaTrx');
    if (savedTrx) {
        const allTrx = JSON.parse(savedTrx);

        // A. FILTER DATA HARI INI
        const today = new Date().toDateString(); 
        const todayTrx = allTrx.filter(t => new Date(t.date).toDateString() === today);

        // B. FILTER: AMBIL CUMA YANG LUNAS (UANG MASUK)
        // Hutang tidak akan dihitung ke Omset/Laba sebelum statusnya berubah jadi 'Lunas'
        const paidTrx = todayTrx.filter(t => t.status === 'Lunas');

        // C. HITUNG OMSET (Cuma dari yang Lunas)
        const omsetToday = paidTrx.reduce((acc, curr) => acc + curr.total, 0);

        // D. HITUNG LABA BERSIH (Cuma dari yang Lunas)
        let totalLaba = 0;
        paidTrx.forEach(trx => {
            trx.items.forEach(trxItem => {
                const masterItem = masterMenu.find(m => m.id === trxItem.id) || masterMenu.find(m => m.name === trxItem.name);
                const currentHpp = masterItem ? (masterItem.hpp || 0) : (trxItem.hpp || 0);
                const margin = trxItem.price - currentHpp;
                totalLaba += (margin * trxItem.qty);
            });
        });

        // E. HITUNG PELANGGAN (Semua transaksi hari ini, termasuk yang hutang tetap dihitung sbg pengunjung)
        const uniqueCustomers = new Set(todayTrx.map(t => t.customerName)).size;
        
        // F. HITUNG TOTAL HUTANG (Semua Waktu)
        const unpaidTrx = allTrx.filter(t => t.status === 'Belum Lunas');
        const totalHutang = unpaidTrx.reduce((acc, curr) => acc + curr.total, 0);

        setSummary({
            omset: omsetToday,
            laba: totalLaba, 
            orders: todayTrx.length, // Total order tetap nambah (untuk traffic)
            customers: uniqueCustomers,
            hutang: totalHutang,
            hutangCount: unpaidTrx.length
        });

        setRecentOrders(allTrx.slice(0, 5));
    }
  }, []);

  const lowStockItems = stockInventory.filter(item => parseInt(item.stock) <= parseInt(item.min));
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const stats = [
    { 
        title: 'Omset Hari Ini', 
        value: formatRupiah(summary.omset), 
        icon: <TrendingUp size={24} />, 
        color: 'bg-emerald-500', 
        trend: 'Cash In (Lunas Only)' // <-- Penjelasan: Cuma Uang Masuk
    },
    { 
        title: 'Laba Bersih', 
        value: formatRupiah(summary.laba), 
        icon: <Wallet size={24} />, 
        color: 'bg-teal-500', 
        trend: 'Realized Profit' 
    },
    { title: 'Total Order', value: `${summary.orders} Pesanan`, icon: <ShoppingBag size={24} />, color: 'bg-blue-500', trend: 'Transaksi hari ini' },
    { title: 'Pelanggan', value: `${summary.customers} Orang`, icon: <Users size={24} />, color: 'bg-indigo-500', trend: 'Aktif hari ini' },
    { title: 'Catatan Hutang', value: formatRupiah(summary.hutang), icon: <AlertCircle size={24} />, color: 'bg-orange-500', trend: `${summary.hutangCount} Orang belum lunas` },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Utama</h1>
        <p className="text-gray-500 text-sm">Ringkasan penjualan & status stok terkini.</p>
      </div>

      {/* ALERT STOK */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center animate-pulse">
            <div className="p-3 bg-red-100 rounded-xl text-red-600"><AlertTriangle size={24} /></div>
            <div className="flex-1">
                <h3 className="text-red-800 font-bold text-lg">Peringatan Stok Menipis!</h3>
                <p className="text-red-600 text-sm">Ada <span className="font-bold">{lowStockItems.length} barang</span> yang stoknya kritis ({lowStockItems.map(i => i.name).join(', ')}).</p>
            </div>
            <a href="/stok" className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors shadow-sm">Atur Stok</a>
        </div>
      )}

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-xl font-bold text-gray-800 mt-1 truncate">{stat.value}</h3>
              </div>
              <div className={`p-2.5 rounded-xl text-white ${stat.color} shadow-lg shadow-opacity-20`}>{stat.icon}</div>
            </div>
            <div className="mt-3 flex items-center text-xs text-gray-400">
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full mr-2">Info</span>
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* SECTION BAWAH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TABEL TRANSAKSI */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="font-bold text-gray-800">Transaksi Terakhir</h2>
                <a href="/transaksi" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">Lihat Semua <ArrowRight size={16}/></a>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Waktu</th>
                            <th className="px-6 py-4">Pelanggan</th>
                            <th className="px-6 py-4">Detail Pesanan</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {recentOrders.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-400">Belum ada transaksi hari ini.</td></tr>
                        ) : (
                            recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800 capitalize">{order.customerName}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex flex-col gap-1">
                                            {order.items.map((item, idx) => (
                                                <span key={idx} className="text-xs">
                                                    <span className="font-bold">{item.qty}x</span> {item.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold">{formatRupiah(order.total)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Lunas' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* MONITORING STOK */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Package size={20} className="text-gray-400"/> Status Stok</h2>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {stockInventory.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                        <div><p className="text-sm font-medium text-gray-800">{item.name}</p><p className="text-xs text-gray-400">Min: {item.min} {item.unit}</p></div>
                        <div className="text-right">
                            <p className={`text-sm font-bold ${parseInt(item.stock) <= parseInt(item.min) ? 'text-red-600' : 'text-emerald-600'}`}>{item.stock} <span className="text-xs font-normal text-gray-400">{item.unit}</span></p>
                            {parseInt(item.stock) <= parseInt(item.min) && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Restock!</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;