import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Plus, Search, Edit2, Trash2, X, Save, TrendingUp } from 'lucide-react';

const Menu = () => {
  // DATA DEFAULT
  const defaultMenu = [
    { id: 1, name: 'Kopi Susu Gula Aren', price: 18000, hpp: 10000, category: 'Coffee', status: 'Tersedia', image: '☕' },
    { id: 2, name: 'Nasi Goreng Spesial', price: 25000, hpp: 15000, category: 'Food', status: 'Tersedia', image: '🍛' },
  ];

  const [menuItems, setMenuItems] = useState(() => {
    const savedMenu = localStorage.getItem('rumaSabaMenu');
    return savedMenu ? JSON.parse(savedMenu) : defaultMenu;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // STATE FORM (TAMBAH HPP DISINI)
  const [formData, setFormData] = useState({ 
    id: null, name: '', price: '', hpp: '', category: 'Coffee', status: 'Tersedia' 
  });

  const categories = ['All', 'Coffee', 'Non-Coffee', 'Food', 'Snack'];

  useEffect(() => {
    localStorage.setItem('rumaSabaMenu', JSON.stringify(menuItems));
  }, [menuItems]);

  const filteredMenu = menuItems.filter(item => {
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // --- CRUD LOGIC ---
  const handleAddNew = () => {
    // Reset form termasuk hpp
    setFormData({ id: null, name: '', price: '', hpp: '', category: 'Coffee', status: 'Tersedia' });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus menu ini?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return alert('Nama dan Harga wajib diisi!');

    // Pastikan HPP diisi, kalau kosong anggap 0
    const finalData = {
        ...formData,
        price: parseInt(formData.price),
        hpp: formData.hpp ? parseInt(formData.hpp) : 0 
    };

    if (formData.id) {
      setMenuItems(menuItems.map(item => item.id === formData.id ? { ...finalData, image: item.image } : item));
    } else {
      let defaultIcon = '🍽️';
      if (formData.category === 'Coffee') defaultIcon = '☕';
      if (formData.category === 'Non-Coffee') defaultIcon = '🍹';
      if (formData.category === 'Snack') defaultIcon = '🍟';

      const newItem = { ...finalData, id: Date.now(), image: defaultIcon };
      setMenuItems([...menuItems, newItem]);
    }
    setIsModalOpen(false);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UtensilsCrossed className="text-emerald-600" /> Manajemen Menu
          </h1>
          <p className="text-gray-500 text-sm">Atur harga jual & HPP (Modal) produk.</p>
        </div>
        <button onClick={handleAddNew} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
          <Plus size={18} /> Tambah Menu
        </button>
      </div>

      {/* FILTER & SEARCH (SAMA SEPERTI SEBELUMNYA) */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border
              ${selectedCategory === cat ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Cari menu..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* MENU GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMenu.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
            <div className="h-40 bg-gray-100 flex items-center justify-center text-4xl relative">
              {item.image}
              <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${item.status === 'Tersedia' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                {item.status}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{item.category}</p>
                  <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{item.name}</h3>
                </div>
              </div>
              
              {/* Info Harga Jual & HPP */}
              <div className="mt-auto pt-4 border-t border-gray-50">
                  <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400">Harga Jual</span>
                      <span className="font-bold text-emerald-600 text-lg">{formatRupiah(item.price)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-gray-400">Modal (HPP)</span>
                      <span className="font-medium text-gray-500 text-sm">{item.hpp ? formatRupiah(item.hpp) : 'Rp 0'}</span>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors flex justify-center"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex justify-center"><Trash2 size={16} /></button>
                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredMenu.length === 0 && <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200"><p>Menu tidak ditemukan.</p></div>}

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-gray-800 text-lg">{formData.id ? 'Edit Menu' : 'Tambah Menu Baru'}</h3>
                  <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Menu</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-emerald-500 outline-none" 
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Contoh: Kopi Susu" />
                  </div>
                  
                  {/* Grid Harga Jual & HPP */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-1">Harga Jual</label>
                      <input type="number" className="w-full px-4 py-2 border border-emerald-200 bg-emerald-50 rounded-xl focus:ring-emerald-500 outline-none font-bold text-emerald-700" 
                        value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Modal (HPP)</label>
                      <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-emerald-500 outline-none" 
                        value={formData.hpp} onChange={e => setFormData({...formData, hpp: e.target.value})} placeholder="0" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-emerald-500 outline-none"
                        value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                          {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-emerald-500 outline-none"
                        value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                          <option value="Tersedia">Tersedia</option>
                          <option value="Habis">Habis</option>
                      </select>
                    </div>
                  </div>

                  {/* Info Margin */}
                  {formData.price && formData.hpp && (
                      <div className="bg-blue-50 p-3 rounded-xl flex justify-between items-center text-sm">
                          <span className="text-blue-600">Keuntungan per item:</span>
                          <span className="font-bold text-blue-800 flex items-center gap-1">
                              <TrendingUp size={14}/> {formatRupiah(formData.price - formData.hpp)}
                          </span>
                      </div>
                  )}

                  <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 mt-2">
                    Simpan Menu
                  </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Menu;