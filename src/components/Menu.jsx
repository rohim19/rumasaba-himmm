import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Plus, Search, Edit2, Trash2, X, Archive } from 'lucide-react';

const Menu = () => {
  // --- DATABASE DATA DEFAULT (Buat Demo di HP Teman) ---
  
  // 1. SUPPLIES STANDAR
  const standardSupplies = [
    { stockId: 15, qty: 1, name: 'Cup Plastik', unit: 'pcs' },
    { stockId: 18, qty: 1, name: 'Es Batu', unit: 'es' }, 
    { stockId: 16, qty: 1, name: 'Sedotan', unit: 'pcs' },
    { stockId: 17, qty: 1, name: 'Kantong Plastik', unit: 'pcs' }
  ];

  // 2. DAFTAR MENU LENGKAP
  const defaultMenu = [
    // --- COFFEE BASE ---
    { 
      id: 101, name: 'Americano', category: 'Coffee', price: 15000, hpp: 5000, status: 'Tersedia', 
      recipe: [{ stockId: 1, qty: 10, name: 'Biji Kopi', unit: 'gr' }, ...standardSupplies]
    },
    { 
      id: 102, name: 'Long Black', category: 'Coffee', price: 15000, hpp: 6000, status: 'Tersedia', 
      recipe: [{ stockId: 1, qty: 20, name: 'Biji Kopi', unit: 'gr' }, ...standardSupplies]
    },
    { 
      id: 103, name: 'Lemon Tonic Coffee', category: 'Coffee', price: 18000, hpp: 7500, status: 'Tersedia', 
      recipe: [{ stockId: 1, qty: 10, name: 'Biji Kopi', unit: 'gr' }, { stockId: 5, qty: 1, name: 'Lemon', unit: 'pcs' }, ...standardSupplies]
    },
    { 
      id: 104, name: 'Kopi Tubruk', category: 'Coffee', price: 10000, hpp: 3000, status: 'Tersedia', 
      recipe: [{ stockId: 1, qty: 10, name: 'Biji Kopi', unit: 'gr' }, { stockId: 15, qty: 1, name: 'Cup', unit: 'pcs' }]
    },
    { 
      id: 105, name: 'Kopi Konglomerat', category: 'Coffee', price: 20000, hpp: 9000, status: 'Tersedia', 
      recipe: [{ stockId: 1, qty: 10, name: 'Biji Kopi', unit: 'gr' }, { stockId: 2, qty: 100, name: 'Susu UHT', unit: 'ml' }, { stockId: 8, qty: 10, name: 'Creamer', unit: 'gr' }, ...standardSupplies]
    },
    
    // --- LATTE SERIES ---
    { 
      id: 201, name: 'Caffe Latte', category: 'Coffee', price: 18000, hpp: 8000, status: 'Tersedia', 
      recipe: [{ stockId: 1, qty: 10, name: 'Biji Kopi', unit: 'gr' }, { stockId: 2, qty: 100, name: 'Susu UHT', unit: 'ml' }, { stockId: 3, qty: 23, name: 'SKM', unit: 'gr' }, { stockId: 8, qty: 10, name: 'Creamer', unit: 'gr' }, ...standardSupplies]
    },
    { 
      id: 202, name: 'Butterscotch Latte', category: 'Coffee', price: 22000, hpp: 10000, status: 'Tersedia', 
      recipe: [{ stockId: 1, qty: 10, name: 'Biji Kopi', unit: 'gr' }, { stockId: 2, qty: 100, name: 'Susu UHT', unit: 'ml' }, { stockId: 11, qty: 20, name: 'Sirup Butterscotch', unit: 'ml' }, { stockId: 8, qty: 10, name: 'Creamer', unit: 'gr' }, ...standardSupplies]
    },
    { 
      id: 203, name: 'Caramel Latte', category: 'Coffee', price: 22000, hpp: 10000, status: 'Tersedia', 
      recipe: [{ stockId: 1, qty: 10, name: 'Biji Kopi', unit: 'gr' }, { stockId: 2, qty: 100, name: 'Susu UHT', unit: 'ml' }, { stockId: 12, qty: 20, name: 'Sirup Caramel', unit: 'ml' }, { stockId: 8, qty: 10, name: 'Creamer', unit: 'gr' }, ...standardSupplies]
    },
    { 
      id: 204, name: 'Hazelnut Latte', category: 'Coffee', price: 22000, hpp: 10000, status: 'Tersedia', 
      recipe: [{ stockId: 1, qty: 10, name: 'Biji Kopi', unit: 'gr' }, { stockId: 2, qty: 100, name: 'Susu UHT', unit: 'ml' }, { stockId: 13, qty: 20, name: 'Sirup Hazelnut', unit: 'ml' }, { stockId: 8, qty: 10, name: 'Creamer', unit: 'gr' }, ...standardSupplies]
    },
    { 
      id: 205, name: 'Vanilla Latte', category: 'Coffee', price: 22000, hpp: 10000, status: 'Tersedia', 
      recipe: [{ stockId: 1, qty: 10, name: 'Biji Kopi', unit: 'gr' }, { stockId: 2, qty: 100, name: 'Susu UHT', unit: 'ml' }, { stockId: 14, qty: 20, name: 'Sirup Vanilla', unit: 'ml' }, { stockId: 8, qty: 10, name: 'Creamer', unit: 'gr' }, ...standardSupplies]
    },

    // --- MATCHA SERIES ---
    { 
      id: 301, name: 'Matcha Latte', category: 'Non-Coffee', price: 20000, hpp: 9000, status: 'Tersedia', 
      recipe: [{ stockId: 2, qty: 100, name: 'Susu UHT', unit: 'ml' }, { stockId: 3, qty: 23, name: 'SKM', unit: 'gr' }, { stockId: 6, qty: 4, name: 'Matcha', unit: 'gr' }, { stockId: 8, qty: 10, name: 'Creamer', unit: 'gr' }, ...standardSupplies]
    },
    { 
      id: 302, name: 'Dirty Matcha', category: 'Coffee', price: 23000, hpp: 11000, status: 'Tersedia', 
      recipe: [{ stockId: 1, qty: 10, name: 'Biji Kopi', unit: 'gr' }, { stockId: 2, qty: 100, name: 'Susu UHT', unit: 'ml' }, { stockId: 3, qty: 36, name: 'SKM', unit: 'gr' }, { stockId: 6, qty: 4, name: 'Matcha', unit: 'gr' }, { stockId: 8, qty: 10, name: 'Creamer', unit: 'gr' }, ...standardSupplies]
    },
    { 
      id: 303, name: 'Matcha Konglomerat', category: 'Non-Coffee', price: 22000, hpp: 10000, status: 'Tersedia', 
      recipe: [{ stockId: 2, qty: 100, name: 'Susu UHT', unit: 'ml' }, { stockId: 3, qty: 10, name: 'SKM', unit: 'gr' }, { stockId: 6, qty: 4, name: 'Matcha', unit: 'gr' }, { stockId: 9, qty: 10, name: 'Gula Aren', unit: 'ml' }, { stockId: 8, qty: 10, name: 'Creamer', unit: 'gr' }, ...standardSupplies]
    },

    // --- NON-COFFEE & TEA ---
    { 
      id: 401, name: 'Choco Latte', category: 'Non-Coffee', price: 18000, hpp: 8000, status: 'Tersedia', 
      recipe: [{ stockId: 2, qty: 100, name: 'Susu UHT', unit: 'ml' }, { stockId: 3, qty: 25, name: 'SKM', unit: 'gr' }, { stockId: 7, qty: 6, name: 'Coklat', unit: 'gr' }, { stockId: 8, qty: 10, name: 'Creamer', unit: 'gr' }, ...standardSupplies]
    },
    { 
      id: 501, name: 'Chocolatos', category: 'Non-Coffee', price: 5000, hpp: 2500, status: 'Tersedia', 
      recipe: [...standardSupplies] 
    },
    { 
      id: 502, name: 'Good Day (S)', category: 'Non-Coffee', price: 5000, hpp: 2500, status: 'Tersedia', 
      recipe: [...standardSupplies] 
    },
    { 
      id: 503, name: 'Good Day (M)', category: 'Non-Coffee', price: 7000, hpp: 3500, status: 'Tersedia', 
      recipe: [...standardSupplies] 
    },

    // --- TEA ---
    { 
      id: 402, name: 'Jasmine Tea', category: 'Tea', price: 8000, hpp: 3000, status: 'Tersedia', 
      recipe: [{ stockId: 4, qty: 200, name: 'Teh', unit: 'ml' }, { stockId: 10, qty: 30, name: 'Gula Pasir', unit: 'gr' }, ...standardSupplies]
    },
    { 
      id: 403, name: 'Milk Tea', category: 'Tea', price: 12000, hpp: 5000, status: 'Tersedia', 
      recipe: [{ stockId: 4, qty: 200, name: 'Teh', unit: 'ml' }, { stockId: 3, qty: 15, name: 'SKM', unit: 'gr' }, { stockId: 10, qty: 30, name: 'Gula Pasir', unit: 'gr' }, ...standardSupplies]
    },
    { 
      id: 404, name: 'Lime Tea / Krampul', category: 'Tea', price: 10000, hpp: 4000, status: 'Tersedia', 
      recipe: [{ stockId: 4, qty: 200, name: 'Teh', unit: 'ml' }, { stockId: 5, qty: 1, name: 'Lemon', unit: 'pcs' }, { stockId: 10, qty: 30, name: 'Gula Pasir', unit: 'gr' }, ...standardSupplies]
    },
  ];

  // --- STATE ---
  const [menuItems, setMenuItems] = useState(() => {
    const savedMenu = localStorage.getItem('rumaSabaMenu');
    // 👇 LOGIKA UTAMA: Kalau ada data, pakai data. Kalau kosong, pakai defaultMenu.
    return savedMenu ? JSON.parse(savedMenu) : defaultMenu; 
  });

  const [stockItems, setStockItems] = useState([]); 

  useEffect(() => {
    localStorage.setItem('rumaSabaMenu', JSON.stringify(menuItems));
    const savedStok = localStorage.getItem('rumaSabaStok');
    if(savedStok) setStockItems(JSON.parse(savedStok));
  }, [menuItems]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    id: null, name: '', price: '', hpp: '', category: 'Coffee', status: 'Tersedia', recipe: [] 
  });
  const [tempIngredient, setTempIngredient] = useState({ stockId: '', qty: '' });
  const categories = ['All', 'Coffee', 'Non-Coffee', 'Tea', 'Snack'];

  // --- CCTV / LOGGER ---
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

  // --- LOGIKA RESEP ---
  const addIngredientToRecipe = () => {
    if(!tempIngredient.stockId || !tempIngredient.qty) return alert("Pilih bahan dan jumlahnya bro!");
    const selectedStock = stockItems.find(s => s.id === parseInt(tempIngredient.stockId));
    if(!selectedStock) return;

    const newRecipeItem = {
        stockId: selectedStock.id,
        name: selectedStock.name, 
        unit: selectedStock.unit, 
        qty: parseInt(tempIngredient.qty)
    };
    setFormData({ ...formData, recipe: [...(formData.recipe || []), newRecipeItem] });
    setTempIngredient({ stockId: '', qty: '' });
  };

  const removeIngredient = (index) => {
    const updatedRecipe = [...formData.recipe];
    updatedRecipe.splice(index, 1);
    setFormData({ ...formData, recipe: updatedRecipe });
  };

  // --- CRUD LOGIC ---
  const handleAddNew = () => {
    setFormData({ id: null, name: '', price: '', hpp: '', category: 'Coffee', status: 'Tersedia', recipe: [] });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setFormData({ ...item, recipe: item.recipe || [] });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => { 
    if (window.confirm(`Hapus menu ${item.name}?`)) {
      setMenuItems(menuItems.filter(m => m.id !== item.id));
      logActivity('Delete Menu', `Menghapus menu: ${item.name}`);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return alert('Nama dan Harga wajib diisi!');

    const finalData = {
        ...formData,
        price: parseInt(formData.price),
        hpp: formData.hpp ? parseInt(formData.hpp) : 0,
        recipe: formData.recipe || [] 
    };

    if (formData.id) {
      // MODE EDIT
      const oldItem = menuItems.find(item => item.id === formData.id);
      let changes = [];
      
      if(oldItem.name !== finalData.name) changes.push(`Nama: ${oldItem.name} -> ${finalData.name}`);
      if(oldItem.price !== finalData.price) changes.push(`Harga: ${oldItem.price} -> ${finalData.price}`);
      if(oldItem.hpp !== finalData.hpp) changes.push(`HPP: ${oldItem.hpp} -> ${finalData.hpp}`);
      if(JSON.stringify(oldItem.recipe) !== JSON.stringify(finalData.recipe)) changes.push(`Update Resep Bahan`);

      setMenuItems(menuItems.map(item => item.id === formData.id ? { ...finalData, image: item.image } : item));
      
      if(changes.length > 0) {
          logActivity('Edit Menu', `Mengubah ${finalData.name}: ${changes.join(', ')}`);
      }

    } else {
      // MODE TAMBAH BARU
      let defaultIcon = '🍽️';
      if (formData.category === 'Coffee') defaultIcon = '☕';
      if (formData.category === 'Non-Coffee') defaultIcon = '🍹';
      if (formData.category === 'Tea') defaultIcon = '🍵';
      
      setMenuItems([...menuItems, { ...finalData, id: Date.now(), image: defaultIcon }]);
      
      logActivity('Add Menu', `Menambahkan menu baru: ${finalData.name} (Harga: ${finalData.price})`);
    }
    setIsModalOpen(false);
  };

  const filteredMenu = menuItems.filter(item => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });
  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UtensilsCrossed className="text-emerald-600" /> Manajemen Menu
          </h1>
          <p className="text-gray-500 text-sm">Atur menu dan resep bahan baku.</p>
        </div>
        <button onClick={handleAddNew} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md"><Plus size={18} /> Tambah Menu</button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>{cat}</button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Cari menu..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-emerald-500 outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMenu.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
            <div className="h-40 bg-gray-100 flex items-center justify-center text-4xl relative">
              {item.image || (item.category === 'Coffee' ? '☕' : '🍹')}
              <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${item.status === 'Tersedia' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{item.status}</div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="mb-2">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{item.category}</p>
                <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{item.name}</h3>
              </div>
              <div className="mb-4 flex-1">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Archive size={12}/> Resep ({item.recipe ? item.recipe.length : 0} bahan):</p>
                  <div className="flex flex-wrap gap-1">
                      {item.recipe && item.recipe.slice(0, 3).map((r, idx) => (<span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">{r.name}</span>))}
                      {item.recipe && item.recipe.length > 3 && <span className="text-[10px] text-gray-400">+{item.recipe.length - 3} lagi</span>}
                  </div>
              </div>
              <div className="mt-auto pt-4 border-t border-gray-50">
                  <div className="flex justify-between items-center mb-1"><span className="text-xs text-gray-400">Jual</span><span className="font-bold text-emerald-600">{formatRupiah(item.price)}</span></div>
                  <div className="flex justify-between items-center mb-3"><span className="text-xs text-gray-400">Modal</span><span className="font-medium text-gray-500 text-sm">{formatRupiah(item.hpp || 0)}</span></div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors flex justify-center"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(item)} className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex justify-center"><Trash2 size={16} /></button>
                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
           <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-gray-800 text-lg">{formData.id ? 'Edit Menu & Resep' : 'Tambah Menu Baru'}</h3>
                  <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
              </div>
              <div className="overflow-y-auto p-6 space-y-6">
                  <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-800 border-b pb-2">1. Info Produk</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2"><label className="block text-xs font-medium text-gray-500 mb-1">Nama Menu</label><input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Harga Jual</label><input type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 outline-none font-bold text-emerald-600" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">HPP (Modal)</label><input type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 outline-none" value={formData.hpp} onChange={e => setFormData({...formData, hpp: e.target.value})} /></div>
                         <div><label className="block text-xs font-medium text-gray-500 mb-1">Kategori</label><select className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>{categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                      </div>
                  </div>
                  <div className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-2"><h4 className="text-sm font-bold text-gray-800">2. Resep (Pengurangan Stok)</h4><span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded">Stok terpotong otomatis saat ada transaksi</span></div>
                      <div className="flex gap-2 items-end bg-blue-50 p-3 rounded-xl border border-blue-100">
                          <div className="flex-1"><label className="block text-[10px] text-blue-600 font-bold mb-1">Pilih Bahan Baku</label><select className="w-full text-xs px-2 py-2 border border-blue-200 rounded-lg outline-none" value={tempIngredient.stockId} onChange={e => setTempIngredient({...tempIngredient, stockId: e.target.value})}><option value="">-- Pilih Stok --</option>{stockItems.map(s => (<option key={s.id} value={s.id}>{s.name} (Sisa: {s.stock} {s.unit})</option>))}</select></div>
                          <div className="w-20"><label className="block text-[10px] text-blue-600 font-bold mb-1">Jml Pakai</label><input type="number" className="w-full text-xs px-2 py-2 border border-blue-200 rounded-lg outline-none" placeholder="0" value={tempIngredient.qty} onChange={e => setTempIngredient({...tempIngredient, qty: e.target.value})} /></div>
                          <button onClick={addIngredientToRecipe} type="button" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"><Plus size={16}/></button>
                      </div>
                      <div className="space-y-2">{(formData.recipe && formData.recipe.length > 0) ? (formData.recipe.map((r, idx) => (<div key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-sm"><span className="text-gray-700 font-medium">{r.name}</span><div className="flex items-center gap-3"><span className="text-gray-500 bg-white px-2 py-0.5 rounded border text-xs">{r.qty} {r.unit}</span><button onClick={() => removeIngredient(idx)} type="button" className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={14}/></button></div></div>))) : (<p className="text-center text-xs text-gray-400 py-2 italic">Belum ada bahan baku yang diatur.</p>)}</div>
                  </div>
              </div>
              <div className="p-4 border-t border-gray-100 bg-gray-50"><button onClick={handleSave} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">Simpan Menu & Resep</button></div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Menu;