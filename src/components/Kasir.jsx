import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, User, FileText, X, CheckCircle, Printer, ArrowRight, Save, QrCode } from 'lucide-react';
import qrisImage from '../assets/qris-toko.jpg';
const Kasir = () => {
  // 1. AMBIL DATA MENU
  const [menuItems, setMenuItems] = useState([]);


  useEffect(() => {
    const savedMenu = localStorage.getItem('rumaSabaMenu');
    if (savedMenu) setMenuItems(JSON.parse(savedMenu));
  }, []);

  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // STATE MODAL & PEMBAYARAN
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Tunai'); 
  const [customerName, setCustomerName] = useState('');
  const [cashIn, setCashIn] = useState(''); 
  
  // STATE STRUK
  const [receiptData, setReceiptData] = useState(null); 

  const categories = ['All', 'Coffee', 'Non-Coffee', 'Tea', 'Snack'];

  // --- FUNGSI KERANJANG ---
  const addToCart = (item) => {
    const existingItem = cart.find((c) => c.id === item.id);
    if (existingItem) {
      setCart(cart.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const updateQty = (id, amount) => {
    setCart(cart.map((item) => {
      if (item.id === id) {
        const newQty = item.qty + amount;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal;

  // HITUNG KEMBALIAN & VALIDASI
  const uangMasuk = parseInt(cashIn) || 0;
  // Kalau QRIS, kembalian selalu 0
  const kembalian = paymentMethod === 'Tunai' ? uangMasuk - total : 0;
  const isBayarKurang = paymentMethod === 'Tunai' && uangMasuk < total;

  const filteredMenu = menuItems.filter(item => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

  // --- LOGGER CCTV ---
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

  const handleOpenPayment = () => {
    if (cart.length > 0) {
        setPaymentModalOpen(true);
        setPaymentMethod('Tunai');
        setCustomerName('');
        setCashIn(''); 
    }
  };

  // --- LOGIC TRANSAKSI ---
  const processTransaction = () => {
    // Validasi
    if (paymentMethod === 'Hutang' && !customerName.trim()) return alert("Nama wajib diisi buat yang ngutang!");
    if (paymentMethod === 'Tunai' && isBayarKurang) return alert("Uang pembayarannya kurang bro!");

    const finalCustomerName = customerName.trim() || 'Umum';

    // Tentukan Uang Masuk (Kalau QRIS/Hutang dianggap pas sesuai total)
    const finalCashIn = paymentMethod === 'Tunai' ? uangMasuk : total;
    const finalChange = paymentMethod === 'Tunai' ? kembalian : 0;

    const transactionData = {
        id: Date.now(),
        date: new Date().toISOString(), 
        items: cart,
        total: total,
        method: paymentMethod,
        customerName: finalCustomerName,
        cashIn: finalCashIn, 
        change: finalChange,     
        status: paymentMethod === 'Hutang' ? 'Belum Lunas' : 'Lunas'
    };

    // 1. SIMPAN RIWAYAT
    const existingTrx = JSON.parse(localStorage.getItem('rumaSabaTrx') || '[]');
    localStorage.setItem('rumaSabaTrx', JSON.stringify([transactionData, ...existingTrx]));

    if (paymentMethod === 'Hutang') {
        const existingDebts = JSON.parse(localStorage.getItem('rumaSabaHutang') || '[]');
        localStorage.setItem('rumaSabaHutang', JSON.stringify([...existingDebts, transactionData]));
    }

    // 2. POTONG STOK OTOMATIS
    const currentStocks = JSON.parse(localStorage.getItem('rumaSabaStok') || '[]');
    let isStockUpdated = false;

    cart.forEach(cartItem => {
        if (cartItem.recipe && cartItem.recipe.length > 0) {
            cartItem.recipe.forEach(ingredient => {
                const stockIndex = currentStocks.findIndex(s => s.id === ingredient.stockId);
                if (stockIndex !== -1) {
                    const totalDeduction = ingredient.qty * cartItem.qty;
                    currentStocks[stockIndex].stock -= totalDeduction;
                    isStockUpdated = true;
                }
            });
        }
    });

    if(isStockUpdated) {
        localStorage.setItem('rumaSabaStok', JSON.stringify(currentStocks));
    }

    // 3. CATAT LOG
    logActivity('Transaksi Baru', `Penjualan ${paymentMethod} senilai ${formatRupiah(total)}`);

    // 4. RESET & BUKA STRUK
    setPaymentModalOpen(false);
    setReceiptData(transactionData); 
    setCart([]);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* KIRI: MENU */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="flex flex-col gap-4">
            <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex gap-3 items-center">
                <Search className="text-gray-400 ml-2" size={20} />
                <input type="text" placeholder="Cari menu..." className="w-full outline-none text-gray-700 font-medium"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {categories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all
                        ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}>
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-20">
                {filteredMenu.map((item) => (
                    <div key={item.id} onClick={() => addToCart(item)}
                        className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 cursor-pointer transition-all group flex flex-col items-center text-center h-full">
                        <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{item.image || (item.category === 'Coffee' ? '☕' : '🍹')}</div>
                        <h3 className="font-bold text-gray-800 text-sm line-clamp-2">{item.name}</h3>
                        <p className="text-emerald-600 font-bold mt-auto pt-2">{formatRupiah(item.price)}</p>
                    </div>
                ))}
            </div>
            {filteredMenu.length === 0 && <div className="text-center text-gray-400 mt-10">Menu tidak ditemukan.</div>}
        </div>
      </div>

      {/* KANAN: KERANJANG */}
      <div className="w-full lg:w-96 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <ShoppingCart className="text-emerald-600" /> Detail Pesanan
            </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                    <ShoppingCart size={48} className="mb-2" /> <p>Keranjang kosong</p>
                </div>
            ) : (
                cart.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center bg-white p-2 rounded-xl border border-gray-50">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">{item.image || (item.category === 'Coffee' ? '☕' : '🍹')}</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                            <p className="text-emerald-600 text-xs font-bold">{formatRupiah(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 bg-white rounded shadow-sm flex items-center justify-center text-gray-600 hover:text-red-500"><Minus size={14} /></button>
                            <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 bg-white rounded shadow-sm flex items-center justify-center text-gray-600 hover:text-emerald-600"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 size={18} /></button>
                    </div>
                ))
            )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between font-bold text-gray-800 text-lg pt-2 border-t border-gray-200">
                    <span>Total</span> <span>{formatRupiah(total)}</span>
                </div>
            </div>
            <button onClick={handleOpenPayment} disabled={cart.length === 0} 
                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95
                ${cart.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200'}`}>
                <CreditCard size={20} /> Bayar Sekarang
            </button>
        </div>
      </div>

      {/* --- MODAL PEMBAYARAN --- */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all scale-100">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800 text-lg">Metode Pembayaran</h3>
                    <button onClick={() => setPaymentModalOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Total Tagihan</p>
                        <h2 className="text-3xl font-bold text-emerald-600 mt-1">{formatRupiah(total)}</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {['Tunai', 'QRIS', 'Hutang'].map(method => (
                             <button key={method} onClick={() => setPaymentMethod(method)}
                                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all
                                ${paymentMethod === method 
                                    ? (method === 'Hutang' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-emerald-500 bg-emerald-50 text-emerald-700') 
                                    : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-50'}`}>
                                {method === 'Tunai' && <CreditCard size={20} />}
                                {method === 'QRIS' && <QrCode size={20} />}
                                {method === 'Hutang' && <FileText size={20} />}
                                <span className="font-bold text-xs">{method}</span>
                            </button>
                        ))}
                    </div>

                    {/* --- KONTEN DINAMIS BERDASARKAN METODE --- */}
                    
                    {/* 1. TUNAI */}
                    {paymentMethod === 'Tunai' && (
                        <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Uang Diterima (Cash)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">Rp</span>
                                    <input type="number" 
                                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-emerald-500 outline-none font-bold text-gray-800"
                                        placeholder="0" value={cashIn} onChange={e => setCashIn(e.target.value)} autoFocus
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-t border-dashed border-gray-300 pt-2">
                                <span className="text-xs font-bold text-gray-500">Kembalian</span>
                                <span className={`text-lg font-black ${kembalian < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                    {formatRupiah(kembalian)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* 2. QRIS (TAMPILKAN GAMBAR) */}
                    {paymentMethod === 'QRIS' && (
                        <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                            <p className="text-xs font-bold text-gray-500 mb-2">Scan QRIS Ruma Saba</p>
                            <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden mb-2">
                                {/* GANTI SRC INI DENGAN LINK QRIS TOKOMU */}
                                <img src={qrisImage} alt="QRIS Code" className="w-full h-full object-cover p-2" />
                            </div>
                            <p className="text-[10px] text-gray-400">Pastikan nominal transfer sesuai: <b>{formatRupiah(total)}</b></p>
                        </div>
                    )}

                    {/* 3. INPUT NAMA PELANGGAN (Wajib utk Hutang) */}
                    {(paymentMethod === 'Tunai' || paymentMethod === 'Hutang') && (
                        <div className="animate-in slide-in-from-top-2 duration-200">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Pelanggan {paymentMethod === 'Tunai' ? <span className="text-gray-400 font-normal">(Opsional)</span> : <span className="text-red-500 font-bold">*Wajib</span>}
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text"
                                    placeholder={paymentMethod === 'Tunai' ? "Contoh: Pak Budi (Boleh kosong)" : "Masukkan nama pengutang..."}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-colors
                                    ${paymentMethod === 'Hutang' ? 'border-orange-300 bg-orange-50/30' : 'border-gray-300 focus:ring-emerald-500'}`}
                                    value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <button onClick={processTransaction} 
                        className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2
                        ${paymentMethod === 'Hutang' 
                            ? (!customerName.trim() ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600') 
                            : (paymentMethod === 'Tunai' && isBayarKurang ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700')}`}>
                        
                        {paymentMethod === 'Hutang' && <Save size={18}/>}
                        {paymentMethod === 'Tunai' && <CheckCircle size={18}/>}
                        {paymentMethod === 'QRIS' && <CheckCircle size={18}/>}

                        {paymentMethod === 'Hutang' ? 'Simpan Hutang' : (paymentMethod === 'QRIS' ? 'Cek Mutasi & Konfirmasi' : 'Proses Bayar')}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODAL STRUK (RECEIPT STYLE) --- */}
      {receiptData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
            <div className="bg-white w-full max-w-xs shadow-2xl overflow-hidden relative font-mono text-sm">
                
                {/* Kertas Struk */}
                <div className="p-6 bg-white relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[linear-gradient(90deg,transparent_50%,#fff_50%)] bg-[length:10px_10px]"></div>

                    <div className="text-center mb-4 border-b-2 border-dashed border-gray-200 pb-4">
                        <h2 className="font-black text-xl uppercase tracking-widest">RUMA SABA</h2>
                        <p className="text-[10px] text-gray-500">Jl. Kopi Nikmat No. 1</p>
                        <p className="text-[10px] text-gray-500">{new Date(receiptData.date).toLocaleString('id-ID')}</p>
                    </div>

                    <div className="space-y-2 mb-4 border-b-2 border-dashed border-gray-200 pb-4">
                        {receiptData.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                                <span>{item.qty}x {item.name}</span>
                                <span>{formatRupiah(item.price * item.qty)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-1 mb-6">
                        <div className="flex justify-between font-bold text-lg">
                            <span>TOTAL</span>
                            <span>{formatRupiah(receiptData.total)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-xs">
                            <span>Bayar ({receiptData.method})</span>
                            <span>{formatRupiah(receiptData.cashIn)}</span>
                        </div>
                        {receiptData.method === 'Tunai' && (
                            <div className="flex justify-between text-gray-800 font-bold border-t border-dashed border-gray-200 pt-1 mt-1">
                                <span>KEMBALI</span>
                                <span>{formatRupiah(receiptData.change)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-xs mt-2 text-gray-400 pt-2">
                            <span>Pelanggan</span>
                            <span className="capitalize">{receiptData.customerName}</span>
                        </div>
                    </div>

                    <div className="text-center text-[10px] text-gray-400 mt-4">
                        <p>*** TERIMA KASIH ***</p>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="bg-gray-800 p-4 flex gap-2">
                    <button onClick={() => setReceiptData(null)} className="flex-1 py-2 bg-gray-700 text-white rounded font-bold hover:bg-gray-600 transition-colors">Tutup</button>
                    <button onClick={() => window.print()} className="flex-1 py-2 bg-white text-gray-900 rounded font-bold hover:bg-gray-100 transition-colors flex justify-center items-center gap-2">
                        <Printer size={16}/> Print
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Kasir;