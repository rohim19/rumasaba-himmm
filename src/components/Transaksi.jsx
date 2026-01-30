import React, { useState, useEffect } from 'react';
import { Receipt, Search, Calendar, ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const Transaksi = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    // Ambil data dari LocalStorage
    const savedTrx = localStorage.getItem('rumaSabaTrx');
    if (savedTrx) {
      setTransactions(JSON.parse(savedTrx));
    }
  }, []);

  // Format Rupiah
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  // Filter Data
  const filteredTrx = transactions.filter(trx => {
    const matchName = trx.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      trx.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter Tanggal (Kalau user pilih tanggal)
    const matchDate = filterDate ? trx.date.startsWith(filterDate) : true;

    return matchName && matchDate;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Receipt className="text-emerald-600" /> Riwayat Transaksi
          </h1>
          <p className="text-gray-500 text-sm">Semua data penjualan (Tunai & Hutang) tercatat di sini.</p>
        </div>

        {/* SEARCH & DATE FILTER */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Input Tanggal */}
            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="date" 
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-emerald-500 outline-none text-gray-600 w-full"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
            </div>

            {/* Input Cari */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Cari nama / status..." 
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-emerald-500 outline-none w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      </div>

      {/* TABEL RIWAYAT */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                <tr>
                    <th className="px-6 py-4">Waktu Transaksi</th>
                    <th className="px-6 py-4">Pelanggan</th>
                    <th className="px-6 py-4">Metode</th>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4 text-center">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {filteredTrx.length === 0 ? (
                    <tr><td colSpan="6" className="p-8 text-center text-gray-400">Belum ada transaksi yang sesuai.</td></tr>
                ) : (
                    filteredTrx.map((trx) => (
                        <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                            {/* Waktu Format Indonesia */}
                            <td className="px-6 py-4 text-gray-600">
                                <div className="font-medium text-gray-800">
                                    {format(new Date(trx.date), 'dd MMMM yyyy', { locale: id })}
                                </div>
                                <div className="text-xs text-gray-400">
                                    Pukul {format(new Date(trx.date), 'HH:mm')} WIB
                                </div>
                            </td>
                            
                            <td className="px-6 py-4 font-bold capitalize text-gray-700">
                                {trx.customerName}
                            </td>

                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-lg text-xs font-bold border 
                                    ${trx.method === 'Tunai' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                    {trx.method}
                                </span>
                            </td>

                            {/* List Item Singkat */}
                            <td className="px-6 py-4 text-gray-500 text-xs">
                                <ul className="space-y-1">
                                    {trx.items.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-1">
                                            <span className="font-bold text-gray-700">{item.qty}x</span> {item.name}
                                        </li>
                                    ))}
                                </ul>
                            </td>

                            <td className="px-6 py-4 font-bold text-gray-800 text-base">
                                {formatRupiah(trx.total)}
                            </td>

                            <td className="px-6 py-4 text-center">
                                {trx.status === 'Lunas' ? (
                                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                                        <ArrowDownLeft size={12} /> Lunas
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                                        <ArrowUpRight size={12} /> Belum Lunas
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>
      </div>

    </div>
  );
};

export default Transaksi;