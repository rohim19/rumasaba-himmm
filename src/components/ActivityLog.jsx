import React, { useState, useEffect } from 'react';
import { History, Search, Trash2, Clock, User, Activity, FileText } from 'lucide-react';

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Ambil data log saat loading
  useEffect(() => {
    const savedLogs = localStorage.getItem('rumaSabaLogs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  // Fungsi Bersihkan Log (Hanya Admin yang harusnya bisa)
  const clearLogs = () => {
    if(window.confirm("Yakin mau hapus semua riwayat aktivitas?")) {
        localStorage.removeItem('rumaSabaLogs');
        setLogs([]);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.change.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <History className="text-emerald-600" /> Activity Log
          </h1>
          <p className="text-gray-500 text-sm">Rekaman jejak aktivitas pengguna (CCTV Sistem).</p>
        </div>
        <button onClick={clearLogs} className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Trash2 size={16}/> Bersihkan History
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex gap-3 items-center">
        <Search className="text-gray-400 ml-2" size={20} />
        <input type="text" placeholder="Cari aktivitas, user, atau perubahan..." 
            className="w-full outline-none text-gray-700 font-medium"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {/* TABLE LOG */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 flex items-center gap-2"><Clock size={16}/> Waktu</th>
                        <th className="px-6 py-4"><div className="flex items-center gap-2"><User size={16}/> User</div></th>
                        <th className="px-6 py-4"><div className="flex items-center gap-2"><Activity size={16}/> Aktivitas</div></th>
                        <th className="px-6 py-4"><div className="flex items-center gap-2"><FileText size={16}/> Perubahan Data</div></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredLogs.length === 0 ? (
                        <tr><td colSpan="4" className="p-8 text-center text-gray-400">Belum ada aktivitas tercatat.</td></tr>
                    ) : (
                        filteredLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap font-mono text-xs">
                                    {log.time}
                                </td>
                                <td className="px-6 py-4 font-bold text-emerald-700">
                                    <span className="bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                                        @{log.username}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-800">
                                    {log.activity}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {log.change}
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

export default ActivityLog;