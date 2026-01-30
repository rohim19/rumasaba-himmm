import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Trash2, X, AlertTriangle, CheckCircle, RefreshCcw } from 'lucide-react';

const Stok = () => {
  // DATA DEFAULT (Kalau kosong)
  const defaultStok = [
    { id: 1, name: 'Biji Kopi Arabica', stock: 5000, min: 1000, unit: 'gr' },
    { id: 2, name: 'Susu UHT', stock: 200, min: 1000, unit: 'ml' },
    { id: 3, name: 'Gula Aren', stock: 400, min: 500, unit: 'ml' },
    { id: 4, name: 'Cup Plastik 16oz', stock: 45, min: 50, unit: 'pcs' },
    { id: 5, name: 'Sirup Vanilla', stock: 750, min: 200, unit: 'ml' },
    { id: 6, name: 'Gelas cup 100ml', stock: 100, min: 20, unit: 'pcs' },
  ];

  const [stockItems, setStockItems] = useState(() => {
    const saved = localStorage.getItem('rumaSabaStok');
    return saved ? JSON.parse(saved) : defaultStok;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // FORM STATE
  const [formData, setFormData] = useState({ id: null, name: '', stock: '', min: '', unit: 'pcs' });

  // SIMPAN KE LOCALSTORAGE SETIAP ADA PERUBAHAN
  useEffect(() => {
    localStorage.setItem('rumaSabaStok', JSON.stringify(stockItems));
  }, [stockItems]);

  const filteredStok = stockItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- CRUD LOGIC ---
  const handleAddNew = () => {
    setFormData({ id: null, name: '', stock: '', min: '', unit: 'pcs' });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin mau hapus data stok ini?')) {
      setStockItems(stockItems.filter(item => item.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.stock) return alert('Nama dan Jumlah wajib diisi!');

    const finalData = {
        ...formData,
        stock: parseInt(formData.stock),
        min: parseInt(formData.min) || 0
    };

    if (formData.id) {
        // Edit Mode
        setStockItems(stockItems.map(item => item.id === formData.id ? finalData : item));
    } else {
        // Add New Mode
        setStockItems([...stockItems, { ...finalData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  // --- LOGIKA AUTO CAPITALIZE (HURUF DEPAN BESAR) ---
  const handleNameChange = (e) => {
    const val = e.target.value;
    // Ambil huruf pertama jadikan besar, sisanya biarkan (Sentence Case)
    // Contoh: "teh" -> "Teh"
    const capitalized = val.length > 0 ? val.charAt(0).toUpperCase() + val.slice(1) : val;
    setFormData({ ...formData, name: capitalized });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-emerald-600" /> Stok Bahan Baku
          </h1>
          <p className="text-gray-500 text-sm">Monitor persediaan bahan agar tidak kehabisan.</p>
        </div>
        <button onClick={handleAddNew} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
          <Plus size={18} /> Tambah Stok
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm w-full md:w-96 flex gap-3 items-center">
        <Search className="text-gray-400 ml-2" size={20} />
        <input type="text" placeholder="Cari bahan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none text-gray-700 font-medium py-1" />
      </div>

      {/* TABEL STOK */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4">Nama Bahan</th>
                        <th className="px-6 py-4">Kategori</th>
                        <th className="px-6 py-4">Sisa Stok</th>
                        <th className="px-6 py-4">Minimal</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredStok.length === 0 ? (
                        <tr><td colSpan="6" className="p-8 text-center text-gray-400">Data stok tidak ditemukan.</td></tr>
                    ) : (
                        filteredStok.map((item) => {
                            const isLow = parseInt(item.stock) <= parseInt(item.min);
                            return (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-800">{item.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                            {item.unit === 'pcs' || item.unit === 'cup' ? 'Perlengkapan' : 'Bahan Baku'}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 font-bold text-base ${isLow ? 'text-red-600' : 'text-emerald-600'}`}>
                                        {item.stock} <span className="text-xs font-normal text-gray-500">{item.unit}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {item.min} <span className="text-xs">{item.unit}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {isLow ? (
                                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-2.5 py-1 rounded-full text-xs font-bold animate-pulse">
                                                <AlertTriangle size={12}/> Menipis
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold">
                                                <CheckCircle size={12}/> Aman
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16}/></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-gray-800 text-lg">{formData.id ? 'Edit Stok' : 'Tambah Stok Baru'}</h3>
                  <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 space-y-4">
                  {/* INPUT NAMA BAHAN (AUTO CAPITALIZE) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bahan</label>
                    <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-emerald-500 outline-none placeholder:text-gray-300" 
                        value={formData.name} 
                        onChange={handleNameChange} // <--- Logic Auto Capitalize dipanggil disini
                        placeholder="Contoh: Susu UHT" 
                        autoFocus
                    />
                    <p className="text-[10px] text-gray-400 mt-1">*Huruf pertama otomatis besar.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-1">Jumlah Stok</label>
                      <input type="number" className="w-full px-4 py-2 border border-emerald-200 bg-emerald-50 rounded-xl focus:ring-emerald-500 outline-none font-bold text-emerald-700" 
                        value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-emerald-500 outline-none"
                        value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                          <option value="pcs">Pcs (Buah)</option>
                          <option value="gr">Gram (gr)</option>
                          <option value="kg">Kilo (kg)</option>
                          <option value="ml">Mili (ml)</option>
                          <option value="lt">Liter (L)</option>
                          <option value="cup">Cup</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-600 mb-1">Batas Minimal (Alert)</label>
                    <input type="number" className="w-full px-4 py-2 border border-red-200 bg-red-50 rounded-xl focus:ring-red-500 outline-none text-red-700" 
                        value={formData.min} onChange={e => setFormData({...formData, min: e.target.value})} placeholder="Contoh: 10" />
                    <p className="text-xs text-gray-400 mt-1">Jika stok di bawah angka ini, akan muncul peringatan merah.</p>
                  </div>

                  <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 mt-2">
                    Simpan Data
                  </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default Stok;