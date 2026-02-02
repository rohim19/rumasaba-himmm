import React, { useState, useEffect } from 'react';
import { CreditCard, Search, CheckCircle, AlertCircle, X, Wallet, ArrowRight } from 'lucide-react';

const Hutang = () => {
  const [debts, setDebts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // STATE MODAL
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, data: null });
  const [successModal, setSuccessModal] = useState(false);

  // 1. AMBIL DATA DARI SUMBER UTAMA (TRANSAKSI)
  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = () => {
    const allTrx = JSON.parse(localStorage.getItem('rumaSabaTrx') || '[]');
    // Filter: Ambil cuma yang statusnya 'Belum Lunas'
    const unpaidDebts = allTrx.filter(trx => trx.status === 'Belum Lunas');
    setDebts(unpaidDebts);
  };

  // 👇 2. FUNGSI CCTV (LOGGER)
  const logActivity = (action, change) => {
    const user = localStorage.getItem('userRumaSaba') || 'Envy';
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleString('id-ID'),
      username: user,
      activity: action,
      change: change
    };
    const currentLogs = JSON.parse(localStorage.getItem('rumaSabaLogs') || '[]');
    localStorage.setItem('rumaSabaLogs', JSON.stringify([newLog, ...currentLogs]));
  };

  // 3. FUNGSI BUKA MODAL KONFIRMASI
  const openConfirmLunas = (debt) => {
    setConfirmModal({ isOpen: true, data: debt });
  };

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  // 4. FUNGSI PROSES PELUNASAN (EKSEKUSI)
  const processLunas = () => {
    const debt = confirmModal.data;
    if (!debt) return;

    // Ambil data utama lagi
    const allTrx = JSON.parse(localStorage.getItem('rumaSabaTrx') || '[]');
    
    // Cari transaksi tsb dan ubah status jadi 'Lunas'
    const updatedTrx = allTrx.map(trx => 
        trx.id === debt.id ? { ...trx, status: 'Lunas' } : trx
    );

    // Simpan balik ke LocalStorage Utama
    localStorage.setItem('rumaSabaTrx', JSON.stringify(updatedTrx));

    // Update tampilan di layar (Hapus dari daftar hutang)
    setDebts(debts.filter(d => d.id !== debt.id));
    
    // 👇 5. REKAM KE ACTIVITY LOG
    logActivity('Pelunasan Hutang', `Melunasi hutang ${debt.customerName} sebesar ${formatRupiah(debt.total)}`);

    // Tutup confirm, Buka sukses
    setConfirmModal({ isOpen: false, data: null });
    setSuccessModal(true);

    // Auto tutup sukses setelah 2 detik
    setTimeout(() => {
        setSuccessModal(false);
    }, 2000);
  };

  const filteredDebts = debts.filter(d => 
    d.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CreditCard className="text-orange-500" /> Catatan Hutang (Bon)
          </h1>
          <p className="text-gray-500 text-sm">Daftar pelanggan yang belum lunas (Data dari Riwayat Transaksi).</p>
        </div>
        
        {/* SEARCH */}
        <div className="relative w-full sm:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input type="text" placeholder="Cari nama..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-orange-500 outline-none" />
        </div>
      </div>

      {/* TABEL HUTANG */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-orange-50 text-orange-800 font-bold">
                    <tr>
                        <th className="px-6 py-4">Tanggal</th>
                        <th className="px-6 py-4">Nama Pelanggan</th>
                        <th className="px-6 py-4">Detail Pesanan</th>
                        <th className="px-6 py-4">Total Hutang</th>
                        <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredDebts.length === 0 ? (
                        <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                            <div className="flex flex-col items-center gap-2">
                                <CheckCircle size={32} className="text-emerald-200"/>
                                <p>Tidak ada catatan hutang. Aman bos! 👍</p>
                            </div>
                        </td></tr>
                    ) : (
                        filteredDebts.map(debt => (
                            <tr key={debt.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-gray-500">{new Date(debt.date).toLocaleDateString('id-ID')}</td>
                                <td className="px-6 py-4 font-bold text-gray-800 capitalize">{debt.customerName}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    <ul className="list-disc list-inside text-xs">
                                        {debt.items.map((item, idx) => (
                                            <li key={idx}>{item.qty}x {item.name}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-6 py-4 font-bold text-orange-600 text-base">{formatRupiah(debt.total)}</td>
                                <td className="px-6 py-4 text-center">
                                    {/* TOMBOL BUKA MODAL */}
                                    <button onClick={() => openConfirmLunas(debt)} 
                                        className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 mx-auto shadow-sm active:scale-95">
                                        <CheckCircle size={14} /> Tandai Lunas
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* --- MODAL 1: KONFIRMASI PELUNASAN --- */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center transform transition-all scale-100">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
                    <Wallet size={32} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Pelunasan</h3>
                <p className="text-gray-500 text-sm mb-6">
                    Apakah pelanggan <span className="font-bold text-gray-800 capitalize">{confirmModal.data.customerName}</span> sudah membayar lunas sebesar <span className="font-bold text-orange-600">{formatRupiah(confirmModal.data.total)}</span>?
                </p>

                <div className="flex gap-3">
                    <button onClick={() => setConfirmModal({ isOpen: false, data: null })} 
                        className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                        Batal
                    </button>
                    <button onClick={processLunas} 
                        className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
                        Ya, Lunas <CheckCircle size={18}/>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODAL 2: SUKSES (AUTO CLOSE) --- */}
      {successModal && (
        <div className="fixed inset-0 bg-black/10 z-[60] flex items-center justify-center pointer-events-none">
            <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl flex items-center gap-4 animate-in zoom-in-95 slide-in-from-bottom-10 duration-300 border border-emerald-100">
                <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                    <CheckCircle size={32} />
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 text-lg">Berhasil Dilunasi!</h4>
                    <p className="text-gray-500 text-sm">Data hutang telah dihapus & masuk ke Omset.</p>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default Hutang;