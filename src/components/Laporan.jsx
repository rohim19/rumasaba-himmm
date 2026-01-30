import React, { useState, useEffect } from 'react';
import { FileBarChart, TrendingUp, Wallet, ArrowDownCircle, ArrowUpCircle, RefreshCcw } from 'lucide-react';

const Laporan = () => {
  const [transactions, setTransactions] = useState([]);
  
  // STATISTIK
  const [totalOmset, setTotalOmset] = useState(0);
  const [totalTunai, setTotalTunai] = useState(0);
  const [totalPiutang, setTotalPiutang] = useState(0);
  const [itemTerlaris, setItemTerlaris] = useState('-');

  useEffect(() => {
    // 1. AMBIL DATA TRANSAKSI
    const savedTrx = localStorage.getItem('rumaSabaTrx');
    if (savedTrx) {
      const data = JSON.parse(savedTrx);
      setTransactions(data);
      hitungLaporan(data);
    }
  }, []);

  const hitungLaporan = (data) => {
    let tunai = 0;
    let piutang = 0;
    let itemCount = {};

    data.forEach(trx => {
        // Hitung Keuangan
        if (trx.method === 'Tunai' || trx.status === 'Lunas') {
            tunai += trx.total;
        } else {
            piutang += trx.total;
        }

        // Hitung Item Terlaris
        trx.items.forEach(item => {
            if (itemCount[item.name]) {
                itemCount[item.name] += item.qty;
            } else {
                itemCount[item.name] = item.qty;
            }
        });
    });

    // Cari item dengan qty tertinggi
    let bestSeller = '-';
    let maxQty = 0;
    for (const [name, qty] of Object.entries(itemCount)) {
        if (qty > maxQty) {
            maxQty = qty;
            bestSeller = name;
        }
    }

    setTotalTunai(tunai);
    setTotalPiutang(piutang);
    setTotalOmset(tunai + piutang);
    setItemTerlaris(bestSeller);
  };

  // Format Rupiah
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  // Fitur Reset Data (Hati-hati)
  const handleResetData = () => {
    if (window.confirm('PERINGATAN: Ini akan MENGHAPUS SEMUA data transaksi & hutang. Yakin?')) {
        localStorage.removeItem('rumaSabaTrx');
        localStorage.removeItem('rumaSabaHutang');
        alert('Semua data keuangan telah di-reset jadi 0.');
        window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileBarChart className="text-emerald-600" /> Laporan Keuangan
          </h1>
          <p className="text-gray-500 text-sm">Rekapitulasi pendapatan warung Ruma Saba.</p>
        </div>
        <button onClick={handleResetData} className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
            <RefreshCcw size={16} /> Reset Data Toko
        </button>
      </div>

      {/* CARD STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TOTAL OMSET (Gabungan) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                <TrendingUp size={32} />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">Total Omset (Kotor)</p>
                <h3 className="text-2xl font-bold text-gray-800">{formatRupiah(totalOmset)}</h3>
            </div>
        </div>

        {/* UANG MASUK (Tunai) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
                <Wallet size={32} />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">Uang Masuk (Tunai)</p>
                <h3 className="text-2xl font-bold text-emerald-600">{formatRupiah(totalTunai)}</h3>
            </div>
        </div>

        {/* UANG TERTUNDA (Piutang) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-orange-50 text-orange-600 rounded-xl">
                <ArrowDownCircle size={32} />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">Piutang (Belum Lunas)</p>
                <h3 className="text-2xl font-bold text-orange-600">{formatRupiah(totalPiutang)}</h3>
            </div>
        </div>
      </div>

      {/* DETAIL TAMBAHAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-600 text-white p-8 rounded-3xl shadow-lg shadow-emerald-200 flex flex-col justify-center items-center text-center">
              <div className="mb-4 p-3 bg-white/20 rounded-full"><ArrowUpCircle size={40} /></div>
              <h4 className="text-emerald-100 font-medium mb-1">Menu Paling Laris</h4>
              <h2 className="text-3xl font-bold">{itemTerlaris}</h2>
              <p className="text-emerald-100 text-sm mt-4">Pertahankan stok untuk menu ini!</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Ringkasan Transaksi</h3>
              <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <span className="text-gray-500">Jumlah Transaksi</span>
                      <span className="font-bold text-gray-800">{transactions.length} Order</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <span className="text-gray-500">Rata-rata per Order</span>
                      <span className="font-bold text-gray-800">
                          {transactions.length > 0 ? formatRupiah(totalOmset / transactions.length) : 'Rp 0'}
                      </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                      <span className="text-gray-500">Kesehatan Keuangan</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold 
                          ${totalPiutang > totalTunai ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {totalPiutang > totalTunai ? 'Waspada (Banyak Hutang)' : 'Sehat (Aman)'}
                      </span>
                  </div>
              </div>
          </div>
      </div>

    </div>
  );
};

export default Laporan;